import { IMAGE_STATE_KEY } from '~/constants/interactiveKeys'
import { toRaw, isRef } from 'vue'
import { mutateCreateInteractivities, mutateEditInteractive } from '../api/interactivities/useInteractivitiesMutation'
import { patchInteractive } from '../api/interactivities/interactivities'

export function useSave(
  route,
  active_step,
  form,
  validateForm,
  validateQuestions,
  mode?,
  userId?,
  id?,
) {
  const { mutate: saveInteractive } = mutateCreateInteractivities()
  const { mutate: editInteractive } = mutateEditInteractive()
  const { $queryClient } = useNuxtApp()
  const showSavePopup = ref(false)
  function cleanFormBeforeSave(formValue) {
    const cleaned = JSON.parse(JSON.stringify(formValue)) // делаем копию
    cleaned.questions = cleaned.questions.map((q) => {
      if (q.question) {
        delete q.question.uploadedFileName
      }
      return q
    })
    return cleaned
  }
  async function collectImagesFromDB() {
    const allKeys = await getAllDeviceStorageKeys()
    const imageKeys = allKeys.filter(key => key.startsWith(IMAGE_STATE_KEY))
    const files = []

    for (const key of imageKeys) {
      const item = await loadFromDeviceStorage(key)
      files.push(item?.file)
    }
    return files
  }

  async function handleSave() {
    showSavePopup.value = false
    const isMainValid = validateForm()
    if (!isMainValid) {
      active_step.value = 'main'
      return false
    }

    const isQuestionsValid = validateQuestions()
    if (!isQuestionsValid) {
      active_step.value = 'questions'
      return false
    }

    const plainForm = structuredClone(toRaw(form.value))

    if (Array.isArray(plainForm.questions)) {
      plainForm.questions = plainForm.questions.map(q => q.question || q)
      plainForm.questions.forEach((q, index) => {
        q.position = index + 1
      })
    }

    // Собираем изображения из локального стора
    const images = await collectImagesFromDB()

    const formData = new FormData()

    const cleanedForm = cleanFormBeforeSave(plainForm)
    formData.append('interactive', JSON.stringify(cleanedForm))

    for (const file of images) {
      if (file instanceof File) {
        formData.append('images', file)
      }
    }
    if (mode.value === 'edit') {
      await editInteractive({ formData: formData, interactive_id: Number(id) })
      route.push({ path: '/leader/new_interactives', query: { from: `/leader/` } })
    }
    else {
      await saveInteractive(formData)
      route.push({ path: '/leader/new_interactives', query: { from: `/leader/` } })
    }
  }
  type CreateInteractiveResponse = {
    data: {
      interactive_id: number
    }
  }

  const showStart = ref(false)
  async function handleStart() {
    const isMainValid = validateForm()
    if (!isMainValid) {
      active_step.value = 'main'
      showStart.value = false
      return false
    }
    const isQuestionsValid = validateQuestions()
    if (!isQuestionsValid) {
      active_step.value = 'questions'
      showStart.value = false
      return false
    }
    const response = await handleSave()
    $queryClient.invalidateQueries(['interactives'])
    route.push(`/leader/${response}`)
  }

  return { showSavePopup, handleSave, handleStart, showStart }
}
