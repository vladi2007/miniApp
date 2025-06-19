import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const response = await fetch('https://carclicker.ru/api/reports/export?x_key=super-secret-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/octet-stream'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка внешнего API: ${response.status} - ${errorText}`)
    }

    // Получаем имя файла из заголовка Content-Disposition
    const contentDisposition = response.headers.get('content-disposition') || ''
    const match = contentDisposition.match(/filename="?([^"]+)"?/)
    const hostFilename = `report-${Date.now()}.xlsx`
    const fileName = match ? match[1] : `report-${Date.now()}.xlsx`
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const reportsDir = join(process.cwd(), 'public', 'reports')

    // Создаем папку, если её нет
    await mkdir(reportsDir, { recursive: true })

    // Генерируем имя файла
    
    const filePath = join(reportsDir, hostFilename)

    // Записываем файл
    await writeFile(filePath, buffer)
    
    // Возвращаем путь к файлу относительно public, чтобы фронтенд мог скачать
    return {
     url: `/reports/${hostFilename}`,
     userFileName: fileName
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})