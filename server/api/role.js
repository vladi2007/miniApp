export default defineEventHandler(async (event) => {
  const { telegram_id } = getQuery(event)

  if (!telegram_id) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing telegram_id',
    })
  }
const config = useRuntimeConfig().public
  const apiBase =config.apiBase
  const response = await fetch(`${apiBase}/api/organization/me/role?x_key=super-secret-key&telegram_id=${telegram_id}`)

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
