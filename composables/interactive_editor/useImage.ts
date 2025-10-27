import {
  FORM_STORAGE_KEY,
  CURRENT_INDEX_KEY,
  STEP_KEY,
  IMAGE_STATE_KEY,
} from "~/constants/interactiveKeys";
export function useImage(currentQuestionIndex, form) {
  const imageUploaded = ref(false);
  const uploadedFileName = ref("");
  async function loadImageDB() {
    const imageKey = `${IMAGE_STATE_KEY}_${currentQuestionIndex.value}`;
    const imageState = await loadFromDeviceStorage(imageKey);
    const currentImage =
      form.value.questions[currentQuestionIndex.value]?.question.image;

    if (imageState && currentImage && currentImage !== "") {
      imageUploaded.value = true;
      uploadedFileName.value = imageState.name;
    } else {
      imageUploaded.value = false;
      uploadedFileName.value = "";
    }
  }
  watch(currentQuestionIndex, async (newIndex) => {
    const imageKey = `${IMAGE_STATE_KEY}_${newIndex}`;
    const imageState = await loadFromDeviceStorage(imageKey);
    const currentImage = form.value.questions[newIndex]?.question.image;

    if (currentImage && currentImage !== "") {
      imageUploaded.value = true;
      uploadedFileName.value = imageState?.name || "изображение.png";
    } else {
      imageUploaded.value = false;
      uploadedFileName.value = "";
    }
  });

  watch(currentQuestionIndex, (newIndex, oldIndex) => {
    if (oldIndex !== undefined) {
      imageUploaded.value = false; // Сбрасываем статус для предыдущего вопроса
    }
    // Проверяем, есть ли изображение у нового вопроса
    imageUploaded.value = form.value.questions[newIndex].question.image !== "";
  });

  async function handleFileChange(event) {
    const file = event.target.files[0];
    const index = currentQuestionIndex.value;
    const imageKey = `${IMAGE_STATE_KEY}_${index}`; // формируем динамически!
    if (file) {
      uploadedFileName.value = file.name;
      const reader = new FileReader();

      reader.onload = async () => {
        const base64 = `${reader.result}#${Date.now()}`;
        form.value.questions[currentQuestionIndex.value].question.image = "";
        await nextTick();
        form.value.questions[currentQuestionIndex.value].question.image =
          base64;

        imageUploaded.value = true;

        await saveToDeviceStorage(
          `${IMAGE_STATE_KEY}_${currentQuestionIndex.value}`,
          {
            name: file.name,
            data: base64,
          }
        );
        event.target.value = "";
      };

      reader.readAsDataURL(file);
    } else {
      form.value.questions[currentQuestionIndex.value].question.image = "";
      uploadedFileName.value = "";
      imageUploaded.value = false;

      saveToDeviceStorage(imageKey, null);
    }
  }
  function removeImage() {
    const index = currentQuestionIndex.value;
    const imageKey = `${IMAGE_STATE_KEY}_${index}`;

    form.value.questions[index].question.image = "";
    uploadedFileName.value = "";
    imageUploaded.value = false;

    clearDeviceStorage(imageKey);
  }
  return {
    imageUploaded,
    uploadedFileName,
    loadImageDB,
    handleFileChange,
    removeImage,
  };
}
