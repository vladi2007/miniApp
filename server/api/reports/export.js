import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

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

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const reportsDir = path.join(__dirname, '..', 'public', 'reports')
    await mkdir(reportsDir, { recursive: true })

    const fileName = `report-${Date.now()}.xlsx`
    const filePath = path.join(reportsDir, fileName)

    await writeFile(filePath, buffer)

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
