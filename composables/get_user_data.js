// // composables/useTelegram.ts
// import { ref, computed, onMounted } from 'vue'
// import { useTgWebAppStore } from '/stores/tgWebApp'
// const webApp = ref(null)
// const contactData = useTgWebAppStore().contactData
// export function useTelegram() {
//   onMounted(() => {
//     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
//       webApp.value = window.Telegram.WebApp
//       initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe
//       console.log(webApp.value)
//     }
//     if (!window.Telegram?.WebApp?.initDataUnsafe) {
//       alert("Открой через Telegram WebApp на телефоне");
//     }
//   })

//   const unsafeData = contactData


//   return {
//     unsafeData
//   }
// }
