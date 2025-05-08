// plugins/websocket.js
export default defineNuxtPlugin(nuxtApp => {
    const socket = new WebSocket("ws://localhost:3000/api/websocket");
  
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message from backend:', data);
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  
    // Прокси-сокет для использования в других компонентах
    nuxtApp.provide('socket', socket);
  });
  