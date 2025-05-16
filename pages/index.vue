<!-- <template>
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
    
</style> -->
<!-- <script>
import waiting  from '/components/waiting/waiting';  // Путь может отличаться в зависимости от структуры проекта

export default {
    components: {
        waiting,
      
    },
};

</script>

<template>
    <waiting/>
</template>

<style>

</style> -->

<!-- <script>
import timer  from '/components/countdown/timer';  // Путь может отличаться в зависимости от структуры проекта

export default {
    components: {
        timer,
      
    },
};

</script>

<template>
    <waiting/>
</template>

<style>

</style> -->
<script>
import question  from '/components/question/question';  // Путь может отличаться в зависимости от структуры проекта

export default {
    components: {
        question,
      
    },
};
import { onMounted } from 'vue';

onMounted(() => {
  // Проверяем, доступен ли Telegram.WebApp, если да, скрываем шапку
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    Telegram.WebApp.hide();
  }
});
</script>

<template>
    <question/>
</template>

<style>

</style>