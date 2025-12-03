import { clearDeviceStorage, getAllDeviceStorageKeys } from '~/utils/deviceStorageIndexedDB'
import { IMAGE_STATE_KEY } from '~/constants/interactiveKeys'
export function useQuestionNavigator(
  form,
  currentQuestionIndex,
  questionErrors

) {
  const visibleCount = 3;
  const visibleStartIndex = ref(0);
  const visibleQuestions = computed(() => {
    const total = form.value.questions.length;
    const result = [];

    for (let i = 0; i < visibleCount; i++) {
      const idx = visibleStartIndex.value + i;
      if (idx < total) {
        result.push(form.value.questions[idx]);
      }
    }
    return result;
  });
  watch(currentQuestionIndex, (newIndex) => {
    const total = form.value.questions.length;
    if (newIndex < visibleStartIndex.value) {
      visibleStartIndex.value = newIndex;
    } else if (newIndex >= visibleStartIndex.value + visibleCount) {
      visibleStartIndex.value = newIndex - visibleCount + 1;
    }
  });

  function addQuestion() {
    if (form.value.questions.length < 20) {
      form.value.questions.push({
        question: {
          type: "one",
          image: "",
          score: "1",
          position: form.value.questions.length,
          text: "",
          answers: Array(3)
            .fill(null)
            .map(() => ({ text: "", is_correct: false })),
        },
      });
      questionErrors.value[form.value.questions.length - 1] = {
        text: false,
        score: false,
        type: false,
        answers: [],
        correctAnswers: false,
      };
      currentQuestionIndex.value = form.value.questions.length - 1;

      // Сдвигаем видимую область, если нужно
      if (
        currentQuestionIndex.value >=
        visibleStartIndex.value + visibleCount
      ) {
        visibleStartIndex.value = currentQuestionIndex.value - visibleCount + 1;
      }
    } else {
      currentQuestionIndex.value = form.value.questions.length - 1;

      visibleStartIndex.value = Math.max(
        0,
        form.value.questions.length - visibleCount
      );
    }
  }

  async function deleteQuestion() {
    if (form.value.questions.length===1){  showDelete.value=false;form.value.questions.push({
        question: {
          type: "one",
          image: "",
          score: "1",
          position: form.value.questions.length,
          text: "",
          answers: Array(3)
            .fill(null)
            .map(() => ({ text: "", is_correct: false })),
        },
      });}
    if (form.value.questions.length > 1) {
      
       showDelete.value=false
      form.value.questions.splice(currentQuestionIndex.value, 1);
      const indexToDelete = currentQuestionIndex.value

      // 🧹 1. Удаляем изображение из IndexedDB
      const imageKey = `${IMAGE_STATE_KEY}_${indexToDelete}`
      await clearDeviceStorage(imageKey)
      if (form.value.questions[indexToDelete]) {
        form.value.questions[indexToDelete].question.image = ''
      }
      // Обновляем позиции
      form.value.questions.forEach((q, index) => {
        q.question.position = index;
      });

      if (currentQuestionIndex.value >= form.value.questions.length) {
        currentQuestionIndex.value = form.value.questions.length - 1;
      }

      // Обновляем visibleStartIndex, чтобы сохранялось 3 видимых
      const maxStartIndex = Math.max(
        0,
        form.value.questions.length - visibleCount
      );
      if (visibleStartIndex.value > maxStartIndex) {
        visibleStartIndex.value = maxStartIndex;
      }
    }
  }

  function scrollUp() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }

    if (visibleStartIndex.value > currentQuestionIndex.value) {
      visibleStartIndex.value = currentQuestionIndex.value;
    }
  }

  function scrollDown() {
    const maxIndex = form.value.questions.length - 1;
    if (currentQuestionIndex.value < maxIndex) {
      currentQuestionIndex.value++;
    }

    const maxStartIndex = Math.max(
      0,
      form.value.questions.length - visibleCount
    );
    if (currentQuestionIndex.value >= visibleStartIndex.value + visibleCount) {
      visibleStartIndex.value = Math.min(
        currentQuestionIndex.value,
        maxStartIndex
      );
    }
  }
  const showDelete=ref(false)
  async function showDeletefn(){
   showDelete.value=true
}
  function handleWheelScroll(event) {
    // Проверка направления прокрутки
    if (event.deltaY < 0) {
      // Если прокрутка вверх, переходим к предыдущим вопросам
      scrollUp();
    } else if (event.deltaY > 0) {
      // Если прокрутка вниз, переходим к следующим вопросам
      scrollDown();
    }
  }

  return {visibleCount, visibleStartIndex, visibleQuestions, addQuestion, deleteQuestion, scrollUp, scrollDown ,handleWheelScroll,showDelete, showDeletefn}
}
