<script setup lang="ts">
// import keys for IndexedDB
import { FORM_STORAGE_KEY, CURRENT_INDEX_KEY, STEP_KEY, IMAGE_STATE_KEY } from '~/constants/interactiveKeys'

// import components and utils
import settings_nav from './settings_nav.vue'
import settings_main from './settings_main.vue'
import settings_questions from './settings_questions.vue'
import settings_save_popup from './settings_save_popup.vue'
// import composables
import { useInteractiveForm } from '~/composables/interactive_editor/useInteractiveForm'
import { useValidateForm } from '~/composables/interactive_editor/useValidateForm'
import { useQuestionNavigator } from '~/composables/interactive_editor/useQuestionNavigator'
import { useImage } from '~/composables/interactive_editor/useImage'
import { useTypeQuestion } from '~/composables/interactive_editor/useTypeQuestion'
import { useScoreQuestion } from '~/composables/interactive_editor/useScoreQuestion'
import { useAnswerQuestion } from '~/composables/interactive_editor/useAnswerQuestion'
import { useSave } from '~/composables/interactive_editor/useSave'
import { useEdit } from '~/composables/interactive_editor/useInteractiveEdit'
import { saveToDeviceStorage } from '~/utils/deviceStorageIndexedDB'
import { Confirm } from 'vue-tg'

import { onMounted, ref } from 'vue'
// useRouter()
const route = useRouter()
const router = useRoute()

// mode
const mode = computed(() => router.params.mode)
const id = computed(() => router.params.id)
const userId = useState('telegramUser')
const userRole = useState('userRole')

// constants
const { form, active_step, currentQuestion, currentQuestionIndex, loadDB, take_step } = useInteractiveForm(mode.value, userId, id)
const { questionErrors, isFormComplete, errors, validateQuestions, validateForm, getIconSrcWithValidation, isQuestionComplete } = useValidateForm(form, active_step, currentQuestion, currentQuestionIndex)
const { visibleStartIndex, visibleQuestions, addQuestion, deleteQuestion, scrollUp, scrollDown, handleWheelScroll, showDelete, showDeletefn } = useQuestionNavigator(form, currentQuestionIndex, questionErrors, errors)
const { imageUploaded, uploadedFileName, loadImageDB, handleFileChange, removeImage, imageUrls } = useImage(currentQuestionIndex, form, currentQuestion)
const { loadFromBackend, getOriginalFileNameFromMeta } = useEdit(mode.value, userId, id, form, currentQuestionIndex, imageUrls)
const { isOpen, options, typeMap, selectedText, toggleDropdown, handleClickOutside, selectOption } = useTypeQuestion(form, currentQuestionIndex, questionErrors)
const { score, validateScore } = useScoreQuestion(currentQuestion)
const { deleteAnswer, toggleCorrect, getIconSrc, addAnswer, limit_answers } = useAnswerQuestion(currentQuestion)
const { showSavePopup, handleSave, handleStart, showStart } = useSave(route, active_step, form, validateForm, validateQuestions, mode, userId, id.value)

// save form to IndexedDB
async function handleBeforeUnload() {
  try {
    const plainForm = toRaw(form.value)
    await saveToDeviceStorage('interactive_form', plainForm)
  }
  catch (err) {
    console.error('Ошибка при сохранении формы перед обновлением:', err)
  }
}

// onUnmounted
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('click', handleClickOutside)
})

// flags
const isLoading = ref(false)
const originalForm = ref<string>('')
// onMounted
onMounted(async () => {
  await Promise.all([loadDB(), loadImageDB()])
  document.addEventListener('click', handleClickOutside)
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    // вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
  }
  const savedForm = await loadFromDeviceStorage(FORM_STORAGE_KEY)
  if (savedForm) {
    form.value = savedForm
    isLoading.value = true
    return
  }
  if (mode.value === 'edit' || mode.value === 'duplicate') {
    await loadFromBackend(userId)
    await Promise.all(
      form.value.questions.map(async (q) => {
        const imageUrl = q.question.image
        if (imageUrl) {
          q.question.uploadedFileName = await getOriginalFileNameFromMeta(
            imageUrl,
          )
        }
      }),
    )
    isLoading.value = true
    await saveToDeviceStorage(FORM_STORAGE_KEY, toRaw(form.value))
    console.log('💾 Форма сохранена после загрузки с бэкенда')
    isLoading.value = true
    originalForm.value = snapshot(toRaw(form.value))
  }
})

