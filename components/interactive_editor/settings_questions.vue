<script setup lang="ts">
import { VueDevice } from 'vue-devices'
import check_qestion from '../question/check_qestion.vue'
import { onMounted, ref } from 'vue'
import type { number } from 'yup';

const props = defineProps<{
  active_step: string
  form: any
  errors: any
  isFormComplete: boolean
  imageUrls: any

  take_step: (step: string) => void
  validateForm: () => boolean

  scrollUp: () => void
  scrollDown: () => void
  handleWheelScroll: (event: WheelEvent) => void
  visibleQuestions: any[]
  currentQuestionIndex: number
  visibleStartIndex: number
  addQuestion: () => void
  deleteQuestion: (index: number) => void
  showDelete: any

  currentQuestion: any
  questionErrors: Record<number, any>

  imageUploaded: boolean
  handleFileChange: (event: Event) => void
  uploadedFileName: string
  removeImage: () => void

  selectedText: any
  options: string[]
  typeMap: Record<string, string>
  dropdownRefs: Record<number, HTMLElement | null>

  isOpen: (index: number, mode: 'desktop' | 'mobile') => boolean

  toggleDropdown: (index: number, mode: 'desktop' | 'mobile') => void

  selectOption: (option: string, qIndex: number, mode: 'desktop' | 'mobile') => void
  score: number


  getIconSrcWithValidation: (
    type: string,
    isCorrect: boolean,
    correctAnswers: any,
    index: number,
    question: any,
  ) => string

  limit_answers: boolean

  handleStart: () => void
  showSavePopup: boolean
  handleSave: () => void
  showStart: any
  isQuestionComplete: any

  scores: Record<number, number>

  getScore: (qIndex: number) => number

  setScore: (qIndex: number, value: number) => void

  validateScore: (qIndex: number) => void

  addAnswer: (qIndex: number) => void
  questionRefs: any
  deleteAnswer: (
    qIndex: number,
    index: number
  ) => void

  toggleCorrect: (
    qIndex: number,
    index: number
  ) => void

}>()

const emit = defineEmits([
  'update:score',
  'updateCurrentQuestionIndex',
  'showSave',
  'start',
  'cancelStart',
  'showDelete',
  'cancelDelete',
])


const isCheckMode = ref(false)

onMounted(() => {
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
  }
})

