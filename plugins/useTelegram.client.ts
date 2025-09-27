export default defineNuxtPlugin(() => {
  const initDataUnsafe = ref(null)

  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp

    initDataUnsafe.value = tg.initDataUnsafe ?? null

    // сохраняем в sessionStorage
    sessionStorage.setItem('telegram_init_data', JSON.stringify(initDataUnsafe.value))
  }

  return {
    provide: {
      telegram: {
        initDataUnsafe
      }
    }
  }
})
