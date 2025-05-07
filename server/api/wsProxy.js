// server/api/wsProxy.js
import { defineEventHandler } from 'h3';
import WebSocket from 'ws';

export default defineEventHandler(async (event) => {
  const clientId = event.context.params.client_id;  // Получаем client_id из URL запроса
  const backendWsUrl = `wss://carclicker.ru/ws/${clientId}`; // URL для подключения к вашему WebSocket на backend

  // Создаем WebSocket-соединение с сервером backend
  const ws = new WebSocket(backendWsUrl);

  // Устанавливаем обработчик для получения сообщений от backend
  ws.on('message', (message) => {
    // Отправляем сообщения обратно клиенту через HTTP-соединение
    event.res.write(message);
  });

  // Отправка данных от клиента на backend
  event.node.req.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);  // Прокси-сообщение от клиента на сервер
    }
  });

  // Обработка ошибок WebSocket
  event.node.req.on('error', (error) => {
    console.error('Error with WebSocket connection:', error);
    event.res.statusCode = 500;
    event.res.end('WebSocket connection error');
  });

  // Обработка ошибок на стороне backend WebSocket
  ws.on('error', (error) => {
    console.error('Error with backend WebSocket:', error);
    event.res.statusCode = 500;
    event.res.end('Backend WebSocket connection error');
  });

  // Закрытие WebSocket-соединения при завершении обработки
  event.res.on('close', () => {
    ws.close();
  });
});