const fileInputs = ref<HTMLInputElement[]>([])
function openFile(index: number) {
  fileInputs.value[index]?.click()
}
const startY = ref(0)
const currentY = ref(0)
const isMobile = useMediaQuery('(max-width: 767px)')
const $style = useCssModule()
const isDragging = ref(false)
function onTouchStart(e: TouchEvent) {
  if (!isMobile.value) return
  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  if (diff > 0) {
    e.preventDefault()
    const sheet = document.querySelector(`.${$style.questions__popup}`) as HTMLElement
    if (sheet) {
      sheet.style.transform = `translateY(${diff}px)`
      sheet.style.transition = 'none'
    }
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return
  isDragging.value = false

  const diff = currentY.value - startY.value
  const sheet = document.querySelector(`.${$style.questions__popup}`) as HTMLElement

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    emit('cancelDelete')
    emit('cancelStart')
    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch([props.showDelete, props.showStart], (val) => {
  document.body.classList.toggle('modal-open', props.showDelete || props.showStart)
})
const currentQuestion = computed(() => {
  return props.form.questions[props.currentQuestionIndex]
})

const deleteIndex = ref<number | null>(null)
function showDeletefn(index: number) {
  deleteIndex.value = index
  emit('showDelete')
}
</script>

<template>
  <div v-if="active_step === 'questions'" :class="$style.questions">


    <div :class="$style.questions__desktop">

      <div :class="$style.questions__nav">
        <img :class="$style.questions__nav_up" src="/public/images/interactive_editor/question_up.svg"
          @click="scrollUp()">

        <div @wheel="handleWheelScroll" :class="$style.questions__nav_scroll">
          <div v-for="(q, idx) in visibleQuestions" :key="q.question.position" :class="{
            active: currentQuestionIndex === (visibleStartIndex + idx),
            complete: isQuestionComplete(q.question)
          }" @click="emit('updateCurrentQuestionIndex', visibleStartIndex + idx)">
            {{ visibleStartIndex + idx + 1 }}
          </div>
        </div>

        <img :class="$style.questions__nav_down" src="/public/images/interactive_editor/question_down.svg"
          @click="scrollDown()">

        <div :class="$style.questions__nav_plus" @click="!isCheckMode && addQuestion(idx)">
          <img src="/public/images/interactive_editor/greeen_plus.svg">
        </div>
      </div>

      <div :class="$style.questions__item">

        <div :class="$style.questions__number">
          <div>
            Вопрос {{ currentQuestionIndex + 1 }}
          </div>

          <img id="question_edit_delete" src="/public/images/interactive_editor/delete.svg"
            @click="!isCheckMode && showDeletefn(currentQuestionIndex)">
        </div>
        <div :class="$style.questions__body">
          <div :class="$style.questions__text">
            <textarea id="question_text" v-model="currentQuestion.question.text" maxlength="100" placeholder="Вопрос*"
              :class="{ 'field-error': questionErrors[currentQuestionIndex]?.text }" :disabled="isCheckMode" />
          </div>
          <div @click="!isCheckMode && !currentQuestion.question.uploadedFileName && openFile(currentQuestionIndex)"
            :class="$style.questions__img">
            <input :ref="el => fileInputs[currentQuestionIndex] = el" type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml" hidden
              :disabled="isCheckMode" @change="handleFileChange($event, currentQuestionIndex)">
            <div>
              <div v-if="currentQuestion.question.uploadedFileName"
                :class="currentQuestion.question.uploadedFileName ? 'uploaded' : 'non_uploaded'">
                <span class="uploadedFileName">
                  {{ currentQuestion.question.uploadedFileName }}
                </span>

                <img src="/public/images/interactive_editor/delete.svg" class="remove-icon"
                  @click.stop="removeImage(currentQuestionIndex)">
              </div>
              <div v-else>
                <span>
                  Загрузите изображение
                </span>

                <span style=" color: #A9A9A9;">
                  Не выбрано
                </span>
              </div>
            </div>



          </div>
          <div :class="$style.questions__score">
            <div :ref="el => dropdownRefs[currentQuestionIndex] = el" :class="$style.questions__score_type"
              @click="!isCheckMode && toggleDropdown(currentQuestionIndex, 'desktop')">
              <div :class="$style.questions__score_type_block">
                <div class="custom-dropdown-selected">
                  {{ selectedText(currentQuestionIndex) }}
                </div>
                <img v-if="isOpen(currentQuestionIndex, 'desktop')"
                  src="/public/images/interactive_editor/list_close.svg">

                <img v-if="!isOpen(currentQuestionIndex, 'desktop')"
                  src="/public/images/interactive_editor/list_open.svg">
              </div>
              <div v-if="isOpen(currentQuestionIndex, 'desktop')" :class="$style.questions__score_type_list">

                <div class="custom-dropdown-options_header" :class="$style.questions__score_type_list_header">
                  Тип вопроса
                </div>

                <div :class="$style.questions__score_type_list_block">

                  <div v-for="(option, index) in options" :key="index" class="custom-dropdown-option"
                    @click.stop="selectOption(option, currentQuestionIndex, 'desktop')">
                    <img v-if="typeMap[currentQuestion.question.type] === option" class="custom-dropdown-circle"
                      src="/public/images/interactive_editor/purple_circle.svg">

                    <img v-if="typeMap[currentQuestion.question.type] !== option" class="custom-dropdown-circle"
                      src="/public/images/interactive_editor/circle.svg">

                    <div class="custom-dropdown-text">
                      {{ option }}
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <div :class="$style.questions__score_block">
              <div>Баллы:</div>

              <input :value="getScore(currentQuestionIndex)" type="number" min="1" max="5"
                @input="setScore(currentQuestionIndex, Number($event.target.value))"
                :class="{ 'field-error': questionErrors[currentQuestionIndex]?.score }" :disabled="isCheckMode"
                @blur="validateScore(currentQuestionIndex)" @keyup.enter="validateScore(currentQuestionIndex)">
            </div>

          </div>

          <div :class="$style.questions__answers">

            <div v-for="(answer, index) in currentQuestion.question.answers" :key="index" class="answer-item">
              <div class="answer-input-wrapper" :class="$style.questions__answers_item">

                <div class="custom-answer-input" :class="{
                  'field-error': questionErrors[currentQuestionIndex]?.answers?.[index],
                }">
                  <div v-if="currentQuestion.question.type !== 'text'" class="custom-dropdown-circle"
                    @click="!isCheckMode && toggleCorrect(currentQuestionIndex, index)">
                    <img :src="getIconSrcWithValidation(
                      currentQuestion.question.type,
                      answer.is_correct,
                      questionErrors[currentQuestionIndex]?.correctAnswers,
                      index,
                      currentQuestion.question,
                    )">
                  </div>

                  <input v-model="answer.text" :class="{
                    [$style.questions__answers_input_text]:
                      currentQuestion.question.type === 'text'
                  }" type="text" :placeholder="currentQuestion.question.type === 'text'
                    ? 'Поле для ввода правильного ответа'
                    : 'Поле для ввода'" maxlength="30" :disabled="isCheckMode">
                </div>

                <img v-if="currentQuestion.question.answers.length > 1" id="delete-answer-icon"
                  class="delete-answer-icon" src="public/images/interactive_editor/grey_delete.svg" alt="Удалить ответ"
                  @click="!isCheckMode && deleteAnswer(currentQuestionIndex, index)">

              </div>

            </div>

            <div v-if="!limit_answers[currentQuestionIndex]" :class="$style.questions__answers_add"
              @click="!isCheckMode && addAnswer(currentQuestionIndex)">
              <img class="add_question_icon" src="/public/images/interactive_editor/add_question.svg">
            </div>
            <div v-if="!isCheckMode" :class="$style.questions__desktop_buttons">
              <div class="settings_questions_editor_buttons_start" @click="emit('start')">
                Запуск
              </div>
              <div class="settings_questions_editor_buttons_save" @click="emit('showSave')">
                Сохранить
              </div>
            </div>
          </div>
        </div>


      </div>

      <div :class="$style.questions__fon">
        <VueDevice :device="'iphone-14'" :show-header="false" :show-sensors="false" class="no-scroll-device">
          <check_qestion :timer="form.answer_duration" :questions_count="form.questions.length"
            :question="currentQuestion.question.text" :answers="currentQuestion.question.answers"
            :score="currentQuestion.question.score" :current-index="currentQuestionIndex"
            :type="currentQuestion.question.type"
            :image="imageUrls[currentQuestionIndex] || currentQuestion.question.image" />
        </VueDevice>
      </div>
    </div>

    <!-- MOBILE -->
    <div :class="$style.questions__mobile" v-for="(questionItem, qIndex) in form.questions"
      :key="questionItem.question.position" :ref="el => (questionRefs[qIndex] = el)">
      <div :class="$style.questions__item">


        <div :class="$style.questions__number">
          <div>
            Вопрос {{ qIndex + 1 }}
          </div>

          <img id="question_edit_delete" src="/public/images/interactive_editor/delete.svg"
            @click="!isCheckMode && showDeletefn(qIndex)"">
        </div>
        <div :class="$style.questions__body">
          <div :class="$style.questions__text">
            <textarea id="question_text" v-model="questionItem.question.text" maxlength="100" placeholder="Вопрос*"
              :class="{ 'field-error': questionErrors[qIndex]?.text }" :disabled="isCheckMode" />
          </div>

          <div @click="!isCheckMode && !questionItem.question.uploadedFileName && openFile(qIndex)"
            :class="$style.questions__img">
            <input :ref="el => fileInputs[qIndex] = el" type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/svg+xml" hidden
              :disabled="isCheckMode" @change="handleFileChange($event, qIndex)">
            <div>
              <div v-if="questionItem.question.uploadedFileName"
                :class="questionItem.question.uploadedFileName ? 'uploaded' : 'non_uploaded'">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.2586 7.29961V15.1715C14.2586 15.3913 14.1713 15.6021 14.0159 15.7575C13.8605 15.9129 13.6497 16.0002 13.4299 16.0002H1.82866C1.60889 16.0002 1.39811 15.9129 1.24271 15.7575C1.08731 15.6021 1 15.3913 1 15.1715V3.57081C1 3.35105 1.08731 3.14028 1.24271 2.98489C1.39811 2.82949 1.60889 2.74219 1.82866 2.74219H9.43743"
                    stroke="#6AB23D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M3.48438 11.4525L5.97036 8.12562L7.21335 9.36856L8.66351 7.08984L11.771 11.4525H3.48438Z"
                    fill="#6AB23D" stroke="#6AB23D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M12.6016 2.74218H15.9162M14.2568 1V4.31449" stroke="#6AB23D" stroke-width="2"
                    stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span class="uploadedFileName">
                  {{ questionItem.question.uploadedFileName }}
                </span>


              </div>

              <img v-if="questionItem.question.uploadedFileName" src="/public/images/interactive_editor/delete (2).svg"
                class="remove-icon" @click.stop="removeImage(qIndex)">

              <div v-if="!questionItem.question.uploadedFileName">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14.2586 7.29961V15.1715C14.2586 15.3913 14.1713 15.6021 14.0159 15.7575C13.8605 15.9129 13.6497 16.0002 13.4299 16.0002H1.82866C1.60889 16.0002 1.39811 15.9129 1.24271 15.7575C1.08731 15.6021 1 15.3913 1 15.1715V3.57081C1 3.35105 1.08731 3.14028 1.24271 2.98489C1.39811 2.82949 1.60889 2.74219 1.82866 2.74219H9.43743"
                    stroke="#853CFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M3.48438 11.4525L5.97036 8.12562L7.21335 9.36856L8.66351 7.08984L11.771 11.4525H3.48438Z"
                    fill="#853CFF" stroke="#853CFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M12.6016 2.74218H15.9162M14.2568 1V4.31449" stroke="#853CFF" stroke-width="2"
                    stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span>
                  Добавить изображение
                </span>


              </div>
            </div>



          </div>
          <div :class="$style.questions__score">
            <div :ref="el => dropdownRefs[Number(qIndex)] = el" class="input-group_type"
              :class="$style.questions__score_type">

              <div class="custom-dropdown" :class="$style.questions__score_type_block"
                @click="!isCheckMode && toggleDropdown(qIndex, 'mobile')">
                <div class="custom-dropdown-selected">
                  {{ selectedText(qIndex) }}
                </div>


                <img v-if="isOpen(qIndex, 'mobile')" src="/public/images/interactive_editor/list_close.svg">

                <img v-if="!isOpen(qIndex, 'mobile')" src="/public/images/interactive_editor/list_open.svg">
              </div>
              <div :class="$style.questions__score_type_list" v-if="isOpen(qIndex, 'mobile')"
                class="custom-dropdown-options">


                <div v-for="(option, index) in options" :key="index" class="custom-dropdown-option"
                  @click="selectOption(option, qIndex, 'mobile')">


                  <div class="custom-dropdown-text">
                    {{ option }}
                  </div>

                </div>


              </div>
            </div>

            <div class="input-group_score" :class="$style.questions__score_block">
              <div>Баллы:</div>

              <input :value="getScore(qIndex)" type="number" min="1" max="5"
                :class="{ 'field-error': questionErrors[qIndex]?.score }" :disabled="isCheckMode"
                @input="setScore(qIndex, Number($event.target.value))" @blur="validateScore(qIndex)"
                @keyup.enter="validateScore(qIndex)">
            </div>

          </div>

          <div class="answers-section" :class="$style.questions__answers">

            <div :ref="el => questionRefs[qIndex] = el" :class="$style.questions__answers_list"
              v-for="(answer, index) in questionItem.question.answers" :key="index" class="answer-item">
              <div class="answer-input-wrapper" :class="$style.questions__answers_item">
                <div class="custom-answer-input" :class="{
                  'field-error': questionErrors[qIndex]?.answers?.[index],
                }">
                  <div v-if="questionItem.question.type !== 'text'" class="custom-dropdown-circle"
                    @click="!isCheckMode && toggleCorrect(qIndex, index)">
                    <img :src="getIconSrcWithValidation(
                      questionItem.question.type,
                      answer.is_correct,
                      questionErrors[qIndex]?.correctAnswers,
                      index,
                      questionItem.question,
                    )">
                  </div>

                  <input v-model="answer.text" :class="{
                    [$style.questions__answers_input_text]:
                      questionItem.question.type === 'text'
                  }" type="text" :placeholder="questionItem.question.type === 'text'
                    ? 'Поле для ввода правильного ответа'
                    : 'Поле для ввода'" maxlength="30" :disabled="isCheckMode">
                </div>

                <img v-if="questionItem.question.answers.length > 1" id="delete-answer-icon" class="delete-answer-icon"
                  src="public/images/interactive_editor/grey_delete.svg" alt="Удалить ответ"
                  @click="!isCheckMode && deleteAnswer(qIndex, index)">

              </div>

            </div>
            <div v-if="!limit_answers[qIndex]" :class="$style.questions__answers_add"
              @click="!isCheckMode && addAnswer(qIndex)">
              <img class="add_question_icon" src="/public/images/interactive_editor/add_question (2).svg">
            </div>

          </div>
        </div>


      </div>


    </div>
    <div :class="$style.questions__mobile_buttons">
      <button @click="!isCheckMode && addQuestion()" :class="$style.questions__mobile_buttons_add">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.2143 6.28571H6.28571V10.2143C6.28571 10.4227 6.20293 10.6225 6.05558 10.7699C5.90823 10.9172 5.70838 11 5.5 11C5.29162 11 5.09177 10.9172 4.94442 10.7699C4.79707 10.6225 4.71429 10.4227 4.71429 10.2143V6.28571H0.785714C0.57733 6.28571 0.377481 6.20293 0.230131 6.05558C0.0827805 5.90823 0 5.70838 0 5.5C0 5.29162 0.0827805 5.09177 0.230131 4.94442C0.377481 4.79707 0.57733 4.71429 0.785714 4.71429H4.71429V0.785714C4.71429 0.57733 4.79707 0.37748 4.94442 0.23013C5.09177 0.0827802 5.29162 0 5.5 0C5.70838 0 5.90823 0.0827802 6.05558 0.23013C6.20293 0.37748 6.28571 0.57733 6.28571 0.785714V4.71429H10.2143C10.4227 4.71429 10.6225 4.79707 10.7699 4.94442C10.9172 5.09177 11 5.29162 11 5.5C11 5.70838 10.9172 5.90823 10.7699 6.05558C10.6225 6.20293 10.4227 6.28571 10.2143 6.28571Z"
            fill="#6AB23D" />
        </svg>

        <div>
          Добавить вопрос
        </div>
      </button>
      <button @click="emit('showSave')" :class="$style.questions__mobile_buttons_save">
        Сохранить
      </button>
      <button @click="emit('start')" :class="$style.questions__mobile_buttons_start">
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M0.279969 0.987533C0.299062 0.814568 0.355341 0.648787 0.444332 0.503369C0.533323 0.357952 0.652571 0.236908 0.792597 0.14986C0.932623 0.0628117 1.08957 0.0121603 1.25095 0.00193231C1.41233 -0.00829567 1.5737 0.0221818 1.72223 0.0909416C2.47306 0.43678 4.1557 1.25872 6.29081 2.58647C8.42664 3.91497 9.929 5.07513 10.5815 5.60151C11.1387 6.05171 11.1401 6.94449 10.5823 7.39621C9.93606 7.91954 8.45209 9.06447 6.29081 10.4097C4.12742 11.755 2.46457 12.567 1.72082 12.9083C1.08028 13.2031 0.363394 12.756 0.279969 12.0117C0.182404 11.1418 0 9.16654 0 6.49886C0 3.8327 0.181697 1.85822 0.279969 0.987533Z"
            fill="white" />
        </svg>
        <div>
          Запустить
        </div>

      </button>
    </div>
    <div v-if="showStart" :class="[$style.questions__popup_overlay]">
      <div :class="[$style.questions__popup, $style.questions__popup_delete]" @click.stop @touchstart="onTouchStart"
        @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div :class="$style.questions__popup_line"></div>
        <div :class="$style.questions__popup_text">
          Вы уверены, что хотите запустить интерактив?
        </div>
        <div :class="$style.questions__popup_text_">
          По окончании интерактива Вы сможете выгрузить отчет.
        </div>
        <div :class="[$style.questions__popup_buttons, $style.questions__popup_buttons_delete]">
          <button
            :class="[$style.questions__popup_btn, $style.questions__popup_btn_first, $style.questions__popup_btn_first_change]"
            @click="emit('cancelStart')">
            Отменить
          </button>
          <button
            :class="[$style.questions__popup_btn, $style.questions__popup_btn_second, $style.questions__popup_btn_second_change]"
            @click="handleStart">
            Запустить
          </button>
        </div>
      </div>
    </div>
    <div v-if="showDelete" :class="[$style.questions__popup_overlay]">
      <div :class="[$style.questions__popup, $style.questions__popup_delete]" @click.stop @touchstart="onTouchStart"
        @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div :class="$style.questions__popup_line"></div>
        <div :class="$style.questions__popup_text">
          Вы уверены, что хотите удалить вопрос?
        </div>
        <div :class="$style.questions__popup_text_">
          Это действие отменить будет невозможно.
        </div>
        <div :class="[$style.questions__popup_buttons, $style.questions__popup_buttons_delete]">
          <button
            :class="[$style.questions__popup_btn, $style.questions__popup_btn_first, $style.questions__popup_btn_first_delete]"
            @click="emit('cancelDelete')">
            Отменить
          </button>
          <button
            :class="[$style.questions__popup_btn, $style.questions__popup_btn_second, $style.questions__popup_btn_second_delete]"
            @click="deleteQuestion(deleteIndex!)">
            Удалить
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
<style>
.uploaded {
  color: #6ab23d !important;
  background-color: #E0F9C7 !important;
}

