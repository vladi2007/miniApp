import { useAuthStore } from '~/store/auth'
import { handleAuthError } from '~/composables/api/handleAuthError'
import { api } from '~/composables/api/api'
export default defineNuxtPlugin((nuxtApp) => {
 
  api.interceptors.request.use(function (config) {
    // Здесь можете сделать что-нибудь с перед отправкой запроса
    const auth = useAuthStore()
    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }
    // Добавляется в конфиг запроса access_token
    return config
  }, function (error) {
    // Сделайте что-нибудь с ошибкой запроса
    return Promise.reject(error)
  })

  // тут ошибки ИМЕННО аутентификации и авторизации, access token истёк, refresh token истёк,
  // нет прав на выполение запроса
  // и также ошибки на "подставные" токены, "подставная" роль, "роль изменилась"
  api.interceptors.response.use(function (response) {
    // Любой код состояния, находящийся в диапазоне 2xx,
    // вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    return response
  }, async function (error) {
    await handleAuthError(error)
  })
  return {
    provide: { api: api },
  }
})
