export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event)

  const { telegram_id,  id} = query



  try {
    // Тип явно указываем
    const response = await fetch(
      `https://voshod08.ru/api/interactivities/${id}?x_key=super-secret-key&telegram_id=${telegram_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
       
      }
    )

    if (!response.ok) {
      // здесь response.json() — Promise<any>
      const error = await response.json()
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
})
