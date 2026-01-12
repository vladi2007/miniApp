export default defineEventHandler(async (event) => {
    const { telegram_id,filter } = getQuery(event)

  if (!telegram_id) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing telegram_id',
    })
  }
const config = useRuntimeConfig().public
  const apiBase =config.apiBase
  const response = await fetch(`${apiBase}/api/organization/participants?x_key=super-secret-key&telegram_id=${telegram_id}&filter=${filter}`)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch role from external API',
    })
  }

  const data = await response.json()
  console.log(data)
  return data
})