import type { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios'
import type { QueryClient } from '@tanstack/query-core'
import { useAuthStore } from '~/store/auth'

export interface ApiErrorDetail {
  message: string
  code: string
}

export interface ApiErrorResponse {
  detail: ApiErrorDetail
}

interface CustomAxiosError extends AxiosRequestConfig{
  _retry?:boolean
}
// handler ошибок аутентификации и авторизации и т.д
let refreshPromise: Promise<boolean> | null = null

async function refreshAndRetry(
  auth: ReturnType<typeof useAuthStore>,
  config: CustomAxiosError,
  $api: AxiosInstance,
  $queryClient: QueryClient
) {
  config._retry = true

  if (!refreshPromise) {
    refreshPromise = auth.refreshToken().finally(() => {
      refreshPromise = null
    })
  }

  const refreshed = await refreshPromise

  if (refreshed) {
    if (auth.accessToken) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${auth.accessToken}`
    }

    $queryClient.invalidateQueries()

    return $api(config)
  }

  await auth.clear()
  return null
}


export async function handleAuthError(error: AxiosError<ApiErrorResponse>) {
  const auth = useAuthStore()
  const { $api } = useNuxtApp()
  const status = error.response?.status
  const { $queryClient } = useNuxtApp()
  const config = error.config as any
  const code = error.response?.data?.detail?.code
  if (!config) {
    return Promise.reject(error)
  }

  if (config._retry) {
    return Promise.reject(error)
  }
  
  // невалидный access
  if (status === 401 && code == 'INVALID_ACCESS_TOKEN'){
    const result = await refreshAndRetry(auth, config, $api, $queryClient)
    if (result) return result

    return Promise.reject(error)
  }

  if (status === 401 &&(code === 'INVALID_REFRESH_TOKEN' || code === 'MISSING_REFRESH_TOKEN')) {
    // пусть 401 - код ошибки, что refresh token истёк, тогда чистим сессию
    if (auth.isAuthenticated){
      await auth.clear()
      const router=useRouter()
      router.push('/')
    }
    return Promise.reject(error)
  }
 
  // изменилась роль
  if ((status === 403 && code == 'INACTIVE_USER') ) {
    const result = await refreshAndRetry(auth, config, $api, $queryClient)
    if (result) return result
    return Promise.reject(error)
  }
  return Promise.reject(error)
}
