export function useAnswerQuestion(form) {
  const getAnswerCount = (type) => {
    if (type === 'text') {
      return [{ text: '', is_correct: true }] // Для типа 'text' один ответ и он правильный по умолчанию
    }
    else {
      return Array(3).fill({ text: '', is_correct: false }) // Для других типов 3 ответа
    }
  }
  function deleteAnswer(questionIndex, answerIndex) {
  const question = form.value.questions[questionIndex]?.question
  if (!question?.answers) return

  if (question.type === 'many' && question.answers.length < 3) return

  question.answers.splice(answerIndex, 1)
}
  function toggleCorrect(questionIndex, answerIndex) {
  const question = form.value.questions[questionIndex]?.question
  if (!question) return

  const { type, answers } = question

  if (type === 'one') {
    answers.forEach((a, i) => {
      a.is_correct = i === answerIndex
    })
  }

  if (type === 'many') {
    answers[answerIndex].is_correct = !answers[answerIndex].is_correct
  }
}

  function getIconSrc(type, isCorrect) {
    if (type === 'one') {
      return isCorrect
        ? '/images/interactive_editor/answer_circle_pick.svg'
        : '/images/interactive_editor/answer_circle.svg'
    }
    if (type === 'many') {
      return isCorrect
        ? '/images/interactive_editor/answer_square_picked.svg'
        : '/images/interactive_editor/answer_square_gray.svg'
    }
    return '' // Для text ничего не показываем
  }
  // Функция для добавления нового ответа
  function addAnswer(questionIndex) {
  const question = form.value.questions[questionIndex]?.question
  if (!question) return

  if ((question.type === 'one' || question.type === 'many') && question.answers.length < 5) {
    question.answers.push({ text: '', is_correct: false })
  }

  if (question.type === 'text' && question.answers.length < 3) {
    question.answers.push({ text: '', is_correct: true })
  }
}

  const limit_answers = computed(() => {
  return form.value.questions.map((q) => {
    const question = q.question

    if (!question?.answers) return false

    if (question.type === 'one' || question.type === 'many') {
      return question.answers.length >= 5
    }

    if (question.type === 'text') {
      return question.answers.length >= 3
    }

    return false
  })
})

  return { getAnswerCount, deleteAnswer, toggleCorrect, getIconSrc, addAnswer, limit_answers }
}
