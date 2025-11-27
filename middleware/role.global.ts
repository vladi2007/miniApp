import { useState, useRoute, useRouter } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  const userRole = useState<{ role: string } | null>('userRole')
  const route = useRoute()
  const router=useRouter()
  if (!userRole.value) return

  const currentPath = from.path     
  const targetPath = to.path          
  console.log(userRole.value?.role === 'leader')
    console.log(currentPath.startsWith('/leader') )
  if ( targetPath.includes('/leader')  && userRole.value?.role !== 'leader') {
      router.push('/not_leader')
  }
})
