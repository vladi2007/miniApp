export function useScoreQuestion(form) {
  const scores = ref<Record<number, number>>({})

  function getScore(qIndex: number) {
    const val = scores.value[qIndex]

    if (val !== undefined) {
      return val
    }

    const formScore = Number(
      form.value.questions[qIndex]?.question?.score,
    )

    return !isNaN(formScore) && formScore > 0
      ? formScore
      : 1
  }

  function setScore(qIndex: number, value: number) {
    scores.value[qIndex] = value
    form.value.questions[qIndex].question.score = value
  }

  function validateScore(qIndex: number) {
    let v = Number(scores.value[qIndex])

    if (isNaN(v) || v < 1) v = 1
    if (v > 5) v = 5

    scores.value[qIndex] = v
    form.value.questions[qIndex].question.score = v
  }

  watch(
    () => form.value.questions,
    (questions) => {
      questions.forEach((q, index) => {
        const val = Number(q.question.score)

        scores.value[index]
          = !isNaN(val) && val > 0
            ? val
            : 1
      })
    },
    {
      immediate: true,
      deep: true,
    },
  )

  return {
    scores,
    getScore,
    setScore,
    validateScore,
  }
}