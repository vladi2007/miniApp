<script setup lang="ts">
import { VueDevice } from 'vue-devices';
import check_qestion from '../question/check_qestion.vue'

const props = defineProps<{
    // основные параметры
    active_step: string
    form: any
    errors: any
    isFormComplete: boolean
    imageUrls: any
    // навигация между шагами
    take_step: (step: string) => void
    validateForm: () => boolean

    // навигация по вопросам
    scrollUp: () => void
    scrollDown: () => void
    handleWheelScroll: (event: WheelEvent) => void
    visibleQuestions: any[]
    currentQuestionIndex: number
    visibleStartIndex: number
    addQuestion: () => void
    deleteQuestion: () => void
    showDelete:any
    // текущий вопрос и ошибки
    currentQuestion: any
    questionErrors: Record<number, any>

    // изображение для вопроса
    imageUploaded: boolean
    handleFileChange: (event: Event) => void
    uploadedFileName: string
    removeImage: () => void

    // тип вопроса (dropdown)
    toggleDropdown: () => void
    selectedText: string
    isOpen: boolean
    options: string[]
    selectOption: (option: string) => void
    typeMap: Record<string, string>

    // баллы и их проверка
    score: number
    validateScore: () => void

    // ответы
    addAnswer: () => void
    deleteAnswer: (index: number) => void
    toggleCorrect: (index: number) => void
    getIconSrcWithValidation: (
        type: string,
        isCorrect: boolean,
        correctAnswers: any,
        index: number,
        question: any
    ) => string
    limit_answers: boolean

    // действия с сохранением и запуском
    handleStart: () => void
    showSavePopup: boolean
    handleSave: () => void
    showStart:any,
    isQuestionComplete:any
}>()

const emit = defineEmits(['update:score', 'updateCurrentQuestionIndex', 'showSave', 'start','cancelStart','showDelete','cancelDelete'])

function updateScore(event: Event) {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:score', value)
  props.validateScore()
}
import { onMounted, ref } from 'vue'

const isCheckMode = ref(false)

onMounted(() => {
  // 👇 читаем то что передали в router.push state
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
    
  }
})

</script>


