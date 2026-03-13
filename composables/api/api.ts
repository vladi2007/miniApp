import type { InteractivitiesListFilter, InteractivitiesList, Interactive, InteractiveState, InteractiveLeaderBoard, ReportData, MeInOrganization, OrganizationDescription, OrganizationParticipantsFilter, OrganizationParticipants, OrganizationParticipantRoleChange, LoginCredentials, AccessToken } from './api.types'

// инстанс axios с настроенным interceptors
const { $api } = useNuxtApp()

// список интерактивов
export const getInteractivities = async (filter: InteractivitiesListFilter, to_number: number, from_number: number): Promise<InteractivitiesList> => {
  const res = await $api.get(`/api/interactivities/me`, { params: { filter, to_number, from_number } })
  return res.data
}

// все данные интерактива
export const getInteractive = async (interactive_id: number): Promise<Interactive> => {
  const res = await $api.get(`/api/interactivities/${interactive_id}`, { params: { } })
  return res.data
}
// создать интерактив
export const postInteractive = async (formData: FormData): Promise<{ interactive_id: number }> => {
  const res = await $api.post(`/api/interactivities/`, formData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}
// изменить интерактив
export const patchInteractive = async (formData: FormData, interactive_id: number): Promise<{ interactive_id: number }> => {
  const res = await $api.patch(`/api/interactivities/${interactive_id}`, formData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}

// удалить интерактив
export const deleteInteractive = async (interactive_id: number): Promise<{ interactive_id: number }> => {
  const res = await $api.delete(`/api/interactivities/${interactive_id}`)
  return res.data
}

// получить состояние интерактива: заупщен\не запущен
export const getInteractiveState = async (interactive_id: number): Promise<InteractiveState> => {
  const res = await $api.get(`/api/interactivities/is_running/${interactive_id}`, { params: { } })
  return res.data
}

// получить таблицу лидеров интерактива
export const getInteractiveLeaderBoard = async (interactive_id: number): Promise<InteractiveLeaderBoard> => {
  const res = await $api.get(`/api/interactivities/end/${interactive_id}`, { params: { } })
  return res.data
}

// получить ссылку на сформированный отчёт(на хранилище s3)
export const postReport = async (reportData: ReportData): Promise<{ url: string, name: string }> => {
  const res = await $api.post(`/api/reports/export`, reportData)
  return res.data
}

// отправить рассылку
export const postBroadcast = async (broadcastData: FormData): Promise<{ status: string }> => {
  const res = await $api.post(`/api/broadcasts/send`, broadcastData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}

// получить данные о себе в организации
export const getMeInOrganization = async (): Promise<MeInOrganization> => {
  const res = await $api.get(`/api/organization/me/name?x_key=super-secret-key&telegram_id=5480613794`, { params: { } })
  return res.data
}

// изменить данные о себе в организации
export const patchMeInOrganization = async (name: string): Promise<MeInOrganization> => {
  const res = await $api.patch(`/api/organization/me/name`, { params: { name } })
  return res.data
}

// получить описание организации
export const getOrganizationDescription = async (): Promise<OrganizationDescription> => {
  const res = await $api.get(`/api/organization/description`, { params: { } })
  return res.data
}
// изменить описание организации
export const patchOrganizationDescription = async (organization_name: string, organization_description: string): Promise<OrganizationDescription> => {
  const res = await $api.patch(`/api/organization/description`, { params: { organization_name, organization_description } })
  return res.data
}

// получить список участников организации
export const getOrganizationParticipants = async (filter: OrganizationParticipantsFilter): Promise<OrganizationParticipants> => {
  const res = await $api.get(`/api/organization/participants`, { params: { filter } })
  return res.data
}

// изменить роль участника организации
export const patchOrganizationParticipantRole = async (participant_id: number, role: OrganizationParticipantRoleChange): Promise<OrganizationParticipants> => {
  const res = await $api.get(`/api/organization/participant_change_role`, { params: { role, participant_id } })
  return res.data
}

// запрос на логин
export const postLogin = async (credentials: LoginCredentials): Promise<AccessToken> => {
  const res = await $api.post(`/api/auth/login`, credentials)
  return res.data
}

// запрос на обновление access token
export const postRefreshToken = async (): Promise<AccessToken> => {
  const res = await $api.post(`/api/auth/refresh`)
  return res.data
}

// получить все активные сессии
export const getAllActiveSessions = async (): Promise<string[]> => {
  const res = await $api.get(`/api/auth/sessions`)
  return res.data
}

// удалить сессию
export const deleteActiveSession = async (token_id?: number): Promise<void> => {
  return await $api.delete(`/api/auth/sessions/${token_id}`)
}

// удалить все активные сессии
export const deleteAllActiveSessions = async (): Promise<void> => {
  return await $api.delete(`/api/auth/sessions_all`)
}

// запрос на регистрацию
export const postRegister = async (mail: string): Promise<LoginCredentials> => {
  const res = await $api.post(`/api/auth/register`, mail)
  return res.data
}

// запрос на сброс пароля
export const postForgotPassword = async (mail: string): Promise<LoginCredentials> => {
  const res = await $api.post(`/api/auth/forgot_password`, mail)
  return res.data
}
