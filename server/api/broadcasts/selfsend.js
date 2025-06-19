

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // валидация
  
    const response = await fetch('https://carclicker.ru/api/broadcasts/test?x_key=super-secret-key', {
      method: 'POST',
        headers: {
    'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
  },
      body: body
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка внешнего API: ${response.status} - ${errorText}`)
    }
   
    
    return {success:true, message: "вы успешно отправили сообщение только себе"}
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})