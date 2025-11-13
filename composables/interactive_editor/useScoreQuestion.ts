export function useScoreQuestion(currentQuestion) {
  const score = ref(1);

  // Вызывается при потере фокуса или Enter
  function validateScore() {
    let v = Number(score.value);
    if (isNaN(v) || v < 1) v = 1;
    if (v > 5) v = 5;
    score.value = v;
    currentQuestion.value.question.score = v;
  }

  // Следим за сменой вопроса
  watch(
    () => currentQuestion.value,
    (newQuestion) => {
      if (!newQuestion?.question) return;
      const val = Number(newQuestion.question.score);
      score.value = !isNaN(val) && val > 0 ? val : 1;
    },
    { immediate: true }
  );

  // Следим за обновлением из вне (но не вмешиваемся в ввод)
  watch(score, (newVal) => {
    if (!currentQuestion.value?.question) return;
    currentQuestion.value.question.score = newVal;
  });

  return { score, validateScore };
}
