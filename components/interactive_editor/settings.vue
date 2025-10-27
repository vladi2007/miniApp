<script setup>
// import components and utils
import { VueDevice } from 'vue-devices'
import check_qestion from '../question/check_qestion.vue'
import settings_nav from './settings_nav.vue'
import settings_main from './settings_main.vue'
import settings_questions from './settings_questions.vue'
import settings_save_popup from './settings_save_popup.vue'
// useRouter()
const route = useRouter()

// import composables
import { useInteractiveForm } from '~/composables/interactive_editor/useInteractiveForm'
import { useValidateForm } from '~/composables/interactive_editor/useValidateForm'
import { useQuestionNavigator } from '~/composables/interactive_editor/useQuestionNavigator'
import { useImage } from '~/composables/interactive_editor/useImage'
import { useTypeQuestion } from '~/composables/interactive_editor/useTypeQuestion'
import { useScoreQuestion } from '~/composables/interactive_editor/useScoreQuestion'
import { useAnswerQuestion } from '~/composables/interactive_editor/useAnswerQuestion'
import { useSave } from '~/composables/interactive_editor/useSave'

import { saveToDeviceStorage } from '~/utils/deviceStorageIndexedDB'

// constants
const { form, active_step, currentQuestion, currentQuestionIndex, loadDB, take_step } = useInteractiveForm()
const { questionErrors, isFormComplete, errors, validateQuestions, validateForm, getIconSrcWithValidation } = useValidateForm(form, active_step, currentQuestion, currentQuestionIndex)
const { visibleCount, visibleStartIndex, visibleQuestions, addQuestion, deleteQuestion, scrollUp, scrollDown, handleWheelScroll } = useQuestionNavigator(form, currentQuestionIndex, questionErrors, errors)
const { imageUploaded, uploadedFileName, loadImageDB, handleFileChange, removeImage } = useImage(currentQuestionIndex, form)
const { isOpen, options, typeMap, selectedText, dropdownRef, toggleDropdown, handleClickOutside, selectOption } = useTypeQuestion(form, currentQuestionIndex, questionErrors)
const { score, validateScore } = useScoreQuestion(currentQuestion)
const { getAnswerCount, deleteAnswer, toggleCorrect, getIconSrc, addAnswer, limit_answers } = useAnswerQuestion(currentQuestion)
const { showSavePopup, handleSave, handleStart } = useSave(route, active_step, form, validateForm, validateQuestions)



async function handleBeforeUnload() {
  try {
    const plainForm = toRaw(form.value)
    await saveToDeviceStorage('interactive_form', plainForm)
  } catch (err) {
    console.error('Ошибка при сохранении формы перед обновлением:', err)
  }
}



onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('click', handleClickOutside)
})

//onMounted
onMounted(async () => {
  await Promise.all([loadDB(), loadImageDB()]);
  document.addEventListener('click', handleClickOutside)
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
    <div class="settings">
        <settings_nav :take_step="take_step" :active_step="active_step" :isFormComplete="isFormComplete"
            :validateForm="validateForm" />
        <settings_main :take_step="take_step" :active_step="active_step" :errors="errors" :form="form"
            :isFormComplete="isFormComplete" :validateForm="validateForm" />
        <settings_questions v-model:score="score" :active_step="active_step" :form="form" :errors="errors" :isFormComplete="isFormComplete"
            :take_step="take_step" :validateForm="validateForm" :scrollUp="scrollUp"
            :handleWheelScroll="handleWheelScroll" :visibleQuestions="visibleQuestions"
            :currentQuestionIndex="currentQuestionIndex" :visibleStartIndex="visibleStartIndex" :scrollDown="scrollDown"
            :addQuestion="addQuestion" :deleteQuestion="deleteQuestion" :currentQuestion="currentQuestion"
            :questionErrors="questionErrors" :imageUploaded="imageUploaded" :handleFileChange="handleFileChange"
            :uploadedFileName="uploadedFileName" :removeImage="removeImage" :toggleDropdown="toggleDropdown"
            :selectedText="selectedText" :isOpen="isOpen" :options="options" :selectOption="selectOption"
            :typeMap="typeMap" :score="score" :validateScore="validateScore" :addAnswer="addAnswer"
            :deleteAnswer="deleteAnswer" :toggleCorrect="toggleCorrect"
            :getIconSrcWithValidation="getIconSrcWithValidation" :limit_answers="limit_answers"
            :handleStart="handleStart" :showSavePopup="showSavePopup" :handleSave="handleSave" @updateCurrentQuestionIndex="currentQuestionIndex = $event" />

        <settings_save_popup :showSavePopup="showSavePopup" :handleSave="handleSave"/>
        
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