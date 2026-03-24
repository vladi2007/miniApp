import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
    const router = useRouter()
  if (auth.role !== 'admin' && auth.role !== 'leader' && auth.role !== 'organizer') {
    router.push('/')
    return 
  }
})
