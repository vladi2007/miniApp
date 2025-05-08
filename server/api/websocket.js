// server/api/websocket.js
import WebSocket from 'ws';

export default defineEventHandler((event) => {
  const ws = new WebSocket.Server({ noServer: true });

  ws.on('connection', (socket) => {
    socket.on('message', (message) => {
      console.log('Message from client:', message);

      // Подключение к серверу бэкенда FastAPI
      const backendSocket = new WebSocket('https://carclicker.ru/ws/123');
      
      backendSocket.onopen = () => {
        backendSocket.send(message); // передаем сообщение на сервер backend
      };

      backendSocket.onmessage = (event) => {
        // Получаем ответ от бэкенда и отправляем его обратно на клиент
        socket.send(event.data);
      };

      backendSocket.onerror = (error) => {
        console.error('Backend WebSocket Error:', error);
      };

      backendSocket.onclose = () => {
        console.log('Backend WebSocket connection closed');
      };
    });
  });

  return ws;
});
