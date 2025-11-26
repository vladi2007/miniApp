export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp()
  const userRole = nuxtApp.$userRole as Ref<string | null>

  // Если роль ещё не загрузилась, просто ждем
  if (!userRole.value) return

  if (to.path.startsWith('/leader') && userRole.value !== 'leader') {
    return navigateTo('/not_leader')
  }
})
