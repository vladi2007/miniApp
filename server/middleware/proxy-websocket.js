import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  ws: true, // Разрешаем WebSocket проксирование
  target: 'wss://carclicker.ru',  // Адрес бэкенда
  changeOrigin: true,  // Изменение источника
});

export default defineEventHandler((event) => {
  if (event.req.headers.upgrade === 'websocket') {
    return new Promise((resolve, reject) => {
      proxy.ws(event.req, event.res, event.req.headers, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
});
