import { clearDeviceStorage, getAllDeviceStorageKeys } from '~/utils/deviceStorageIndexedDB'
import { IMAGE_STATE_KEY } from '~/constants/interactiveKeys'
   import { nextTick } from 'vue'
export function useQuestionNavigator(
  form,
  questionErrors,
  currentQuestionIndex,
  validateQuestions,
  errors
) {
  const visibleCount = 3
  const visibleStartIndex = ref(0)
  const questionRefs = ref<HTMLElement[]>([])

function setQuestionRef(el: HTMLElement | null, index: number) {
  if (el) {
    questionRefs.value[index] = el
  }
}


const scrollToFirstError = async () => {
  const errors = questionErrors.value

  const firstIndex = Object.entries(errors).find(([_, q]: any) => {
    if (!q) return false

    return (
      q.text ||
      q.score ||
      q.type ||
      q.correctAnswers ||
      q.answers?.some((a: boolean) => a)
    )
  })?.[0]

  if (firstIndex === undefined) return

  const index = Number(firstIndex)

  currentQuestionIndex.value = index

  await nextTick()

  const el = questionRefs.value[index]

  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
}
  const visibleQuestions = computed(() => {
    const total = form.value.questions.length
    const result = []

    for (let i = 0; i < visibleCount; i++) {
      const idx = visibleStartIndex.value + i
      if (idx < total) {
        result.push(form.value.questions[idx])
      }
    }
    return result
  })
  watch(currentQuestionIndex, (newIndex) => {
    const total = form.value.questions.length
    if (newIndex < visibleStartIndex.value) {
      visibleStartIndex.value = newIndex
    }
    else if (newIndex >= visibleStartIndex.value + visibleCount) {
      visibleStartIndex.value = newIndex - visibleCount + 1
    }
  })

  async function addQuestion(afterIndex?: number) {
    const isValid = validateQuestions()
    console.log(!isValid)
    if (!isValid) {
      scrollToFirstError()
      return
    }

    if (form.value.questions.length >= 20)
      return

    const newQuestion = {
      question: {
        type: 'one',
        image: '',
        score: '1',
        position: 0,
        text: '',
        answers: Array(3)
          .fill(null)
          .map(() => ({
            text: '',
            is_correct: false,
          })),
      },
    }

    const insertIndex
      = afterIndex !== undefined
        ? afterIndex + 1
        : form.value.questions.length

    form.value.questions.splice(insertIndex, 0, newQuestion)

    // ОБНОВЛЯЕМ ПОЗИЦИИ
    form.value.questions.forEach((q, index) => {
      q.question.position = index
    })

    // ОШИБКИ
    questionErrors.value.splice(insertIndex, 0, {
      text: false,
      score: false,
      type: false,
      answers: [],
      correctAnswers: false,
    })

    currentQuestionIndex.value = insertIndex

    if (
      currentQuestionIndex.value
      >= visibleStartIndex.value + visibleCount
    ) {
      visibleStartIndex.value
        = currentQuestionIndex.value - visibleCount + 1
    }
   await nextTick()

const index = currentQuestionIndex.value
const el = questionRefs.value[index]

if (el) {
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
  }

 async function deleteQuestion(index: number) {
    showDelete.value = false

    // ЕСЛИ ОДИН ВОПРОС — НЕ УДАЛЯЕМ
    if (form.value.questions.length === 1)
      return

    // УДАЛЯЕМ ВОПРОС
    form.value.questions.splice(index, 1)

    // УДАЛЯЕМ ОШИБКИ
    questionErrors.value.splice(index, 1)

    // ОБНОВЛЯЕМ ПОЗИЦИИ
    form.value.questions.forEach((q, idx) => {
      q.question.position = idx
    })

    // ОБНОВЛЯЕМ ТЕКУЩИЙ ИНДЕКС
    if (currentQuestionIndex.value >= form.value.questions.length) {
      currentQuestionIndex.value
        = form.value.questions.length - 1
    }

    // КОРРЕКЦИЯ ВИДИМОЙ ОБЛАСТИ
    const maxStartIndex = Math.max(
      0,
      form.value.questions.length - visibleCount,
    )

    if (visibleStartIndex.value > maxStartIndex) {
      visibleStartIndex.value = maxStartIndex
    }
  }

  function scrollUp() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }

    if (visibleStartIndex.value > currentQuestionIndex.value) {
      visibleStartIndex.value = currentQuestionIndex.value
    }
  }

  function scrollDown() {
    const maxIndex = form.value.questions.length - 1
    if (currentQuestionIndex.value < maxIndex) {
      currentQuestionIndex.value++
    }

    const maxStartIndex = Math.max(
      0,
      form.value.questions.length - visibleCount,
    )
    if (currentQuestionIndex.value >= visibleStartIndex.value + visibleCount) {
      visibleStartIndex.value = Math.min(
        currentQuestionIndex.value,
        maxStartIndex,
      )
    }
  }
  const showDelete = ref(false)

  function showDeletefn() {
    showDelete.value = true
  }
  function handleWheelScroll(event) {
    // Проверка направления прокрутки
    if (event.deltaY < 0) {
      // Если прокрутка вверх, переходим к предыдущим вопросам
      scrollUp()
    }
    else if (event.deltaY > 0) {
      // Если прокрутка вниз, переходим к следующим вопросам
      scrollDown()
    }
  }

  return {scrollToFirstError,
  questionRefs, visibleCount, visibleStartIndex, visibleQuestions, addQuestion, deleteQuestion, scrollUp, scrollDown, handleWheelScroll, showDelete, showDeletefn,setQuestionRef }
}
