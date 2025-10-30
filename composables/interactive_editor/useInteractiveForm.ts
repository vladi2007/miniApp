import {
  FORM_STORAGE_KEY,
  CURRENT_INDEX_KEY,
  STEP_KEY,
} from "~/constants/interactiveKeys";
export function useInteractiveForm() {
  const form = ref({
    title: "",
    description: "",
    target_audience: "",
    location: "",
    responsible_full_name: "",
    answer_duration: 10,
    discussion_duration: 5,
    countdown_duration: 5,
    questions: [
      {
        question: {
          type: "one",
          image: "",
          uploadedFileName: '',
          score: 1,
          position: 0,
          text: "",
          answers: [
            { text: "", is_correct: false },
            { text: "", is_correct: false },
            { text: "", is_correct: false },
          ],
        },
      },
    ],
  });

  async function loadDB() {
    const savedForm = await loadFromDeviceStorage(FORM_STORAGE_KEY);
    if (savedForm) {
      form.value = savedForm;
    }

    const savedIndex = await loadFromDeviceStorage(CURRENT_INDEX_KEY);
    if (typeof savedIndex === "number") {
      currentQuestionIndex.value = savedIndex;
    }
    const storedStep = await loadFromDeviceStorage(STEP_KEY);
    if (storedStep) {
      active_step.value = storedStep;
    }
  }

  function take_step(value: string) {
    active_step.value = value;
  }

  const currentQuestionIndex = ref(0);
  const active_step = ref("main");
  const currentQuestion = computed(
    () => form.value.questions[currentQuestionIndex.value]
  );

  watch(
    () => form.value,
    async (newForm) => {
      const plainForm = toRaw(newForm);
      await saveToDeviceStorage(FORM_STORAGE_KEY, plainForm);
    },
    { deep: true }
  );
  watch(currentQuestionIndex, (newIndex) => {
    saveToDeviceStorage(CURRENT_INDEX_KEY, newIndex);
  });

  watch(active_step, (newStep) => {
    saveToDeviceStorage(STEP_KEY, newStep);
  });
  
  
  return {
    form,
    active_step,
    currentQuestion,
    currentQuestionIndex,
    loadDB,
    take_step,
  };
}
