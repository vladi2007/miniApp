<script setup>
// import components and utils
import settings_nav from './settings_nav.vue'
import settings_main from './settings_main.vue'
import settings_questions from './settings_questions.vue'
import settings_save_popup from './settings_save_popup.vue'
// useRouter()
const route = useRouter()
const router = useRoute()

//mode
const mode = computed(() => router.params.mode)
const id = computed(() => router.params.id)
const userId = ref(0)

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

// constants
const { form, active_step, currentQuestion, currentQuestionIndex, loadDB, take_step, } = useInteractiveForm(mode.value, userId, id)
const { questionErrors, isFormComplete, errors, validateQuestions, validateForm, getIconSrcWithValidation } = useValidateForm(form, active_step, currentQuestion, currentQuestionIndex)
const { visibleStartIndex, visibleQuestions, addQuestion, deleteQuestion, scrollUp, scrollDown, handleWheelScroll } = useQuestionNavigator(form, currentQuestionIndex, questionErrors, errors)
const { imageUploaded, uploadedFileName, loadImageDB, handleFileChange, removeImage, imageUrls, } = useImage(currentQuestionIndex, form, currentQuestion)
const { loadFromBackend, getOriginalFileNameFromMeta } = useEdit(mode.value, userId, id, form, currentQuestionIndex, imageUrls)
const { isOpen, options, typeMap, selectedText, toggleDropdown, handleClickOutside, selectOption } = useTypeQuestion(form, currentQuestionIndex, questionErrors)
const { score, validateScore } = useScoreQuestion(currentQuestion)
const { deleteAnswer, toggleCorrect, getIconSrc, addAnswer, limit_answers } = useAnswerQuestion(currentQuestion)
const { showSavePopup, handleSave, handleStart } = useSave(route, active_step, form, validateForm, validateQuestions, mode, userId, id.value)

// save form to IndexedDB
async function handleBeforeUnload() {
  try {
    const plainForm = toRaw(form.value)
    await saveToDeviceStorage('interactive_form', plainForm)
  } catch (err) {
    console.error('Ошибка при сохранении формы перед обновлением:', err)
  }
}

//onUnmounted
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('click', handleClickOutside)
})

//flag

const isLoading=ref(false)


//onMounted
onMounted(async () => {
  await Promise.all([loadDB(), loadImageDB()]);
  document.addEventListener('click', handleClickOutside)
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
    const { $telegram } = useNuxtApp();
    userId.value = $telegram.initDataUnsafe.value?.user?.id;
  }
  if (mode.value === 'edit' || mode.value === 'duplicate') {
    await loadFromBackend(userId);
    await Promise.all(
      form.value.questions.map(async (q) => {
        const imageUrl = q.question.image;
        if (imageUrl) {
          // получаем оригинальное имя из метаданных
          q.question.uploadedFileName = await getOriginalFileNameFromMeta(
            imageUrl
          );

        }
      })
    );
    isLoading.value=true
  }
});


// popup for input type= file(image)
const isImagePopupOpen = ref(false);
function openImagePopup() {
  isImagePopupOpen.value = true;
}
function closeImagePopup() {
  isImagePopupOpen.value = false;
}

// for parent component
defineExpose({
  handleSave
})
</script>

<template>
  <div class="settings" v-if="mode !== 'edit' || isLoading">
    <settings_nav :take_step="take_step" :active_step="active_step" :isFormComplete="isFormComplete"
      :validateForm="validateForm" />
    <settings_main :take_step="take_step" :active_step="active_step" :errors="errors" :form="form"
      :isFormComplete="isFormComplete" :validateForm="validateForm" />
    <settings_questions v-model:score="score" :active_step="active_step" :form="form" :errors="errors"
      :isFormComplete="isFormComplete" :take_step="take_step" :validateForm="validateForm" :scrollUp="scrollUp"
      :handleWheelScroll="handleWheelScroll" :visibleQuestions="visibleQuestions"
      :currentQuestionIndex="currentQuestionIndex" :visibleStartIndex="visibleStartIndex" :scrollDown="scrollDown"
      :addQuestion="addQuestion" :deleteQuestion="deleteQuestion" :currentQuestion="currentQuestion"
      :questionErrors="questionErrors" :imageUploaded="imageUploaded" :handleFileChange="handleFileChange"
      :uploadedFileName="currentQuestion.question.uploadedFileName" :removeImage="removeImage"
      :toggleDropdown="toggleDropdown" :selectedText="selectedText" :isOpen="isOpen" :options="options"
      :selectOption="selectOption" :typeMap="typeMap" :score="score" :validateScore="validateScore"
      :addAnswer="addAnswer" :deleteAnswer="deleteAnswer" :toggleCorrect="toggleCorrect"
      :getIconSrcWithValidation="getIconSrcWithValidation" :limit_answers="limit_answers" :handleStart="handleStart"
      :showSavePopup="showSavePopup" :handleSave="handleSave"
      @updateCurrentQuestionIndex="currentQuestionIndex = $event" @showSave="showSavePopup = true"
      :imageUrls="imageUrls" />
    <settings_save_popup :showSavePopup="showSavePopup" :handleSave="handleSave" @closeSave="showSavePopup = false" />
    <!-- Попап загрузки изображения -->
    <teleport to="body">
      <div class="popup-backdrop" v-if="isImagePopupOpen" @click.self="closeImagePopup">
        <div class="popup-content">
          <div class="popup-content-header">Добавить файл</div>
          <div class="popup-content-uploader">
            <img src="/public/images/interactive_editor/uploader.svg" />
            <input type="file" accept="image/*" id="fileInput" hidden @change="handleFileChangeAndClose" />
            <label for="fileInput" class="upload-button">Выбрать файл</label>
          </div>
          <button @click="closeImagePopup">Отмена</button>
        </div>
      </div>
    </teleport>
  </div>
  
</template>
<style>
@import url("/assets/css/interactive_editor/settings.scss");
@import url("/assets/css/interactive_editor/settings_media.scss");
.no-scroll-device {
  overflow-y: hidden !important;
}
</style>