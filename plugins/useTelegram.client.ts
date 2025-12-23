import { defineNuxtPlugin, useState } from '#app'
import { useWebApp } from 'vue-tg'

export default defineNuxtPlugin(async () => {
  const webApp = useWebApp()

  const telegramUser = useState<number | null>('telegramUser', () => null)
  const userRole = useState<string | null>('userRole', () => null)

    const cachedId = localStorage.getItem('telegram_id')
    if (cachedId) {
      telegramUser.value = Number(cachedId)
    }

  if (webApp.isReady && webApp.initDataUnsafe?.user?.id) {
    telegramUser.value = webApp.initDataUnsafe.user.id
    localStorage.setItem('telegram_id', String(telegramUser.value))
  }

  if (telegramUser.value) {
    try {
      const roleData = await $fetch('/api/role', {
        query: { telegram_id: telegramUser.value }
      })
      userRole.value = roleData
    } catch (err) {
      console.error('Failed to fetch user role:', err)
    }
  }

  return {
    provide: {
      telegramUser,
      userRole
    }
  }
})
