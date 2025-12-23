

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const response = await fetch('https://voshod08.ru/api/reports/export?x_key=super-secret-key', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      body: JSON.stringify(body)
    })

   const data = await response.json()
   console.log(response)
    return {data: data.url, name:data.name}
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})