import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 1000 * 60 * 30, refetchOnWindowFocus: false,
      refetchOnMount: false } },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
  return {
    provide: { queryClient: queryClient },
  }
})
