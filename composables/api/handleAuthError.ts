import type { AxiosError } from 'axios'
import { useAuthStore } from '~/store/auth'

// handler ошибок аутентификации и авторизации и т.д

export async function handleAuthError(error: AxiosError) {
  const auth = useAuthStore()
  const { $api } = useNuxtApp()
  if (error.response?.status === 401) {
    // пусть 401 - код ошибки, что access token истёк, тогда обновляем его и
    // и повторяем запрос

    const refreshed = await auth.refreshToken()

    if (refreshed && error.config) {
      // обновили токен, повторяем исходный запрос
      return $api(error.config)
    }
    // Любые коды состояния, выходящие за пределы диапазона 2xx,
    // вызывают срабатывание этой функции
    // Здесь можете сделать что-то с ошибкой ответа
    return Promise.reject(error)
  }
  if (error.response?.status === 402) {
    // пусть 401 - код ошибки, что refresh token истёк, тогда чистим сессию

    auth.clear()
    return Promise.reject(error)
  }
}
