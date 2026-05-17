import { IMAGE_STATE_KEY } from '~/constants/interactiveKeys'

export function useImage(form) {
  const imageUrls = ref({})
  function getImageKey(index: number) {
  return `${IMAGE_STATE_KEY}_${index}`
}
 async function loadImageDB() {
    if (!form.value?.questions?.length) return

    await Promise.all(
      form.value.questions.map(async (qWrap, index) => {
        const question = qWrap.question
        const imageKey = getImageKey(index)

        const imageState = await loadFromDeviceStorage(imageKey)

        if (imageState?.file && imageState?.name) {
          const blobUrl = URL.createObjectURL(imageState.file)

          imageUrls.value[index] = blobUrl
          question.uploadedFileName = imageState.name
          question.image = 'image'
        } else {
          imageUrls.value[index] = ''
          question.uploadedFileName = ''
          question.image = ''
        }
      })
    )
  }
  

  const mime_to_ext = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/svg+xml': 'svg',
  }
  async function handleFileChange(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  const imageKey = getImageKey(index)

  if (!file) return

  const MAX_SIZE_MB = 5
  const fileSizeMB = file.size / (1024 * 1024)

  if (fileSizeMB > MAX_SIZE_MB) {
    window.Telegram.WebApp.showAlert(
      `Файл слишком большой. Максимальный размер: ${MAX_SIZE_MB}MB.`
    )
    event.target.value = ''
    return
  }

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
  ]

  if (!allowed.includes(file.type)) {
    window.Telegram.WebApp.showAlert(
      'Неверный формат файла.'
    )
    event.target.value = ''
    return
  }

  const blobUrl = URL.createObjectURL(file)

  form.value.questions[index].question.image = 'image'
  form.value.questions[index].question.uploadedFileName = file.name
  imageUrls.value[index] = blobUrl

  await saveToDeviceStorage(imageKey, {
    name: file.name,
    file,
  })

  event.target.value = ''
}
  async function removeImage(index: number) {
  const imageKey = getImageKey(index)

  if (imageUrls.value[index]) {
    URL.revokeObjectURL(imageUrls.value[index])
    delete imageUrls.value[index]
  }

  form.value.questions[index].question.image = ''
  form.value.questions[index].question.uploadedFileName = ''

  await clearDeviceStorage(imageKey)
}
  return {
    imageUrls, // теперь у нас словарь blob-url'ов
    loadImageDB,
    handleFileChange,
    removeImage,
  }
}
