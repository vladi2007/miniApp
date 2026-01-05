export default defineEventHandler(async (event) => {
    const { telegram_id,participant_username ,role } = getQuery(event)

  if (!telegram_id) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing telegram_id',
    })
  }

  const response = await fetch(`https://devvoshod08.ru/api/organization/participants?x_key=super-secret-key&telegram_id=${telegram_id}&participant_username=${participant_username}&role=${role}`, {method:"POST"})

  if (!response.ok) {
    const error = await response.json()
    throw createError({
      statusCode: response.status, // например 409
      statusMessage:
        error?.detail || 'Failed to add participant',
      data: error,
    })
  }

  const data = await response.json()
  return data
})