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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const reportsDir = path.join(__dirname, '..', 'public', 'reports');
    
    console.log(process.cwd())
    // Сохраняем файл в публичную папку
    await writeFile(reportsDir, buffer)

    // Возвращаем ссылку на скачивание
    return {
      url: `https://voshod07.ru/public/reports/${fileName}`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})
