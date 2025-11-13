import type { Router } from "vue-router";

export function UseWaitingLeader(
  pause_timer_n: number,
  router: Router,
  onStatus: (status: string) => void
) {
  watch(
    () => pause_timer_n,
    (newWal) => {
      if (newWal === 0) {
        router.push("/leader/interactives").then(() => {
          // Перезагрузка после успешной навигации
          window.location.reload();
        });
      }
    }
  );

  function morePause() {
    onStatus("more_pause");
  }

  function startBeforePause() {
    onStatus("going");
  }


  return {morePause,startBeforePause}
}
