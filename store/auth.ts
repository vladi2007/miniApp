import { decode } from 'jwt-js-decode'
import { navigateTo } from '#app'
import { postLogin, postRefreshToken, deleteActiveSession } from '~/composables/api/auth/auth'

export const useAuthStore = defineStore('auth', {

  state: () => ({
    role: '',
    isAuthenticated: false,
    accessToken: '', // Stored in memory only
    initialized: false,
    id: 0,
  }),

  actions: {
    async login(credentials: { password: string, username: string }) {
      try {
        const response = await postLogin(credentials)
        // получает jwt
        const decoded = decode(response.access_token)

        this.role = decoded.payload.role
        // записывает в store данные  о user
        this.isAuthenticated = true // флаг что user is Auth
        // Short-lived access token in memory
        this.accessToken = response.access_token
        this.id = decoded.payload.participant_id

        return navigateTo('/leader/new_interactives')
      }
      catch (error) {
        throw error;
      }
    },
    async clear() {
      // чистит store от данных
      try{
            this.role = ''
          this.isAuthenticated = false
          this.accessToken = ''
      }
      catch (error) {
        throw error;
      }
    },
    async logout() {
      try {
        await deleteActiveSession()
        await this.clear()
        return navigateTo('/')
      }

      catch (error) {
        throw error;
      }
    },
    async refreshToken() {
      try {
        const response = await postRefreshToken()
        // отдаёт refresh cookie

        // если бекенд вернул токен то записываем его в storage
        // получает jwt
        const decoded = decode(response.access_token)
        this.role = decoded.payload.role
        // записывает в store данные  о user
        this.isAuthenticated = true
        // флаг что user is Auth
        // Short-lived access token in memory
        this.id = decoded.payload.participant_id
        this.accessToken = response.access_token
        return true
      }
      catch (error) {
        return false
      }
    },
    async init() {
      try{
        if (this.initialized) return
      this.initialized = true
      await this.refreshToken()
      }catch (error) {
        throw error;
      }
      
    },
  },

})
