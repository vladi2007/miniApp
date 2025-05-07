// // server/api/wsProxy.js
// import { defineEventHandler } from 'h3';
// import WebSocket from 'ws';

// export default defineEventHandler(async (event) => {
//   const clientId = event.context.params.client_id;  // Получаем client_id из URL запроса
//   const backendWsUrl = `wss://carclicker.ru/ws/${clientId}`; // URL для подключения к вашему WebSocket на backend

//   // Создаем WebSocket-соединение с сервером backend
//   const ws = new WebSocket(backendWsUrl);

//   // Устанавливаем обработчик для получения сообщений от backend
//   ws.on('message', (message) => {
//     // Отправляем сообщения обратно клиенту через HTTP-соединение
//     event.res.write(message);
//   });

//   // Отправка данных от клиента на backend
//   event.node.req.on('data', (data) => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(data);  // Прокси-сообщение от клиента на сервер
//     }
//   });

//   // Обработка ошибок WebSocket
//   event.node.req.on('error', (error) => {
//     console.error('Error with WebSocket connection:', error);
//     event.res.statusCode = 500;
//     event.res.end('WebSocket connection error');
//   });

//   // Обработка ошибок на стороне backend WebSocket
//   ws.on('error', (error) => {
//     console.error('Error with backend WebSocket:', error);
//     event.res.statusCode = 500;
//     event.res.end('Backend WebSocket connection error');
//   });

//   // Закрытие WebSocket-соединения при завершении обработки
//   event.res.on('close', () => {
//     ws.close();
//   });
// });


// import WebSocket from 'ws'
// import http from 'http'

// const server = http.createServer()
// const wss = new WebSocket.Server({ noServer: true })

// wss.on('connection', (clientSocket, request) => {
//   const url = new URL(request.url || '', `http://${request.headers.host}`)
//   const clientId = url.pathname.split('/').pop()

//   const backendSocket = new WebSocket(`wss://carclicker.ru/ws/${clientId}`)

//   backendSocket.on('open', () => {
//     clientSocket.on('message', message => backendSocket.send(message))
//     backendSocket.on('message', message => clientSocket.send(message))
//   })

//   backendSocket.on('close', () => clientSocket.close())
//   clientSocket.on('close', () => backendSocket.close())
// })

// server.on('upgrade', (request, socket, head) => {
//   const url = new URL(request.url || '', `http://${request.headers.host}`)
//   if (url.pathname.startsWith('/ws/')) {
//     wss.handleUpgrade(request, socket, head, ws => {
//       wss.emit('connection', ws, request)
//     })
//   } else {
//     socket.destroy()
//   }
// })

// export default defineEventHandler(async (event) => {
//   const req = event.node.req
//   const socket = (req as any).socket
//   const head = Buffer.alloc(0)
//   server.emit('upgrade', req, socket, head)
// })
