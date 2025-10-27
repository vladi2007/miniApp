import {
  FORM_STORAGE_KEY,
  CURRENT_INDEX_KEY,
  STEP_KEY,
  IMAGE_STATE_KEY,
} from "~/constants/interactiveKeys";

export function useSave(route,active_step,form,validateForm, validateQuestions ){
    const showSavePopup = ref(false)


function handleSave() {
    const isMainValid = validateForm();
    showSavePopup.value = false
    if (!isMainValid) {
        active_step.value = 'main';

        return false;
    }

    const isQuestionsValid = validateQuestions();

    if (!isQuestionsValid) {
        active_step.value = 'questions';
        return false;
    }
    route.push('/leader/interactives')
    console.log(form.value)
    clearDeviceStorage(FORM_STORAGE_KEY)
    clearDeviceStorage(CURRENT_INDEX_KEY)
    clearDeviceStorage(STEP_KEY)
    return true;
}


function handleStart() {
    const isMainValid = validateForm();
    showSavePopup.value = false
    if (!isMainValid) {
        active_step.value = 'main';

        return false;
    }

    const isQuestionsValid = validateQuestions();

    if (!isQuestionsValid) {
        active_step.value = 'questions';
        return false;
    }

    console.log(form.value)
    console.log("Интерактив запущен");
}

return {showSavePopup, handleSave, handleStart}
}