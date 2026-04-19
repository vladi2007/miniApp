import { safeRequest } from '../api'
import type { LoginCredentials, AccessToken } from './auth.types'

// запрос на логин
export const postLogin = async (credentials: LoginCredentials) =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post(`/auth/login`, credentials, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return res.data
  })

// запрос на обновление access token
export const postRefreshToken = async () =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post(`/auth/refresh`)
    return res.data
  })

// получить все активные сессии
export const getAllActiveSessions = async () =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.get(`/auth/sessions`)
    return res.data
  })

// удалить сессию
export const deleteActiveSession = async () =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    await $api.delete(`/auth/sessions/current`)
  })

// удалить все активные сессии
export const deleteAllActiveSessions = async () =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    await $api.delete(`/auth/sessions_all`)
  })


// запрос на регистрацию
export const postRegister = async (email: string, role: string) =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post(`/auth/register`, null, { params: { email, role } })
    return res.data
  })

// запрос на сброс пароля
export const postForgotPassword = async (mail: string) =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post(`/auth/reset_password`, null, { params: { email: mail } })
    return res.data
  })

export const postAnonymLogin= async () =>{
  return safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post('/auth/anonym_login')
    return res.data
  })
}

export const postEmailLogin= async (email:string) =>{
  return safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.post('/auth/email_login', null, { params: { email: email } })
    return res.data
  })
}