<script setup lang="ts">
const props = defineProps<{
  onStatus: (status: string) => void
  
}>()


</script>

<template>
  <div class="question_leader_buttons_fon">
    <div class = "question_leader_buttons">
        <div><button class = "goto_end" @click="onStatus('end')">
            Завершить
        </button></div>
       <div> <button class="pause"@click="onStatus('pause')">
            Пауза
        </button></div>
       <div> <button class="continue" @click="onStatus('pause')">
            Продолжить
        </button></div>
    </div>
  </div>
</template>

<style>

</style>
