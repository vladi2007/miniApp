export function useTimer(
  stage?: Ref<string | null> ,
  data_questions_count?: Ref<string |null>,
  data_question_position?: Ref<string | null>,
  data_question_type?: Ref<string | null>,
  data_timer?: Ref<string | null>,
  data_timer_duration?: Ref<string | null>
) {
  const timerLabel = computed(() => {
    if (stage?.value === "discussion") {
      if (
        Number(data_questions_count?.value) ===
        Number(data_question_position?.value)
      ) {
        return "Конец интерактива через:";
      } else {
        return "Следующий вопрос через:";
      }
    } else {
      return "Время на ответ:";
    }
  });
  const type = computed(() => {
    if (data_question_type?.value === "one") {
      return "Один правильный ответ";
    } else if (data_question_type?.value === "many") {
      return "Несколько правильных ответов";
    } else {
      return "Введите правильный ответ";
    }
  });

   // progressBar
  const progressPercent = computed(() => {
    const time = Number(data_timer?.value);
    if (isNaN(time) || !Number(data_timer_duration?.value)) return 0;
    return 100 - (time / Number(data_timer_duration?.value)) * 100;
  });

  // flag for resetting progressBar
  const resetting = ref(false);

  // watcher for resetting progressBar
  watch(
    () => data_timer?.value,
    (newVal, oldVal) => {
      const numericNew = Number(newVal);
      const numericOld = Number(oldVal);

      if (numericOld === 0 && numericNew > 0) {
        resetting.value = true;
      }
      if (numericOld !== 0) {
        resetting.value = false;
      }
    },
    { immediate: true }
  );
  return { timerLabel, type, progressPercent, resetting };
}
