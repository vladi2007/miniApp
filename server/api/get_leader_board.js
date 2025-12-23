export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  

  const { telegram_id, interactive_id} = query


  try {
    // Тип явно указываем
    const response = await fetch(
      `https://voshod08.ru/api/interactivities/end/${interactive_id}?x_key=super-secret-key&telegram_id=${telegram_id}`
    )

    if (!response.ok) {
      // здесь response.json() — Promise<any>
      const error = await response.json()
      return { success: false, error }
    }

    const data = await response.json()
    return data
  } catch (error) {
    return error
  }
})
