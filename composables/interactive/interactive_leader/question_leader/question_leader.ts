export function UseQuestionLeader(
  onStatus: (status: string) => void,
  pause_state: Ref<string>,
  data_question_type: Ref<string>,
 
) {
  onMounted(() => {
    document.body.classList.add("question-leader-background");
  });
  onUnmounted(() => {
    document.body.classList.remove("question-leader-background");
  });

  const pauseRef = ref("no");
  function removeFromPause() {
    onStatus("pause");
    pauseRef.value = "no";
  }

  watch(
    () => pause_state,
    (newWal) => {
      if (newWal.value === "timer_n") {
      } else {
        pauseRef.value = newWal.value;
      }
    }
  );
  function morePause() {
    onStatus("more_pause");
    pauseRef.value = "yes";
  }

  const type = computed(() => {
    if (data_question_type.value === "one") {
      return "Один правильный ответ";
    } else if (data_question_type.value === "many") {
      return "Несколько правильных ответов";
    } else {
      return "Введите правильный ответ";
    }
  });

  function typedScore(value: number) {
    if (
      (9 < value % 100 && value % 100 < 20) ||
      (4 < value % 10 && value % 10 < 10) ||
      value % 10 == 0
    )
      return "баллов";
    else if (value % 10 == 1) return "балл";
    return "балла";
  }

 
  return {
    pauseRef,
    removeFromPause,
    morePause,
    typedScore,
    
  };
}
