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

// watcher for button
watch(() => props.pause, (newWal) => {
  if (newWal === 'yes') {
    isPaused.value = true
  }
  else if (newWal === 'no') {
    isPaused.value = false
  }
}, { immediate: true },
)

// load button state from localStorage
onMounted(() => {
  const storedValue = loadFromLocalStorage(localStorageKey)
  isPaused.value = storedValue !== null ? storedValue : false
})
const emit = defineEmits(['show', 'close'])
</script>

<template>
  <div :class="$style.buttons">
    <div :class="$style.buttons__end" style="cursor: pointer;" @click="emit('show')">
      Завершить
    </div>
    <div :class="$style.buttons__pause" style="cursor: pointer;" @click="togglePause">
      {{ isPaused ? 'Продолжить' : 'Пауза' }}
    </div>
  </div>
</template>

<style module lang="scss">
.buttons {

  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  width: calc(100%);
  margin-top: auto;
  padding-bottom: 80px;

  @media (min-width:1280px) {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: calc(20/1280*100dvw);
    margin-top: auto;
    top: 0;
    padding-left: calc(23/1280*100dvw);
    ;
    box-sizing: border-box;
  }

  &__end {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 8px;
    color: #853CFF;
    font-size: 16px;
    border: 1.5px solid #853CFF;

    @media (min-width:1280px) {
      font-size: clamp(32px, 2vw, 44px);
      width: calc(215/1280*100dvw);
      border: 2px solid #853CFF;
      height: calc(44/832*100dvh);
      ;
    }
  }

  &__pause {
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #853CFF;
    border-radius: 8px;
    color: white;
    font-size: 16px;

    @media (min-width:1280px) {
      font-size: clamp(32px, 2vw, 44px);
      width: calc(215/1280*100dvw);
      height: calc(44/832*100dvh);
      ;
    }
  }
}
</style>
