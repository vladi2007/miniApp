import { safeRequest } from "../api"
// отправить рассылку
export const postBroadcast = async (broadcastData: FormData) => {
  safeRequest(async () => {
    const { $api } = useNuxtApp()
  const res = await $api.post(`/broadcasts/send`, broadcastData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
  })
  
}
