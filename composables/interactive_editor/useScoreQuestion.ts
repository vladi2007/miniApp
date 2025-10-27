export function useScoreQuestion(currentQuestion) {
  const score = ref(1); // Изначальное значение баллов

  function validateScore() {
    if (score.value < 1) {
      score.value = 1;
    } else if (score.value > 5) {
      score.value = 5;
    }

    currentQuestion.value.question.score = score.value;
  }

  watch(
    () => currentQuestion.value,
    (newQuestion) => {
      if (!newQuestion?.question) return;
      const val = Number(newQuestion.question.score);
      score.value = !isNaN(val) && val > 0 ? val : 1;
    },
    { immediate: true } 
  );

  
  watch(score, (newVal) => {
    if (!currentQuestion.value?.question) return;
    let v = Number(newVal);
    if (isNaN(v) || v < 1) v = 1;
    if (v > 5) v = 5;
    score.value = v;
    currentQuestion.value.question.score = v;
  });

  return { score, validateScore };
}
