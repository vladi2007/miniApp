import {
  IMAGE_STATE_KEY,
} from "~/constants/interactiveKeys";
export function useImage(currentQuestionIndex, form, currentQuestion) {
  const imageUrls = ref({});
  async function loadImageDB() {
    const index = currentQuestionIndex.value;
    const imageKey = `${IMAGE_STATE_KEY}_${currentQuestionIndex.value}`;
    const imageState = await loadFromDeviceStorage(imageKey);
    if (imageState?.file && imageState?.name) {
      // создаём blob url для отображения
      const blobUrl = URL.createObjectURL(imageState.file);
      imageUrls.value[index] = blobUrl;
      form.value.questions[index].question.uploadedFileName = imageState.name;
      form.value.questions[index].question.image = "image";
    } else {
      form.value.questions[index].question.image = "";
      form.value.questions[index].question.uploadedFileName = "";
    }
  }
  watch(currentQuestionIndex, async (newIndex, oldIndex) => {
  // Удаляем старую ссылку, если была
  if (oldIndex !== undefined && imageUrls.value[oldIndex]) {
    URL.revokeObjectURL(imageUrls.value[oldIndex]);
  }

  // Проверяем, есть ли изображение у нового вопроса
  const question = form.value.questions[newIndex]?.question;
  if (!question) return;

  const imageKey = `${IMAGE_STATE_KEY}_${newIndex}`;
  const imageState = await loadFromDeviceStorage(imageKey);

  if (question.image && question.image !== "") {
    if (imageState?.file) {
      imageUrls.value[newIndex] = URL.createObjectURL(imageState.file);
    }
  } else {
    imageUrls.value[newIndex] = "";
  }
});

  async function handleFileChange(event) {
    const file = event.target.files[0];
    const index = currentQuestionIndex.value;
    const imageKey = `${IMAGE_STATE_KEY}_${index}`;
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      form.value.questions[index].question.image = "image";
      form.value.questions[index].question.uploadedFileName = file.name
      imageUrls.value[index] = blobUrl;
      await saveToDeviceStorage(imageKey, {
        name: file.name,
        file,
      });
      event.target.value = "";
    } else {
      form.value.questions[index].question.image = "";
      delete imageUrls.value[index];
      saveToDeviceStorage(imageKey, null);
    }
  }
    async function removeImage() {
    const index = currentQuestionIndex.value;
    const imageKey = `${IMAGE_STATE_KEY}_${index}`;

    if (imageUrls.value[index]) {
      URL.revokeObjectURL(imageUrls.value[index]);
      delete imageUrls.value[index];
    }

    form.value.questions[index].question.image = "";
    form.value.questions[index].question.uploadedFileName = "";
    await clearDeviceStorage(imageKey);
  }
  return {
    imageUrls, // теперь у нас словарь blob-url'ов
    loadImageDB,
    handleFileChange,
    removeImage,
  };
}
