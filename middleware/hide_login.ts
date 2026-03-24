import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore()
  const router = useRouter()
  if (auth.isAuthenticated) {
    router.push('/main')
    return 
  }
})
