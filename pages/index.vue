<template>
  <div class="auth-status">
    <div v-if="status === 'loading'" class="status-message">Пожалуйста, подождите, аутентификация...</div>
    <div v-if="status === 'success'" class="status-message success">
      Аутентификация прошла успешно!
      <div class="user-info">
        <p><strong>Имя:</strong> {{ contactData.first_name }} {{ contactData.last_name }}</p>
        <p><strong>Телефон:</strong> {{ contactData.phone_number }}</p>
        <p><strong>ID пользователя:</strong> {{ contactData.user_id }}</p>
        <p><strong>Username:</strong> {{ contactData.username }}</p>
      </div>
    </div>
    <div v-if="status === 'error'" class="status-message error">Ошибка аутентификации. Попробуйте снова.</div>
  </div>
</template>

<script setup>
import { useAuthentication } from '/composables/auth_telegram'; // Путь к твоему composable

// Используем composable
const { status, contactData } = useAuthentication();

</script>

<style >
    
</style>
