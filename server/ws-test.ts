// import { WebSocketServer, WebSocket } from 'ws'



// export default defineNitroPlugin((nitroApp) => {
//   const wss = new WebSocketServer();

//   wss.on('connection', (wsClient) => {
//     console.log('Клиент подключен к фронтенду');

//     // Подключение к бекенду
//     const backendWs = new WebSocket('wss://carclicker.ru/ws/123');

//     backendWs.on('open', () => {
//       console.log('Соединение с бекендом установлено');

//       // Проксирование сообщений от клиента к бекенду
//       wsClient.on('message', (message) => {
//         backendWs.send(message.toString());
//       });

//       // Проксирование сообщений от бекенда к клиенту
//       backendWs.on('message', (message) => {
//         wsClient.send(message.toString());
//       });
//     });

//     // Закрытие соединений
//     wsClient.on('close', () => {
//       backendWs.close();
//     });

//     backendWs.on('close', () => {
//       wsClient.close();
//     });
//   });

//   const nodeServer = (nitroApp.h3App as any).server;
//   if (nodeServer) {
//     nodeServer.on('upgrade', (req: any, socket: any, head: any) => {
//       if (req.url === '/ws') {
//         wss.handleUpgrade(req, socket, head, (ws) => {
//           wss.emit('connection', ws, req);
//         });
//       }
//     });
//   }
// });

