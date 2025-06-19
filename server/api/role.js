export default defineEventHandler(async (event) => {
  const { telegram_id } = getQuery(event)

  if (!telegram_id) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing telegram_id',
    })
  }

  const response = await fetch(`https://carclicker.ru/api/users/me/role?x_key=super-secret-key&telegram_id=${telegram_id}`)

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Failed to fetch role from external API',
    })
  }

  const data = await response.json()

  return data
})