function snapshot(formValue: any) {
  const copy = structuredClone(formValue)

  copy.questions?.forEach((q: any) => {
    delete q.question.position
    if (q.question._originalFileName !== undefined) {
      q.question.uploadedFileName = q.question._originalFileName
    }
  })

  return JSON.stringify(copy)
}

const isImagePopupOpen = ref(false)
function openImagePopup() {
  isImagePopupOpen.value = true
}
function closeImagePopup() {
  isImagePopupOpen.value = false
}
function isFormChanged() {
  return snapshot(toRaw(form.value)) !== originalForm.value
}
// for parent component
defineExpose({
  handleSave,
  isFormChanged,
})

const props = defineProps<{ confirmBack: () => void }>()

const isCheckMode = ref(false)

onMounted(() => {
  // 👇 читаем то что передали в router.push state
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
  }
})
</script>

<template>
  <div
    v-if="mode !== 'edit' || isLoading"
    class="settings"
  >
    <settings_nav
      :take_step="take_step"
      :active_step="active_step"
      :is-form-complete="isFormComplete"
      :validate-form="validateForm"
      :confirm-back="confirmBack"
    />
    <settings_main
      :take_step="take_step"
      :active_step="active_step"
      :errors="errors"
      :form="form"
      :is-form-complete="isFormComplete"
      :validate-form="validateForm"
    />
    <settings_questions
      v-model:score="score"
      :active_step="active_step"
      :form="form"
      :errors="errors"
      :is-form-complete="isFormComplete"
      :take_step="take_step"
      :validate-form="validateForm"
      :scroll-up="scrollUp"
      :handle-wheel-scroll="handleWheelScroll"
      :visible-questions="visibleQuestions"
      :current-question-index="currentQuestionIndex"
      :visible-start-index="visibleStartIndex"
      :scroll-down="scrollDown"
      :add-question="addQuestion"
      :delete-question="deleteQuestion"
      :current-question="currentQuestion"
      :question-errors="questionErrors"
      :image-uploaded="imageUploaded"
      :handle-file-change="handleFileChange"
      :uploaded-file-name="currentQuestion.question.uploadedFileName"
      :remove-image="removeImage"
      :toggle-dropdown="toggleDropdown"
      :selected-text="selectedText"
      :is-open="isOpen"
      :options="options"
      :select-option="selectOption"
      :type-map="typeMap"
      :score="score"
      :validate-score="validateScore"
      :add-answer="addAnswer"
      :delete-answer="deleteAnswer"
      :toggle-correct="toggleCorrect"
      :get-icon-src-with-validation="getIconSrcWithValidation"
      :limit_answers="limit_answers"
      :handle-start="handleStart"
      :show-save-popup="showSavePopup"
      :handle-save="handleSave"
      :show-start="showStart"
      :show-delete="showDelete"
      :image-urls="imageUrls"
      :is-question-complete="isQuestionComplete"
      @show-delete="showDeletefn"
      @cancel-delete="showDelete=false"
      @start="showStart=true"
      @cancel-start="showStart=false"
      @update-current-question-index="currentQuestionIndex = $event"
      @show-save="showSavePopup = true"
    />
    <settings_save_popup
      :show-save-popup="showSavePopup"
      :handle-save="handleSave"
      @close-save="showSavePopup = false"
    />
    <!-- Попап загрузки изображения -->
    <teleport to="body">
      <div
        v-if="isImagePopupOpen"
        class="popup-backdrop"
        @click.self="closeImagePopup"
      >
        <div class="popup-content">
          <div class="popup-content-header">
            Добавить файл
          </div>
          <div class="popup-content-uploader">
            <img src="/public/images/interactive_editor/uploader.svg">
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="handleFileChangeAndClose"
            >
            <label
              for="fileInput"
              class="upload-button"
            >Выбрать файл</label>
          </div>
          <button @click="closeImagePopup">
            Отмена
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style>
.no-scroll-device {
  overflow-y: hidden !important;
}
</style>
