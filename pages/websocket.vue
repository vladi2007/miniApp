<script setup lang="ts">
// In prod: check if secure, then use wss://
// const wsUrl = window.location.protocol === 'https:' 
//   ? 'wss://voshod07.ru/ws'  // на продашкен 
//   : 'ws://localhost:4000/ws' // на локале так разворачивать

const { status, data, send, open, close } = useWebSocket("wss://voshod07.ru/ws")

const history = ref<string[]>([])
watch(data, (newValue) => {
  history.value.push(`${newValue}`)
})

const message = ref('')
function sendData(){
//   history.value.push(`client: ${message.value}`)
  send(message.value)
  message.value = ''
}
</script>

<template>
  <div>
    
    <h1>WebSocket - let's go!</h1>
    <form @submit.prevent="sendData">
      <input v-model="message">
      <button type="submit">Send</button>
    </form>
    <div>
      <p v-for="entry in history">{{ entry }}</p>
    </div>
  </div>
</template>