import { defineNuxtPlugin, useState } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const telegramUser = useState('telegramUser', () => null)
  const userRole = useState('userRole', () => null)

    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      telegramUser.value = window.Telegram.WebApp.initDataUnsafe.user.id
      console.log('Telegram ID:', telegramUser.value)

      try {
        const roleData = await $fetch('/api/role', {
          query: { telegram_id: telegramUser.value }
        })
        userRole.value = roleData
        console.log('Role:', userRole.value)
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
