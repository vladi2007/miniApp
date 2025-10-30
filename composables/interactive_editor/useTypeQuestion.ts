export function useTypeQuestion(form, currentQuestionIndex, questionErrors) {
  const isOpen = ref(false); // Состояние, открыто ли меню
  const options = ["Один из списка", "Ввод текста", "Несколько из списка"]; // Возможные опции
  // Маппинг типов вопросов
  const typeMap = {
    one: "Один из списка",
    text: "Ввод текста",
    many: "Несколько из списка",
  };

  // Функция для отображения текста
  const selectedText = computed(
    () =>
      typeMap[form.value.questions[currentQuestionIndex.value].question.type]
  );
  const dropdownRef = ref(null);

  function toggleDropdown() {
    isOpen.value = !isOpen.value;
  }
  function handleClickOutside(event) {
    if (
      isOpen.value &&
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target)
    ) {
      isOpen.value = false;
    }
  }

  function selectOption(option) {
    const type = Object.keys(typeMap).find((key) => typeMap[key] === option);
    const previousType =
      form.value.questions[currentQuestionIndex.value].question.type;

    if (previousType === type) {
      isOpen.value = false;
      return;
    }

    // Обновляем тип вопроса
    form.value.questions[currentQuestionIndex.value].question.type = type;

    if (questionErrors.value[currentQuestionIndex.value]) {
      questionErrors.value[currentQuestionIndex.value].correctAnswers = false;

      const answersLength =
        form.value.questions[currentQuestionIndex.value].question.answers
          .length;
      questionErrors.value[currentQuestionIndex.value].answers =
        Array(answersLength).fill(false);
    }

    // Обновляем ответы в зависимости от типа
    if (previousType === "one" || previousType === "many") {
      if (type === "one" || type === "many") {
        form.value.questions[
          currentQuestionIndex.value
        ].question.answers.forEach((answer) => {
          answer.is_correct = false;
        });
        while (
          form.value.questions[currentQuestionIndex.value].question.answers
            .length < 3
        ) {
          form.value.questions[
            currentQuestionIndex.value
          ].question.answers.push({ text: "", is_correct: false });
        }
      } else if (type === "text") {
        form.value.questions[currentQuestionIndex.value].question.answers = [
          { text: "", is_correct: true },
        ];
      }
    } else if (previousType === "text") {
      if (type === "one" || type === "many") {
        form.value.questions[currentQuestionIndex.value].question.answers = [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ];
      }
    }

    isOpen.value = false;
  }

  return { isOpen,options,typeMap, selectedText,dropdownRef,toggleDropdown,handleClickOutside,selectOption}
}
