<script setup lang="ts">

// imports
import { saveToLocaleStorage, loadFromLocalStorage, clearLocalStorage } from '~/utils/deviceStorage'

// data from backend
const props = defineProps<{
  onStatus: (status: string) => void
  pause: string
}>()

// key for localStorage
const route = useRoute()
const interactiveId = route.params.id as string
const localStorageKey = `isPaused_${interactiveId}`

// flag for change button
const isPaused = ref(false)

// change button
function togglePause() {
  isPaused.value = !isPaused.value
  saveToLocaleStorage(localStorageKey, isPaused.value)
  props.onStatus('pause')
}

// end interactive
function endInteractive() {
  props.onStatus('end')
}

//watcher for button
watch(() => props.pause, (newWal) => {
  if (newWal === "yes") {
    isPaused.value = true
  }
  else if (newWal === "no") {
    isPaused.value = false
  }
}, { immediate: true }
)

// load button state from localStorage
onMounted(() => {
  const storedValue = loadFromLocalStorage(localStorageKey)
  isPaused.value = storedValue !== null ? storedValue : false

})
const emit = defineEmits(['show','close'])
</script>

<template>
  <div class="question_leader_buttons_fon">
    <div class="question_leader_buttons">
      <div>
        <div class="goto_end" @click="emit('show')" style="cursor: pointer;">
          Завершить
        </div>
      </div>
      <div>
        <div :class="isPaused ? 'continue' : 'pause'" @click="togglePause" style="cursor: pointer;">
          {{ isPaused ? 'Продолжить' : 'Пауза' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
