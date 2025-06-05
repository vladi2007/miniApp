<script setup lang="ts">
const props = defineProps<{
  onStatus: (status: string) => void
}>()

// Состояние паузы: true — пауза активна, false — неактивна
const isPaused = ref(false)

function togglePause() {
  isPaused.value = !isPaused.value
  props.onStatus('pause')
}

function endInteractive() {
  props.onStatus('end')
}
</script>

<template>
  <div class="question_leader_buttons_fon">
    <div class="question_leader_buttons">
      <div>
        <button class="goto_end" @click="endInteractive">
          Завершить
        </button>
      </div>
      <div>
        <button :class="isPaused ? 'continue' : 'pause'" @click="togglePause">
          {{ isPaused ? 'Продолжить' : 'Пауза' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>

</style>