.non_uploaded {
  color: #853CFF;
  background-color: #853CFF;
}

.field-error {
  border-radius: 8px;
}

.complete {
  border-color: #6AB23D !important;
}

.active {
  border-color: #853CFF !important;
}



@media (min-width:1056px) {
  .uploaded {
    color: #6ab23d !important;
    background-color: white !important;
    border: 1.5px solid #6ab23d !important;
  }
}
</style>
<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.questions {
  margin-top: 5px;

  @media (min-width:1056px) {
    margin-top: 14px;
  }

  &__nav {
    display: none;

    @media (min-width:1056px) {
      display: block;
      width: 42px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 21px;
      gap: 5px;
    }

    &_up {
      width: 19px;
      height: 10px;
    }

    &_scroll {
      display: flex;
      flex-direction: column;
      gap: 5px;

      &>div {
        height: 42px;
        width: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
      }
    }

    &_down {
      width: 19px;
      height: 10px;
    }

    &_plus {
      height: 42px;
      width: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #6AB23D;
      border-radius: 8px;
      margin-top: 7px;
    }
  }

  &__desktop {
    display: none;

    @media (min-width:1056px) {
      display: grid;
      grid-template-columns: 42px 483px 354px;
      position: relative;
      height: 608px;

    }

    &_buttons {
      display: none;

      @media (min-width:1056px) {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        margin-top: auto;
        height: 44px;
        gap: 20px;
      }

      &>div {

        @media (min-width:1056px) {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          width: 181px;
          font-size: 20px;
          border: 2px solid white;
          border-radius: 8px;
        }
      }

      &>div:first-child {
        @media (min-width:1056px) {
          color: #6AB23D !important;
          border: 2px solid #6AB23D;
        }

      }

      &>div:nth-child(2) {
        @media (min-width:1056px) {
          color: #FFFFFF !important;
          border: 2px solid #6AB23D;
          background-color: #6AB23D;
          ;
        }

      }
    }
  }

  &__check {
    display: none;
  }

  &__mobile {
    margin: 0 11px;
    margin-top: 9px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width:1056px) {
      display: none;

    }

    &_buttons {
      background-color: white;
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: space-between;
      bottom: 0;
      margin: 0 11px;
      width: calc(100% - 22px);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      display: flex;
      height: 49px;
      backdrop-filter: blur(28.399999618530273px);
      box-shadow: 0px 1px 9px 0px #00000040;
      padding: 11px;
      box-sizing: border-box;
      z-index: 10000;

      @media (min-width:1056px) {
        display: none;
      }

      &>button {
        height: 27px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border: 1px solid white;

        &>div {
          text-align: center;

          font-size: 14px;
        }
      }

      &_add {

        background-color: #E0F9C7;
        border-radius: 8px;
        color: #6AB23D;

        &>svg {
          width: 11px;
          height: 11px;
        }

        &>div {
          white-space: nowrap;
        }
      }

      &_save {

        box-sizing: border-box;
        background-color: white;
        border: 1px solid #6AB23D !important;
        border-radius: 8px;
        color: #6AB23D;
        padding: 0 5px;
        width: 80px;
        white-space: nowrap;

      }

      &_start {
        width: 97px;
        background-color: #6AB23D;
        border: 1px solid #6AB23D;
        border-radius: 8px;
        color: white;
        padding: 5px;

        &>svg {
          width: 11px;
          height: 11px;
        }

        &>div {
          white-space: nowrap;
        }
      }
    }
  }

  &__item {
    max-height: 453px;


    @media (min-width:1056px) {
      max-height: 644px;
      margin-left: 31px;
    }
  }

  &__number {
    height: 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin: 0 11px;

    @media (min-width:1056px) {
      margin: 0;
      font-size: 16px;
      color: #1D1D1D;
      height: 18px;
    }

    &>img {
      width: 14px;
      height: 18px;
    }
  }

  &__body {
    box-sizing: border-box;
    border-radius: 14px;
    background-color: #FFFFFF;
    margin-top: 5px;
    max-height: 430px;
    padding: 11px;
    font-size: 14px;
    position: relative;

    @media (min-width:1056px) {
      margin: 0;
      padding: 0;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: none;
      overflow: visible;
      max-height: 708px;
      height: 600px;
      position: relative;
    }
  }

  &__text {
    width: 100%;
    height: 79px;

    @media (min-width:1056px) {
      width: 100%;
      height: 74px;
    }

    &>textarea {
      width: 100%;
      height: 79px;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      padding: 5px 10px;
      color: #1D1D1D;
      font-size: 14px;

      @media (min-width:1056px) {
        border: 1.5px solid #E0E0E0;
        padding: 12px;
        font-size: 16px;
      }

      &::placeholder {
        font-size: 14px;
        color: #A9A9A9;

        @media (min-width:1056px) {
          font-size: 16px;
        }
      }
    }
  }

  &__img {


    &>div {
      display: flex;
      align-items: center;
      margin-top: 10px;
      gap: 5px;

      @media (min-width:1056px) {
        width: 100%;
        padding: 0;
        margin: 0;
        align-items: center;
      }

      &>img {
        width: 40px;
        height: 37px;
        padding: 9.5px 13px;
        width: fit-content;
        color: #853CFF;
        background-color: #E0F9C7;
        border-radius: 8px;
      }
    }


    &>div>div {


      height: 37px;
      background-color: #853CFF4D;
      padding: 10px;
      width: fit-content;
      border-radius: 8px;
      color: #853CFF;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      @media (min-width:1056px) {
        padding: 12px;
        width: 100%;
        height: 42px;
        justify-content: space-between;
        font-size: 16px;
        background-color: white;
        color: #1D1D1D;
        border: 1.5px solid#E0E0E0;
      }

      &>svg {
        width: 15px;
        height: 15px;
      }

      &>span {
        max-width: 164px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;


        @media (min-width:1056px) {
          max-width: 400px;
        }
      }
    }
  }

  &__score {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width:1056px) {
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
    }

    &_type {
      position: relative;
      z-index: 10;

      @media (min-width:1056px) {
        position: relative;
        z-index: 10;
      }

      &_block {
        width: 180px;
        box-sizing: border-box;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;

        @media (min-width:1056px) {
          box-sizing: border-box;
          width: 287px;
          background-color: white;
          height: 42px;
        }
      }

      &_list {
        position: absolute;
        background-color: white;
        z-index: 9999;
        top: 47px;
        width: 157px;
        height: 95px;
        border-radius: 8px;
        box-shadow: 0px 1px 13.8px 0px #00000040;
        box-sizing: border-box;
        padding: 6px;

        @media (min-width:1056px) {
          padding: 0;
          position: absolute;
          background-color: white;
          z-index: 9999;
          top: 57px;
          width: 293px;
          height: 146px;
          padding: 15px 15px 20px 15px;
        }

        &_header {
          margin-left: 22px;
          font-weight: 600;
        }

        &>div {
          padding: 4px;
          margin-bottom: 4px;
          border-radius: 7px;
          white-space: nowrap;

          @media (min-width:1056px) {
            padding: 0;
            margin-bottom: 0;
          }

          &:hover {
            background-color: #E0E0E0;
          }
        }

        &_block {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          &>div {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }
    }

    &_block {
      display: flex;
      align-items: center;
      gap: 5px;

      @media (min-width:1056px) {

        display: flex;
        align-items: center;
        gap: 10px;
      }

      &>div {
        color: #1D1D1D;
        font-size: 14px;

        @media (min-width:1056px) {

          font-size: 16px;
        }

      }

      &>input {
        width: 62px;
        height: 37px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #E0E0E0;
        border-radius: 10px;
        text-align: center;

        @media (min-width:1056px) {

          width: 73px;
          height: 42px;
        }
      }
    }
  }

  &__answers {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width:1056px) {
      gap: 10px;
      margin: 0;
    }

    &_input_text {
      padding-left: 10px !important;

      @media (min-width:1056px) {
        gap: 10px;
        margin: 0;
      }
    }

    &_list {

      display: flex;
      align-items: center;

      &>div {}
    }

    &_item {
      width: 100%;
      position: relative;
      height: 37px;

      @media (min-width:1056px) {
        width: 100%;
        position: relative;
        height: 42px;
      }

      &>img {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 17px;
        height: 17px;

        @media (min-width:1056px) {
          width: 15px;
          height: 15px;
          top: 15px;
          right: 15px;
        }
      }

      &>div {
        border: 1px solid #E0E0E0;
        border-radius: 8px;

        &>input {
          width: 100%;
          border: none;
          height: 37px;
          border-radius: 8px;
          padding-left: 37px;
          font-size: 14px;
          color: #1D1D1D;

          @media (min-width:1056px) {
            width: 100%;
            height: 42px;
            font-size: 16px;
          }

          &::placeholder {
            color: #A9A9A9;
            font-size: 14px;

            @media (min-width:1056px) {
              font-size: 16px;
            }
          }
        }

        &>div {
          &>img {
            position: absolute;
            top: 12px;
            left: 10px;
            width: 16px;
            height: 16px;

            @media (min-width:1056px) {
              position: absolute;
              top: 14px;
              left: 12px;
              width: 16px;
              height: 16px;
            }
          }


        }

      }
    }

    &_add {
      width: 37px;
      height: 37px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #A9A9A9;

      @media (min-width:1056px) {
        height: 42px;
        width: 42px;
        border-radius: 8px;
        border: 1.5px solid #E0E0E0;
        background-color: white;
      }

      &>img {
        width: 17.5px;
        height: 17.5px;

        @media (min-width:1056px) {
          height: 30px;
          width: 30px;
        }
      }
    }
  }

  &__fon {
    position: absolute;
    right: 0;
    top: -160px;
    transform: scale(0.75);
  }

  &__popup {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    background: white;
    height: 458px;
    margin-top: auto;
    width: 100%;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    touch-action: pan-y; // Разрешаем только вертикальный скролл
    transition: transform 1s ease;

    @media (min-width:768px) {
      width: 524px;
      height: 173px;
      margin-top: 290px;
      border-radius: 18px;
    }

    &_delete {
      @media (min-width:768px) {
        height: 233px;
      }
    }

    &_add {
      @media (min-width:768px) {
        height: 266px;
      }
    }

    &>img {
      display: none;

      @media (min-width:768px) {
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        top: 20px;
        right: 20px;
      }
    }

    &_overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #00000052;

      z-index: 22222999;

      display: flex;
      justify-content: center;
    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:768px) {
        display: none;

      }
    }

    &_text {
      font-size: 14px;
      padding: 0 22px;
      margin-top: 40px;
      font-weight: 500;


      @media (min-width:768px) {
        font-size: 20px;
        padding: 0 22px;
        margin-top: 29px;
        line-height: 32px;
        font-weight: 700;
        vertical-align: middle;
      }

      &>span {
        @media (min-width:768px) {
          padding: 0;
        }
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;

        @media (min-width:768px) {
          font-size: 16px;

        }
      }
    }

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 148px;

      @media (min-width:768px) {
        margin-top: 19px;
        display: flex;
        flex-direction: row;
        margin-left: 186px;
      }

      &_delete {
        @media (min-width:768px) {
          margin-top: 56px;
        }
      }
    }



    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:768px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_first {
        @media (min-width:768px) {
          width: 138px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:768px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_change {
          background-color: white;
          border: 1px solid #853CFF;
          color: #853CFF;

          &:hover {
            @media (min-width:768px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }



      }

      &_second {
        @media (min-width:768px) {
          width: 150px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:768px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_change {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:768px) {
              background-color: #559130;
            }
          }
        }
      }
    }
  }
}
</style>