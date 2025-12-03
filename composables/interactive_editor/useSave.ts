import { IMAGE_STATE_KEY } from "~/constants/interactiveKeys";
import { toRaw, isRef } from "vue";
export function useSave(
  route,
  active_step,
  form,
  validateForm,
  validateQuestions,
  mode?,
  userId?,
  id?
) {
  const showSavePopup = ref(false);
  function cleanFormBeforeSave(formValue) {
    const cleaned = JSON.parse(JSON.stringify(formValue)); // делаем копию
    cleaned.questions = cleaned.questions.map((q) => {
      if (q.question) {
        delete q.question.uploadedFileName;
      }
      return q;
    });
    return cleaned;
  }
  async function collectImagesFromDB() {
    const allKeys = await getAllDeviceStorageKeys();
    const imageKeys = allKeys.filter((key) => key.startsWith(IMAGE_STATE_KEY));
    const files = [];

    for (const key of imageKeys) {
      const item = await loadFromDeviceStorage(key);
      files.push(item?.file);
    }
    return files;
  }

  async function handleSave() {
    showSavePopup.value = false;
    const isMainValid = validateForm();
    if (!isMainValid) {
      active_step.value = "main";
      return false;
    }

    const isQuestionsValid = validateQuestions();
    if (!isQuestionsValid) {
      active_step.value = "questions";
      return false;
    }

    const plainForm = structuredClone(toRaw(form.value));

    if (Array.isArray(plainForm.questions)) {
      plainForm.questions = plainForm.questions.map((q) => q.question || q);
      plainForm.questions.forEach((q, index) => {
        q.position = index + 1;
      });
    }

    // Собираем изображения из локального стора
    const images = await collectImagesFromDB();

    const formData = new FormData();

    const cleanedForm = cleanFormBeforeSave(plainForm);
    formData.append("telegram_id", String(userId?.value || 0));
    formData.append("interactive", JSON.stringify(cleanedForm));

    for (const file of images) {
      if (file instanceof File) {
        formData.append("images", file);
      }
    }
     let response: CreateInteractiveResponse
    if (mode.value === "edit") {
      console.log("mode");
      const response = await $fetch("/api/edit_interatcive", {
        
        method: "PATCH",
        query: {
          telegram_id: userId?.value || 0,
          interactive_id: id
        },
        body: formData,
        
      });
      route.push({path:'/leader/new_interactives',  query: { from: `/leader/` }})
      console.log(response);
      return response.data.interactive_id;
      
    } else {
       response = await $fetch("/api/create_interactive", {
        method: "POST",
        query: {
          telegram_id: userId?.value || 0,
        },
        body: formData,
      });
      route.push({path:'/leader/new_interactives',  query: { from: `/leader/` }})
       console.log(response.data)
      return response.data;
     
    }
  }
type CreateInteractiveResponse = {
  data: {
    interactive_id: number
  }
}

const showStart=ref(false)
 async function handleStart() {
    const isMainValid = validateForm();
    if (!isMainValid) {
      active_step.value = "main";
      showStart.value=false
      return false;
    }
    const isQuestionsValid = validateQuestions();
    if (!isQuestionsValid) {
      active_step.value = "questions";
      showStart.value=false
      return false;
    }
    const response = await handleSave();
    
    route.push(`/leader/${response}`)
  }

  return { showSavePopup, handleSave, handleStart,showStart };
}
