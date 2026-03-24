import { VueQueryPlugin, QueryClient, QueryCache } from '@tanstack/vue-query'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '~/composables/api/handleAuthError'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry:false
        
      },
      
    },
    queryCache: new QueryCache({
      onError: async (err) =>{
        const error = err as AxiosError<ApiErrorResponse>
        const code = error.response?.data?.detail?.code
        console.log(code)
        switch (code) {
          case 'ORGANIZATION_NOT_FOUND':
            window.alert('Организация не найдена')
            break
          case 'INVALID_RANGE_NUMBERS':
            const route = useRoute()
            await navigateTo({
              path: route.path,
              query: {
                ...route.query,
                from_number: '0',
                to_number: '9',
              },
            })
            window.location.reload()
            break
          case 'INTERACTIVE_NOT_FOUND':
            window.alert('интерактив не найден')
            break
          case 'INTERACTIVE_ALREADY_END':
            window.alert('интерактив завершён ')
            break
          case 'INTERACTIVE_ALREADY_STARTED':
            window.alert('интерактив запущен ')
            break
          case 'CANNOT_ACCESS_FOREIGN_ORGANIZATION_INTERACTIVE':
            window.alert('нельзя получить информацию об интерактиве другой организаций ')
            break
        }
      }
    })
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })

  return {
    provide: { queryClient },
  }
})