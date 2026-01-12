import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'
import url from 'url'

const port = 4000
const server = createServer()
const wss = new WebSocketServer({ server, path: '/ws' })
const wsBack = process.env.NUXT_PUBLIC_WS_BACKEND
wss.on('connection', function connection(clientSocket, incoming_request) {
  const parsedUrl = url.parse(incoming_request.url, true)
  const query = parsedUrl.query
  
  const telegramId = query.telegram_id
  const role = query.role
  const xKey = query.x_key
const interactive_id = query.interactive_id

  let backendSocket = null
 
  clientSocket.on('message', (msg) => {
    try {
      const data = JSON.parse(msg)

      if (data.type === 'init' && data.id) {
        // Собираем URL с параметрами
        const backendUrl = `${wsBack}/${interactive_id}?telegram_id=${telegramId}&role=${role}&x_key=super-secret-key`
       

        backendSocket = new WebSocket(backendUrl)

        backendSocket.on('message', (backendMsg) => {
  
  clientSocket.send(backendMsg.toString())
})

        backendSocket.on('close', () => clientSocket.close())
        backendSocket.on('error', () => clientSocket.close())
      } else if (backendSocket?.readyState === WebSocket.OPEN) {
  backendSocket.send(msg.toString())
}
    } catch (err) {
      console.error('❌ Ошибка при разборе сообщения:', err)
    }
  })

  clientSocket.on('close', () => {
    if (backendSocket && backendSocket.readyState === WebSocket.OPEN) {
    backendSocket.close()
  }
  })
})

server.listen(port, () => {

})
