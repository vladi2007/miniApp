import {
  FORM_STORAGE_KEY,
  CURRENT_INDEX_KEY,
  STEP_KEY,
  IMAGE_STATE_KEY,
} from "~/constants/interactiveKeys";

import { useInteractiveForm } from "./useInteractiveForm";

export function useValidateForm(
  form,
  active_step,
  currentQuestion,
  currentQuestionIndex
) {
  const questionErrors = ref([]);
  const isFormComplete = computed(() => {
    const f = form.value;
    return (
      Boolean(f.title?.trim()) &&
      Boolean(f.description?.trim()) &&
      Boolean(f.target_audience?.trim()) &&
      Boolean(f.location?.trim()) &&
      Boolean(f.responsible_full_name?.trim()) &&
      Number(f.answer_duration) > 0 &&
      Number(f.discussion_duration) > 0 &&
      Number(f.countdown_duration) > 0
    );
  });

  const errors = ref({
    title: false,
    description: false,
    target_audience: false,
    location: false,
    responsible_full_name: false,
    answer_duration: false,
    discussion_duration: false,
    countdown_duration: false,
  });
  function validateQuestions() {
    active_step.value;
    let isValid = true;
    questionErrors.value = [];

    for (let i = 0; i < form.value.questions.length; i++) {
      const q = form.value.questions[i].question;
      const error = {
        text: false,
        score: false,
        type: false,
        answers: [],
        correctAnswers: false,
      };

      if (!q.text.trim()) {
        error.text = true;
        isValid = false;
      }

      if (!(+q.score >= 1 && +q.score <= 5)) {
        error.score = true;
        isValid = false;
      }

      if (!q.type || !["one", "many", "text"].includes(q.type)) {
        error.type = true;
        isValid = false;
      }

      q.answers.forEach((a, index) => {
        if (!a.text.trim()) {
          error.answers[index] = true;
          isValid = false;
        } else {
          error.answers[index] = false;
        }
      });

      if (q.type === "one") {
        const correct = q.answers.filter((a) => a.is_correct);
        if (correct.length !== 1) {
          error.correctAnswers = true;
          isValid = false;
        }
      }

      if (q.type === "many") {
        const correct = q.answers.filter((a) => a.is_correct);
        if (correct.length < 2 || correct.length > 5) {
          error.correctAnswers = true;
          isValid = false;
        }
      }

      questionErrors.value[i] = error;

      // Переключаемся на первый вопрос с ошибкой
      if (!isValid) {
        currentQuestionIndex.value = i;
        break;
      }
    }
    if (!isValid && active_step.value === "main") {
      active_step.value = "questions";
    }
    return isValid;
  }
  function validateForm() {
    errors.value.title = !form.value.title.trim();
    errors.value.description = !form.value.description.trim();
    errors.value.target_audience = !form.value.target_audience.trim();
    errors.value.location = !form.value.location.trim();
    errors.value.responsible_full_name =
      !form.value.responsible_full_name.trim();
    errors.value.answer_duration = !(form.value.answer_duration > 0);
    errors.value.discussion_duration = !(form.value.discussion_duration > 0);
    errors.value.countdown_duration = !(form.value.countdown_duration > 0);

    return Object.values(errors.value).every((v) => v === false);
  }
  watch(
    form,
    (newVal) => {
      for (const key in newVal) {
        if (
          (typeof newVal[key] === "string" && newVal[key].trim()) ||
          (typeof newVal[key] === "number" && newVal[key] > 0)
        ) {
          errors.value[key] = false;
        }
      }
    },
    { deep: true }
  );

  watch(
    () => form.value.questions,
    (newQuestions) => {
      newQuestions.forEach((qWrap, index) => {
        const q = qWrap.question;

        // Если ошибка уже была, проверяем — нужно ли её снять
        if (questionErrors.value[index]) {
          const error = questionErrors.value[index];

          // Текст вопроса
          if (q.text.trim()) {
            error.text = false;
          }

          // Баллы
          if (+q.score >= 1 && +q.score <= 5) {
            error.score = false;
          }

          // Тип вопроса
          if (["one", "many", "text"].includes(q.type)) {
            error.type = false;
          }

          // Ответы
          q.answers.forEach((a, i) => {
            if (a.text.trim()) {
              error.answers[i] = false;
            }
          });

          // Корректные ответы
          if (q.type === "one") {
            const correct = q.answers.filter((a) => a.is_correct);
            if (correct.length === 1) {
              error.correctAnswers = false;
            }
          }

          if (q.type === "many") {
            const correct = q.answers.filter((a) => a.is_correct);
            if (correct.length >= 2 && correct.length <= 5) {
              error.correctAnswers = false;
            }
          }
        }
      });
    },
    { deep: true }
  );
  function getIconSrcWithValidation(
    type,
    isCorrect,
    hasError,
    index,
    question
  ) {
    const errorIcons = {
      one: "/images/interactive_editor/answer_circle_red.svg",
      many: "/images/interactive_editor/answer_square_red.svg",
    };

    // Тип "один из списка" — всё просто
    if (type === "one") {
      if (hasError) {
        return errorIcons.one;
      }

      return isCorrect
        ? "/images/interactive_editor/answer_circle_pick.svg"
        : "/images/interactive_editor/answer_circle.svg";
    }

    // Тип "несколько из списка"
    if (type === "many") {
      const correctCount = question.answers.filter((a) => a.is_correct).length;

      if (hasError && !isCorrect && correctCount < 2) {
        // Ошибка: слишком мало выбранных, и этот конкретный не выбран — показываем красный
        return errorIcons.many;
      }

      // Показываем обычную иконку в остальных случаях
      return isCorrect
        ? "/images/interactive_editor/green.svg"
        : "/images/interactive_editor/answer_square_gray.svg";
    }

    return "";
  }
  return {
    questionErrors,
    isFormComplete,
    errors,
    validateQuestions,
    validateForm,
    getIconSrcWithValidation,
  };
}
