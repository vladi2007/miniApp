export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { telegram_id, x_key } = query

  const body =readBody(event)

  try {
    const response = await fetch(
      `https://carclicker.ru/api/reports/preview?x_key=super-secret-key&telegram_id=${telegram_id}`,
      {
        // здесь можно добавить headers если нужно
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    
    const data = await response.json()
   
    return data
  } catch (error) {
    return { success: false, error: error.message || error }
  }
})
