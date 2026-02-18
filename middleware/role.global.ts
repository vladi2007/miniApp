import { useState, useRoute, useRouter } from '#app'
export default defineNuxtRouteMiddleware(async (to, from) => {
  const telegramUser = useState<number | null>('telegramUser')
  const userRole = useState<{ role: string } | null>('userRole')
  if (!telegramUser.value) return 
   
    const router=useRouter()
  if (telegramUser.value) {
    try {
      const roleData = await $fetch("/api/role", {
        query: { telegram_id: telegramUser.value },
      });
      userRole.value = roleData;
      
    } catch (err) {
      console.error("Failed to fetch user role:", err);
    }
  }    
  
  if (to.path !=='/not_leader' && userRole.value?.role !== 'admin' && userRole.value?.role !== 'leader' && userRole.value?.role !== 'organizer') {
       router.push('/not_leader')
  }
})
