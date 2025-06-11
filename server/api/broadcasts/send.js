

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // валидация
  
    const response = await fetch('https://carclicker.ru/api/broadcasts/send?x_key=super-secret-key', {
      method: 'POST',
        headers: {
    'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
  },
      body: JSON.stringify(body)
    })
    console.log(response)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка внешнего API: ${response.status} - ${errorText}`)
    }
    console.log(response)
    
    return {success:true}
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})