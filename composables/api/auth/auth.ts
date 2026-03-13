import type { LoginCredentials, AccessToken } from "./auth.types"


// запрос на логин
export const postLogin = async (credentials: LoginCredentials): Promise<AccessToken> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/auth/login`, credentials)
  return res.data
}

// запрос на обновление access token
export const postRefreshToken = async (): Promise<AccessToken> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/auth/refresh`)
  return res.data
}

// получить все активные сессии
export const getAllActiveSessions = async (): Promise<string[]> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/auth/sessions`)
  return res.data
}

// удалить сессию
export const deleteActiveSession = async (token_id?: number): Promise<void> => {
  const { $api } = useNuxtApp()
  return await $api.delete(`/auth/sessions/${token_id}`)
}

// удалить все активные сессии
export const deleteAllActiveSessions = async (): Promise<void> => {
  const { $api } = useNuxtApp()
  return await $api.delete(`/auth/sessions_all`)
}

// запрос на регистрацию
export const postRegister = async (mail: string): Promise<LoginCredentials> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/auth/register`, mail)
  return res.data
}

// запрос на сброс пароля
export const postForgotPassword = async (mail: string): Promise<LoginCredentials> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/auth/forgot_password`, mail)
  return res.data
}
