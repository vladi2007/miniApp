import { useState, useRoute, useRouter } from '#app'
import { useWebApp } from 'vue-tg'
export default defineNuxtRouteMiddleware(async (to, from) => {
  const telegramUser = useState<number | null>('telegramUser')
  const userRole = useState<{ role: string } | null>('userRole')
  if (!telegramUser.value) return navigateTo('/not_access')
   
  const currentPath = from.path     
  const targetPath = to.path    
  const router = useRouter();
  
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
      return  navigateTo({path:'/not_leader'})
  }
})
