<script setup lang="ts">
const props = defineProps<{
  onStatus: (status: string) => void
  pause:string
}>()
const route = useRoute()
const interactiveId = route.params.id as string
const localStorageKey = `isPaused_${interactiveId}`
// Состояние паузы: true — пауза активна, false — неактивна
// Читаем состояние из localStorage при инициализации
const isPaused = ref(localStorage.getItem(localStorageKey) === 'true')// вызов функции от родительского компонента для отправки флага пауза интерактива на бекенд
// Функция записи состояния в localStorage
function savePauseState(state: boolean) {
  localStorage.setItem(localStorageKey, state.toString())
}
function togglePause() {
  isPaused.value = !isPaused.value
  savePauseState(isPaused.value)
  props.onStatus('pause')
}
// вызов функции от родительского компонента для отправки флага конец интерактива на бекенд
function endInteractive() {
  props.onStatus('end')
}

watch(() => props.pause, (newWal) => {
  if (newWal==="yes"){
    isPaused.value=true
  }
  else if(newWal ==="no"){
    isPaused.value=false
  }
  

  savePauseState(isPaused.value)
  
}, {immediate:true}
) 
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
