<script setup>
import { ref } from 'vue'

const userInput = ref('')
const products = ref(null)

const fetchData = async () => {
  if (userInput.value.trim() === '') return
  const { data } = await useFetch(`/api/carclicker/${encodeURIComponent(userInput.value)}`)
  products.value = data.value
}

</script>

<template>
  <div>
    <input v-model="userInput" placeholder="Введите параметр" />
    <button @click="fetchData">Отправить</button>
    <pre>{{ products }}</pre>
  </div>
</template>

<style scoped>
pre {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
}
</style>
