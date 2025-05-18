// composables/useTelegram.ts
import { ref, onMounted } from 'vue'

export function useTelegram() {
  const webApp = ref(null)
  const contactData = ref(null)

  onMounted(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      webApp.value = window.Telegram.WebApp
      const store = useTgWebAppStore() // ✅ Вызываем store внутри onMounted
      contactData.value = store.contactData

      console.log('WebApp:', webApp.value)
    } else {
      alert("Открой через Telegram WebApp на телефоне")
    }
  })

  return {
    unsafeData: contactData
  }
}