<template>
     <div class="container" >
    <div class="settings_questions" v-if="active_step === 'questions'" >
        <div class="settings_questions_nav">
            <img src="/public/images/interactive_editor/question_up.svg" id="up" @click="scrollUp()" />
            <div class="question_buttons_list" @wheel="handleWheelScroll">
                <div v-for="(q, idx) in visibleQuestions" :key="q.question.position"
                    @click="emit('updateCurrentQuestionIndex', visibleStartIndex + idx)" class="quest-nav-button"
                    :class="{ active: currentQuestionIndex === (visibleStartIndex + idx), complete: isQuestionComplete(q.question)} ">
                    {{ visibleStartIndex + idx + 1 }}
                </div>

            </div>
            <img src="/public/images/interactive_editor/question_down.svg" id="down" @click="scrollDown()" />
            <div class="question_button_plus" @click="!isCheckMode && addQuestion()" :class="{ 'readonly-mode': isCheckMode }"><img
                    src="/public/images/interactive_editor/greeen_plus.svg" id="plus" /></div>
        </div>
        <div class="settings_questions_editor" :class="{ 'readonly-mode': isCheckMode }">
            <div class="question_header">
                <div class="question_header_text">
                    <div> Вопрос {{ currentQuestionIndex + 1 }}</div>
                    <img src="/public/images/interactive_editor/delete.svg" id="question_edit_delete"
                        @click="!isCheckMode && emit('showDelete')" />
                </div>
            </div>

            <!-- Вопрос -->
            <div class="input-group" >

                <textarea v-model="currentQuestion.question.text" maxlength="100" placeholder="Вопрос*"
                    id="question_text" :class="{ 'field-error': questionErrors[currentQuestionIndex]?.text }" :disabled="isCheckMode"/>

            </div>

            <!-- В вашем шаблоне, для отображения имени файла -->
            <div class="custom-file-upload" :class="{ 'file-uploaded': uploadedFileName }"
                @click="!isCheckMode && !uploadedFileName && $refs.fileInput.click()">

                <input ref="fileInput" type="file"  accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml" hidden @change="handleFileChange" :disabled="isCheckMode"/>

                <template v-if="uploadedFileName">
                    <!-- показываем только имя файла -->
                    <span class ="uploadedFileName"> {{ uploadedFileName }} </span>
                    <img src="/public/images/interactive_editor/delete.svg" @click.stop="removeImage"
                        class="remove-icon" />
                </template>

                <template v-else>
                    <span style="color: #1D1D1D;">Загрузите изображение</span>
                    <span style="margin-left: auto; color:#A9A9A9;">Не выбрано</span>
                </template>
            </div>



            <!-- Тип вопроса и Балл -->
            <div class="input-group_row">
                <div class="input-group_type" ref="dropdownRef">
                    <!-- Кастомный выпадающий список -->
                    <div class="custom-dropdown" @click="!isCheckMode &&  toggleDropdown"
                        :class="{ 'field-error': questionErrors[currentQuestionIndex]?.type }">
                        <div class="custom-dropdown-selected">{{ selectedText }}</div>
                        <div class="custom-arrow" :class="{ open: isOpen }">
                            <img src="/public/images/interactive_editor/list_close.svg" v-if="isOpen" />
                            <img src="/public/images/interactive_editor/list_open.svg" v-if="!isOpen" />
                        </div>
                    </div>

                    <!-- Список опций -->
                    <div class="custom-dropdown-options" v-if="isOpen">
                        <div class="custom-dropdown-options_header">Тип вопроса</div>
                        <div class="custom-dropdown-option-list">
                            <div class="custom-dropdown-option" v-for="(option, index) in options" :key="index"
                                @click="selectOption(option)">



                                <img class="custom-dropdown-circle" src="/public/images/interactive_editor/purple_circle.svg"
                                    v-if="typeMap[currentQuestion.question.type] === option" />
                                <img class="custom-dropdown-circle" src="/public/images/interactive_editor/circle.svg"
                                    v-if="typeMap[currentQuestion.question.type] !== option" />


                                <div class="custom-dropdown-text">{{ option }}</div>
                            </div>

                        </div>

                    </div>
                </div>

                <!-- Поле для ввода баллов с "Баллы:" внутри -->
                <div class="input-group_score">
                    <div>Баллы:</div>
                    <input type="number" v-model="currentQuestion.question.score" @blur="updateScore" min="1" max="5" @keyup.enter="updateScore"
                        :class="{ 'field-error': questionErrors[currentQuestionIndex]?.score }" :disabled="isCheckMode"/>

                </div>

            </div>

            <div class="answers-section">
                <div v-for="(answer, index) in currentQuestion.question.answers" :key="index" class="answer-item">
                    <div class="answer-input-wrapper">
                        <!-- Обёртка с иконкой и инпутом -->
                        <div class="custom-answer-input" :class="{
                            'field-error': questionErrors[currentQuestionIndex]?.answers?.[index]
                        }">
                            <!-- Показать иконку, если тип не 'text' -->
                            <div v-if="currentQuestion.question.type !== 'text'" class="custom-dropdown-circle"
                                @click="!isCheckMode && toggleCorrect(index)">
                                <img :src="getIconSrcWithValidation(
                                    currentQuestion.question.type,
                                    answer.is_correct,
                                    questionErrors[currentQuestionIndex]?.correctAnswers,
                                    index,
                                    currentQuestion.question
                                )" />

                            </div>

                            <input class="custom-input-field" type="text" v-model="answer.text"
                                :placeholder="currentQuestion.question.type === 'text' ? 'Поле для ввода правильного ответа' : 'Поле для ввода'"
                                maxlength="30" :class="{
                                    'text-type': currentQuestion.question.type === 'text',
                                }" :disabled="isCheckMode"/>
                        </div>

                        <!-- Удаление ответа -->
                        <img v-if="currentQuestion.question.answers.length > 1" class="delete-answer-icon"
                            src="public/images/interactive_editor/grey_delete.svg" alt="Удалить ответ"
                            @click="!isCheckMode && deleteAnswer(index)" id="delete-answer-icon"/>
                    </div>
                </div>
                <div class="answers-section-add_question" @click="!isCheckMode && addAnswer()" v-if="!limit_answers">
                    <img class="add_question_icon" src="/public/images/interactive_editor/add_question.svg">
                </div>
            </div>

            <div class="settings_questions_editor_buttons" v-if="!isCheckMode">
                <div class="settings_questions_editor_buttons_start" @click="emit('start')">
                    Запуск
                </div>
                <div class="settings_questions_editor_buttons_save" @click="emit('showSave')">
                    Сохранить
                </div>
            </div>
            <div v-if="showStart" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <div class="settings_popup-text">Вы уверены, что хотите запустить интерактив?</div>
                <div class="settings_popup-text_">По окончании интерактива Вы сможете выгрузить отчет. </div>
                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn cancel" @click="emit('cancelStart')">Отменить</button>
                    <button class="settings_popup-btn confirm" @click="handleStart">Запустить</button>
                    
                </div>
            </div>
            
         </div>
          <div v-if="showDelete" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <div class="settings_popup-text">Вы уверены, что хотите удалить вопрос?</div>
                <div class="settings_popup-text_">Это действие отменить будет невозможно.  </div>
                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn cancel delete" @click="emit('cancelDelete')"  >Отменить</button>
                    <button class="settings_popup-btn confirm delete" @click="deleteQuestion">Удалить</button>
                    
                </div>
            </div>
            
         </div>
        </div>

        <div class="settings_questions_mobile" >
            <VueDevice :device="'iphone-14'" :showHeader="false" :showSensors="false" class="no-scroll-device">
                <check_qestion :timer="form.answer_duration" :questions_count="form.questions.length"
                    :question="currentQuestion.question.text" :answers="currentQuestion.question.answers"
                    :score="currentQuestion.question.score" :currentIndex="currentQuestionIndex"
                    :type="currentQuestion.question.type" :image="imageUrls[currentQuestionIndex] || currentQuestion.question.image"></check_qestion>

            </VueDevice>



        </div>


    </div>
    </div>
</template>
<style>


</style>