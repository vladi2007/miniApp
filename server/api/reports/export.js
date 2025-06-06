import { writeFile } from 'fs/promises'
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
      throw new Error(`Ошибка внешнего API: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Генерируем уникальное имя файла (можно заменить на более надёжный способ)
    const fileName = `report-${Date.now()}.xlsx`
    const filePath = join(process.cwd(), 'public', 'reports', fileName)
    
    // Сохраняем файл в публичную папку
    await writeFile(filePath, buffer)

    // Возвращаем ссылку на скачивание
    return {
      url: `reports/report-1749210004234.xlsx`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})
