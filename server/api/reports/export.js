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

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const reportsDir = join(process.cwd(), 'public', 'reports')

    // Создаем папку, если её нет
    await mkdir(reportsDir, { recursive: true })

    // Генерируем имя файла
    const fileName = `report-${Date.now()}.xlsx`
    const filePath = join(reportsDir, fileName)

    // Записываем файл
    await writeFile(filePath, buffer)

    // Возвращаем путь к файлу относительно public, чтобы фронтенд мог скачать
    return {
     url: `/reports/${fileName}`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})