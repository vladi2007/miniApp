<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CountdownData } from '~/types/stageData'
import nav_bar from '~/components/main_menu/nav_bar.vue'
import general_settings from '~/components/interactive_editor/general_settings.vue'
import { ref } from 'vue'
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'
// передача функции для сохранения
const generalSettingsRef = ref<InstanceType<typeof general_settings> | null>(null)
const FORM_STORAGE_KEY = 'interactive_form_draft'
const CURRENT_INDEX_KEY = 'interactive_current_index'
const STEP_KEY = 'interactive_editor_step'


// для маршрутизации
const route = useRouter()
// этап редактирования: общие данные, и вопросы
const step = ref(1)
// для смены этапа редактирования
function handleBackClick() {
  if (step.value === 1) {
    showConfirmPopup.value = true
  } else {
    step.value = 1

  }
}
// для получения параметров из url
const router = useRoute()

const mode = computed(() => router.params.mode as string)
const id = computed(() => router.params.id as string)
// флаг для попапа с подтверждением  сохранения
const showConfirmPopup = ref(false)
// функция для возвращения на страницу с интерактивами после сохранения
async function confirmBack(save: boolean) {
  if (save && generalSettingsRef.value) {
    const success = await generalSettingsRef.value.saveInteractive()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/interactives')
    }
    else { showConfirmPopup.value = false }
  } else {
    showConfirmPopup.value = false
    clearDeviceStorage(FORM_STORAGE_KEY)
    clearDeviceStorage(CURRENT_INDEX_KEY)
    clearDeviceStorage(STEP_KEY)


    route.push('/leader/interactives')
  }
}
watch(step, (newStep) => {
  saveToDeviceStorage(STEP_KEY, newStep.toString())
})
onMounted(() => {
  const storedStep = loadFromDeviceStorage(STEP_KEY)

  if (storedStep !== null && !isNaN(Number(storedStep))) {
    step.value = Number(storedStep)
    console.log('Загружен step из хранилища:', storedStep)
  } else {
    console.log('Step не найден в хранилище или невалиден:', storedStep)
  }
})


</script>

<template>
  <div class="interactive_editor">

    <nav_bar />
    <div class="interactive_edit_top_menu">
      <div>
        <button class="interactive_edit_backButton" @click="handleBackClick()"
          :class="{ back_to_all_settings: step === 2 }">
          {{ step === 1 ? 'Вернуться' : 'Вернуться к общим настройкам' }}
        </button>

      </div>
      <div class="interactive_edit_top_menu_header" :class="{ margin_left_question: step === 2 }">
        {{ step === 1 ? 'Общие настройки интерактива' : 'Создание вопросов' }}

      </div>

    </div>
    <div v-if="showConfirmPopup" class="interactive_edit_popup-overlay">
      <div class="interactive_edit_popup-content">
        <div class="interactive_edit_popup-text">Сохранить настройки перед выходом из редактирования викторины?</div>
        <div class="interactive_edit_popup-actions">
          <button @click="confirmBack(true)" class="interactive_edit_popup-btn save">Да</button>
          <button @click="confirmBack(false)" class="interactive_edit_popup-btn cancel">Нет</button>
        </div>
      </div>
    </div>
    <general_settings ref="generalSettingsRef" :step="step" @update-step="step = $event" :mode="mode" :key="step" />
  </div>
</template>

<style>
@import url("~/assets/css/interactive_editor/interactive_editor.scss");
</style>
