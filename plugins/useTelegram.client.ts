import { defineNuxtPlugin, useState } from '#app'
import { useWebApp } from 'vue-tg'

export default defineNuxtPlugin(async () => {
  const webApp = useWebApp()

  const telegramUser = useState<number | null>('telegramUser', () => null)
  const userName = useState<string | null>('userName', () => null)
  const userPhoto = useState<string | null>('userPhoto', () => null)
    const cachedId = localStorage.getItem('telegram_id')
    if (cachedId) {
      telegramUser.value = Number(cachedId)
    }
    const cachedName =localStorage.getItem('userName')
    if (cachedName){
      userName.value= String(cachedName)
    }
    const cachedPhoto = localStorage.getItem('userPhoto')
    if (cachedPhoto){
      userPhoto.value=String(cachedPhoto)
    }
  if (webApp.isReady && webApp.initDataUnsafe?.user?.id) {
    telegramUser.value = webApp.initDataUnsafe.user.id
    localStorage.setItem('telegram_id', String(telegramUser.value))
    userName.value = webApp.initDataUnsafe.user.username
    localStorage.setItem('userName', String(userName.value))
    userPhoto.value=webApp.initDataUnsafe.user.photo_url
    localStorage.setItem('userPhoto',String(userPhoto.value) )
  }

  

  return {
    provide: {
      telegramUser,
    }
  }
})
