export function useTypeQuestion(form, questionErrors) {
  const openIndexes = ref<Record<string, boolean>>({})
  function key(qIndex: number, mode: 'desktop' | 'mobile') {
  return `${mode}-${form.value.questions[qIndex].question.position}`
}
  const options = ['Один из списка', 'Ввод текста', 'Несколько из списка'] // Возможные опции
  // Маппинг типов вопросов
  const typeMap = {
    one: 'Один из списка',
    text: 'Ввод текста',
    many: 'Несколько из списка',
  }

  // Функция для отображения текста
  function selectedText(qIndex: number) {
  const question = form.value?.questions?.[qIndex]
  if (!question) return ''

  return typeMap[question.question.type] || ''
}
   const dropdownRefs = ref<Record<number, HTMLElement | null>>({})


function isOpen(qIndex: number, mode: 'desktop' | 'mobile') {
  return !!openIndexes.value[key(qIndex, mode)]
}

function toggleDropdown(qIndex: number, mode: 'desktop' | 'mobile') {
  const k = key(qIndex, mode)
  openIndexes.value[k] = !openIndexes.value[k]
}
  function closeDropdown(index: number) {
    openIndexes.value[index] = false
  }
  function handleClickOutside(event: MouseEvent) {
    Object.entries(dropdownRefs.value).forEach(([index, el]) => {
      if (
        openIndexes.value[Number(index)]
        && el
        && !el.contains(event.target as Node)
      ) {
        openIndexes.value[Number(index)] = false
      }
    })
  }
 function selectOption(option: string, qIndex: number, mode: 'desktop' | 'mobile') {
    const type = Object.keys(typeMap).find(
      key => typeMap[key] === option,
    )

    const previousType
      = form.value.questions[qIndex].question.type

    if (previousType === type) {
      openIndexes.value[form.value.questions[qIndex].question.position] = false
      return
    }

    form.value.questions[qIndex].question.type = type

    if (questionErrors.value[qIndex]) {
      questionErrors.value[qIndex].correctAnswers = false

      const answersLength
        = form.value.questions[qIndex].question.answers.length

      questionErrors.value[qIndex].answers
        = Array(answersLength).fill(false)
    }

    // логика смены ответов
    if (previousType === 'one' || previousType === 'many') {
      if (type === 'one' || type === 'many') {
        form.value.questions[qIndex].question.answers.forEach((answer) => {
          answer.is_correct = false
        })

        while (
          form.value.questions[qIndex].question.answers.length < 3
        ) {
          form.value.questions[qIndex].question.answers.push({
            text: '',
            is_correct: false,
          })
        }
      }
      else if (type === 'text') {
        form.value.questions[qIndex].question.answers = [
          {
            text: '',
            is_correct: true,
          },
        ]
      }
    }
    else if (previousType === 'text') {
      if (type === 'one' || type === 'many') {
        form.value.questions[qIndex].question.answers = [
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ]
      }
    }
    const k = key(qIndex, mode)
    openIndexes.value[k] = false
  }

 return {
    options,
    typeMap,
    selectedText,

    openIndexes,
    isOpen,

    dropdownRefs,

    toggleDropdown,
    closeDropdown,
    handleClickOutside,
    selectOption,
  }
}
