<script setup lang="ts">
const props = defineProps<{
  onStatus: (status: string) => void
  pause: string
}>()
import { saveToLocaleStorage, loadFromLocalStorage, clearLocalStorage } from '~/utils/deviceStorage'
const route = useRoute()
const interactiveId = route.params.id as string
const localStorageKey = `isPaused_${interactiveId}`
// Состояние паузы: true — пауза активна, false — неактивна
// Читаем состояние из localStorage при инициализации
const isPaused = ref(false)// вызов функции от родительского компонента для отправки флага пауза интерактива на бекенд
// Функция записи состояния в localStorage

function togglePause() {
  isPaused.value = !isPaused.value
  saveToLocaleStorage(localStorageKey, isPaused.value)
  props.onStatus('pause')
}
// вызов функции от родительского компонента для отправки флага конец интерактива на бекенд
function endInteractive() {
  props.onStatus('end')
}

watch(() => props.pause, (newWal) => {
  if (newWal === "yes") {
    isPaused.value = true
  }
  else if (newWal === "no") {
    isPaused.value = false
  }



}, { immediate: true }
)

onMounted(() => {
  const storedValue = loadFromLocalStorage(localStorageKey)
  isPaused.value = storedValue !== null ? storedValue : false

})
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

<style></style>
