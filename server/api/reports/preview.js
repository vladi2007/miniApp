export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { telegram_id,filter,from_number,to_number } = query


  try {
    const response = await fetch(
      `https://voshod08.ru/api/interactivities/me?x_key=super-secret-key&telegram_id=${telegram_id}&filter=${filter}&from_number=${from_number}&to_number=${to_number}`,
      {
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
