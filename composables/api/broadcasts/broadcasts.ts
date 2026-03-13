// отправить рассылку
export const postBroadcast = async (broadcastData: FormData): Promise<{ status: string }> => {
  const { $api } = useNuxtApp()
  const res = await $api.post(`/broadcasts/send`, broadcastData, { headers: {
    'Content-Type': 'multipart/form-data',
  } })
  return res.data
}