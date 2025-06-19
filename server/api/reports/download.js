import { createReadStream, unlink } from 'fs'
import { join } from 'path'

export default defineEventHandler((event) => {
  const { file } = getQuery(event)
  if (!file || !file.match(/^report-\d+\.xlsx$/)) {
    event.res.statusCode = 400
    return 'Неверное имя файла'
  }

  const filePath = join(process.cwd(), 'private_reports', file)

  // Проверка, что файл существует
  try {
    // Можно проверить асинхронно, но для простоты — синхронно
    require('fs').accessSync(filePath)
  } catch {
    event.res.statusCode = 404
    return 'Файл не найден'
  }

  // Отдаем файл через поток
  event.res.setHeader('Content-Disposition', `attachment; filename="${file}"`)
  event.res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

  const stream = createReadStream(filePath)
  stream.pipe(event.res)

  stream.on('end', () => {
    unlink(filePath, (err) => {
      if (err) console.error('Ошибка удаления файла:', err)
  
    })
  })

  stream.on('error', (err) => {
    console.error('Ошибка при чтении файла:', err)
    if (!event.res.headersSent) {
      event.res.statusCode = 500
      event.res.end('Ошибка сервера')
    }
  })

 
  return event.node.res
})
