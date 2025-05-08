<template>
  <div>
    <input type="text" v-model="message" placeholder="Enter your message" />
    <button @click="sendMessage">Send Message</button>
    <p v-if="response">Response from backend: {{ response }}</p>
  </div>
</template>

<script setup>
const socket = useNuxtApp().$socket;
let message = '';
let response = ''; // Переменная для хранения ответа от бэкенда

function sendMessage() {
  console.log('Sending message:', message);

  if (message.trim()) {
    // Проверяем, открыт ли сокет
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ text: message }));
      console.log('Message sent to backend');
      message = '';  // очищаем поле ввода после отправки
    } else {
      console.error('WebSocket is not open. Current state:', socket.readyState);
    }
  } else {
    console.warn('Message is empty');
  }
}

// Обработчик сообщений от бэкенда
socket.onmessage = (event) => {
  console.log('Received from backend:', event.data);
  try {
    const data = JSON.parse(event.data);
    response = data.text;  // Сохраняем ответ от бэкенда
    console.log('Parsed response:', data);
  } catch (error) {
    console.error('Error parsing message:', error);
  }
};

socket.onopen = () => {
  console.log('WebSocket is open');
};

socket.onerror = (error) => {
  console.error('WebSocket error:', error);
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};
</script>
