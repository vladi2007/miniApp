import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'

const port = 4000 // любой порт, не конфликтующий с Nuxt

const server = createServer()
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', (clientSocket) => {
  console.log('Клиент подключился')

  const clientId = Math.floor(Math.random() * 100000)
  const backendSocket = new WebSocket(`wss://carclicker.ru/ws/${clientId}`)

  clientSocket.on('message', (msg) => {
    if (backendSocket.readyState === WebSocket.OPEN) {
      backendSocket.send(msg.toString())
    }
  })

  backendSocket.on('message', (msg) => {
    clientSocket.send(msg.toString())
  })

  backendSocket.on('close', () => {
    clientSocket.close()
  })

  backendSocket.on('error', () => {
    clientSocket.close()
  })

  clientSocket.on('close', () => {
    backendSocket.close()
  })
})

server.listen(port, () => {
  console.log(`WebSocket-прокси запущен на ws://localhost:${port}/ws`)
})
