import { decode } from 'jwt-js-decode'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    role: null,
    isAuthenticated: false,
    accessToken: null, // Stored in memory only
  }),

  actions: {
    async login(credentials: { pass: string, login: string }) {
      const { $api } = useNuxtApp()
      const router = useRouter()
      try {
        const response = await $api.post('/auth/login', credentials)
        // получает jwt
        const decoded = decode(response.data.accessToken)
        this.role = decoded.payload.role
        // записывает в store данные  о user
        this.isAuthenticated = true // флаг что user is Auth
        // Short-lived access token in memory
        this.accessToken = response.data.accessToken
      }
      catch {
        throw Error('login failed')
      }

      router.push({ name: 'main' })
    },
    async clear() {
      const router = useRouter()
      // чистит store от данных
      this.role = null
      this.isAuthenticated = false
      this.accessToken = null

      // редиректит на главную страницу
      router.push({ name: 'main' })
    },
    async logout() {
      try {
        const { $api } = useNuxtApp()
        await $api.delete('/auth/sessions/')
        this.clear()
      }

      catch {
        // ошибки самого запроса на логаут
        throw Error('')
      }
    },
    async refreshToken() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post('/auth/refresh')
        // отдаёт refresh cookie
        // если бекенд вернул токен то записываем его в storage
        // получает jwt
        const decoded = decode(response.data.accessToken)
        this.role = decoded.payload.role
        // записывает в store данные  о user
        this.isAuthenticated = true
        // флаг что user is Auth
        // Short-lived access token in memory
        this.accessToken = response.data.accessToken
        return true
      }
      catch {
        // тут ошибки самого запроса на рефреш
        throw Error('')
      }
    },
  },

})
