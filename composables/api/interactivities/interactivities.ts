import type { Interactive, InteractiveLeaderBoard, InteractiveState, InteractivitiesList, InteractivitiesListFilter } from "./interactivities.types"

// список интерактивов
export const getInteractivities = async (filter: InteractivitiesListFilter, to_number: number, from_number: number): Promise<InteractivitiesList> => {
 
  const { $api } = useNuxtApp()
  const res = await $api.get(`/interactivities/me`, { params: { filter, to_number, from_number } })
  return res.data
}

// все данные интерактива
export const getInteractive = async (interactive_id: number): Promise<Interactive> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/interactivities/${interactive_id}`, { params: { } })
  return res.data
}
// создать интерактив
export const postInteractive = async (formData: FormData): Promise<{ interactive_id: number }> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/interactivities/`, formData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}
// изменить интерактив
export const patchInteractive = async (formData: FormData, interactive_id: number): Promise<{ interactive_id: number }> => {
  const { $api } = useNuxtApp()
  const res = await $api.patch(`/interactivities/${interactive_id}`, formData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}

// удалить интерактив
export const deleteInteractive = async (interactive_id: number): Promise<{ interactive_id: number }> => {
  const { $api } = useNuxtApp()
  const res = await $api.delete(`/interactivities/${interactive_id}`)
  return res.data
}

// получить состояние интерактива: заупщен\не запущен
export const getInteractiveState = async (interactive_id: number): Promise<InteractiveState> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/interactivities/is_running/${interactive_id}`, { params: { } })
  return res.data
}

// получить таблицу лидеров интерактива
export const getInteractiveLeaderBoard = async (interactive_id: number): Promise<InteractiveLeaderBoard> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/interactivities/end/${interactive_id}`, { params: { } })
  return res.data
}