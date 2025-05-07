<template>
    <div>
      <h1>WebSocket Chat</h1>
      <h2>Your ID: {{ clientId }}</h2>
      <form @submit.prevent="sendMessage">
        <input type="text" v-model="message" placeholder="Type your message" autocomplete="off"/>
        <button type="submit">Send</button>
      </form>
      <ul id="messages">
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        clientId: Date.now(),
        message: "",
        ws: null,
        messages: []
      };
    },
    mounted() {
      this.connectToWebSocket();
    },
    methods: {
      connectToWebSocket() {
        this.ws = new WebSocket(`wss://voshod07.ru/ws/${this.clientId}`);
  
        // When the WebSocket connection is established
        this.ws.onopen = () => {
          console.log("Connected to WebSocket");
        };
  
        // When a message is received from the server
        this.ws.onmessage = (event) => {
          this.messages.push(event.data);
        };
  
        // When the WebSocket is closed
        this.ws.onclose = () => {
          console.log("Disconnected from WebSocket");
        };
  
        // Handle any errors that occur
        this.ws.onerror = (error) => {
          console.log("WebSocket Error: ", error);
        };
      },
  
      sendMessage() {
        if (this.message.trim() !== "") {
          this.ws.send(this.message);
          this.message = "";  // Clear the input field after sending the message
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  
  form {
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 5px 0;
  }
  </style>
  