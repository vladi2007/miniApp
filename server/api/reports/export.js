export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('📦 Тело запроса на сервер:', body)

    const response = await fetch('https://carclicker.ru/api/reports/export?x_key=super-secret-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      },
      body: JSON.stringify(body)
    })

    console.log('🔁 Ответ от внешнего сервера:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Ошибка внешнего API:', errorText)
      throw new Error(`Ошибка внешнего API: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()

    const headers = new Headers()
    headers.set('Content-Type', 'application/octet-stream')
    headers.set('Content-Disposition', 'attachment; filename="report.xlsx"')

    return new Response(arrayBuffer, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('🚨 Ошибка в эндпоинте /api/reports/export:', error)
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
})