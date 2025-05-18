<script setup lang="ts">
import { ref, watch, computed } from 'vue'




const props = defineProps<{
  
  timer: string  // Используем тип WaitingData
}>()
console.log(props.timer)

</script>

<template>
  <div class="question_timer">
    <div class="question_logo">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
    </div>

    <p class="question_timer-text">Времени осталось: {{timer}}</p>

    <!-- Серый фон -->
    <div class="question_grey-line">
      <!-- Прогресс -->
      <div class="question_green-line" ></div>
    </div>
  </div>
</template>

<style >

</style>