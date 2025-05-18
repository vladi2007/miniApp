// server.js
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import url from 'url'
const port = 4000
const server = createServer()
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', function connection(clientSocket, incoming_request)  {
//   console.log('Клиент подключился')
//  console.log(incoming_request.url);
  // const query = url.parse(incoming_request.url, true).query
  // const telegramId = query.telegram_id
  // const secretKey = query.secret_key

  // console.log('✅ telegram_id:', telegramId)
  // console.log('🔑 secret_key:', secretKey)
  let backendSocket = null
  
  clientSocket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg)

      // Ждём первое сообщение с ID
      if (data.type === 'init' && data.id) {
        backendSocket = new WebSocket(`wss://carclicker.ru/ws/${data.id}`)

        backendSocket.on('message', (backendMsg) => {
          // Просто пересылаем всё клиенту как есть
          clientSocket.send(backendMsg.toString())
        })

        backendSocket.on('close', () => clientSocket.close())
        backendSocket.on('error', () => clientSocket.close())
      } else if (backendSocket?.readyState === WebSocket.OPEN) {
        backendSocket.send(msg.toString())
      }
    } catch (err) {
      console.error('Ошибка при разборе сообщения:', err)
    }
  })

  clientSocket.on('close', () => {
    if (backendSocket) backendSocket.close()
  })
})

server.listen(port, () => {
  console.log(`WebSocket-прокси работает на ws://localhost:${port}/ws`)
})
