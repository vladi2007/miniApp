<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  questions_count: string
  question: {
    id: string
    text: string
    position: string
  }
  answers: {
    id: string
    text: string
  }[]
  percentages: {
    id: string
    percentage: number
  }[]
  idCorrectAnswer: string
  timer: string
  stage: string
  context: string
  onAnswer: (answerId: string) => void
}>()

const selectedAnswer = ref<string | null>()
const showBanner = ref(false) // Состояние для плашки

const isDiscussion = computed(() => props.stage === 'discussion')
const isParticipant = computed(() => props.stage === 'participant')
console.log(props)
// Позволяет выбирать только в режиме "question"


const isCorrect = computed(() => {
  return selectedAnswer.value === props.idCorrectAnswer
})

const getPercentage = (id: string) => {
  return props.percentages.find((p) => p.id === id)?.percentage ?? 0
}

const previousStage = ref(props.stage)

// Следим за приходом idCorrectAnswer
watch(
  () => props.idCorrectAnswer,
  () => {
    if (selectedAnswer.value && selectedAnswer.value !== props.idCorrectAnswer) {
      showBanner.value = false // Скрываем плашку, если ответ неправильный
    }
    // Если ответ верный — showBanner остаётся true
  }
)

</script>

<template>
  <div class="question_question-list">
    <div class="question_number">

      <p class="question_question-num-text">Вопрос {{ props.question.position }}/ {{ props.questions_count }}</p>
    </div>

    <p class="question_title">{{ props.question.text }}</p>

    <div class="question_list">
      <div v-for="answer in props.answers" :key="answer.id" class="question_answer" :class="{
        correct: isDiscussion,
        wrongOutline: isDiscussion && answer.id !== props.idCorrectAnswer && answer.id !== selectedAnswer
      }">
        <span class="question_text">{{ answer.text }}</span>
        <span v-if="isDiscussion" class="question_percent" :class="{ white: selectedAnswer === answer.id }">
          {{ getPercentage(answer.id) }}%
        </span>
      </div>
    </div>

    <div v-if="showBanner && isCorrect" :class="['question_accepted-banner', 'success']">
      <img src="/public/images/question/Group_1.svg" />
      Правильный ответ
    </div>
    <div v-if="showBanner && !isCorrect" :class="['question_accepted-banner', 'default']">
      Ответ принят!
    </div>

  </div>
</template>

<style>
.question_question-list {
  margin-left: 67px;
  ;
  padding-top: 27px;
  width: 1184px;
  font-family: 'Lato';
}

.question_number {

  position: relative;
  width: 233px;
  ;
  height: 73px;
  ;
  background-image: url("/images/question/Vector_80_leader.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}



.question_question-num-text {
  font-weight: 500;
  font-size: 32px;
  font-family: 'Lato';
}

.question_title {
  margin-top: 40px;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  height: 58px;
}

.question_list {
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 16px;
}

.question_answer {
  background-color: #f7f7f7;

  height: 100px;
  font-size: 32px;
  font-weight: 500;
  border-radius: 5px;
  ;
  border: 2px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  color: #1d1d1d;
  padding-left: 35px;
}





.question_answer.correct {
  background-color: #6ab23d;
  color: white;
}

.question_answer.correctOutline {
  border: 2px solid #6ab23d;
  color: #1d1d1d;
  background-color: #f7f7f7;
}

.question_answer.incorrect {
  border: 2px solid #f0436c;
  background-color: #f0436c;
  color: white;
}

.question_answer.wrongOutline {
  border: 2px solid #f0436c;
  background-color: #f7f7f7;
  color: #1d1d1d;
}

.question_percent {
  font-size: 24px;
  color: #333;
  font-size: 500;

  padding-right: 13px;
}

.question_percent.white {
  color: white;
}

.question_accepted-banner {
  margin-top: 24px;
  padding: 12px;
  border-radius: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.question_accepted-banner.default {
  background-color: #853cff;
  color: white;
}

.question_accepted-banner.hidden {
  display: none
}

.question_accepted-banner.success {
  background-color: #6ab23d;
  color: white;
}

.question_check-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>
