import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
   await auth.init()
   return
})
