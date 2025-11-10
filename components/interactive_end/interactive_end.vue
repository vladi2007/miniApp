<script setup lang="ts">
import { defineProps } from 'vue'
import type { EndData, EndWinners } from '~/types/stageData'
import Results from '~/components/interactive_end/results.vue'
import WinnersTable from '~/components/interactive_end/winners_table.vue'
import { clearDeviceStorage } from '~/utils/deviceStorage'
onMounted(() => {
  sessionStorage.clear()

})

// Получаем данные через props
const props = defineProps<{
  stage: string,
  data: EndData,
  winners: any
  score:any  // Используем тип данных EndData
}>()

function formatTime(secondsStr: number): string {
  const seconds = Number(secondsStr)
  if (isNaN(seconds)) return String(secondsStr) // защита от нечисловых значений

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
</script>

<template>
  <div class="interactive_end">
    <div class="interactive_end_timer">
      <div class="interactive_end_logo">
        <img src="/public/images/interactive_end/Group 7067 (2).svg" id="interactive_end_logo" />
      </div>

      <div class="end_description">
        <div class="end_desc-content">
          <p class="end_interactive-title">{{ props.data.title }}</p>
          <div class="participants-num">
            <div class="num">
              <p>{{ props.data.participants_total }}</p>
            </div>
            <p class="participant-text">Участников</p>
          </div>
        </div>
      </div>
    </div>

    <div class="your_score">
      <div class="your_score_header">
        Ваш результат:
      </div>
      <div class="your_score_content">
        <div class="your_score_content_table_line">

        </div>
        <div class="your_score_content_table_line_second">

        </div>
        <div class="your_score_content_table">

          <div style="font-family: 'Work Sans', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((20 / 390) * 100dvw), 40px);
  letter-spacing: clamp(0.10px, calc((20 / 100 / 390) * 100dvw), 0.40px);
text-align: center; display: flex;
">
            <div style="display: flex;">{{props.score?.position}} <div style="color: #A9A9A9 !important;">/{{ props.data.participants_total }}</div>
            </div>

          </div>
          <div style="font-family: 'Lato', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((14 / 390) * 100dvw),28px);
  letter-spacing: clamp(0.10px, calc((14 / 100 / 390) * 100dvw), 0.28px);
text-align: center;
">
            место
          </div>
        </div>
        <div class="your_score_content_table">
          <div class="your_score_content_table_line">

          </div>
          <div style="font-family: 'Work Sans', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((20 / 390) * 100dvw), 40px);
  letter-spacing: clamp(0.10px, calc((20 / 100 / 390) * 100dvw), 0.40px);
text-align: center;
">        {{formatTime(Number(props.score?.time))}}
          </div>
          <div style="font-family: 'Lato', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((14 / 390) * 100dvw),28px);
  letter-spacing: clamp(0.10px, calc((14 / 100 / 390) * 100dvw), 0.28px);
text-align: center;
">
            Время
          </div>
        </div>
        <div class="your_score_content_table">
          <div style="font-family: 'Work Sans', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((20 / 390) * 100dvw), 40px);
  letter-spacing: clamp(0.10px, calc((20 / 100 / 390) * 100dvw), 0.40px);
text-align: center;
">
            {{props.score?.score}}
          </div>
          <div style="font-family: 'Lato', sans-serif;
font-weight: 700;
font-style: Bold;
  font-size: clamp(10px, calc((14 / 390) * 100dvw),28px);
  letter-spacing: clamp(0.10px, calc((14 / 100 / 390) * 100dvw), 0.28px);
text-align: center;
">
            Баллы
          </div>
        </div>
      </div>
    </div>



    <!-- Передаем данные в компонент WinnersTable -->
    <WinnersTable :winners="props.data.winners" />
  </div>
</template>

<style>
@import url("~/assets/css/interactive_end/results.scss");
@import url("~/assets/css/interactive_end/winners_table.scss");
@import url("~/assets/css/interactive_end/interactive_end.scss");

.your_score {
  height: calc((97 / 844) * var(--app-height));
  width: calc((332 / 390) * 100dvw);
  ;
  background-color: #853CFF;
  border-radius: calc((24 / 844) * var(--app-height));
  margin: 0 auto;
  ;

  margin-top: calc((25 / 844) * var(--app-height));
  ;
  display: grid;
  justify-content: center;
}

.your_score_header {
  margin-top: calc((10 / 844) * var(--app-height));
  ;
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-style: Bold;
  font-size: clamp(10px, calc((16 / 390) * 100dvw), 32px);
  letter-spacing: clamp(0.10px, calc((16 / 100 / 390) * 100dvw), 0.32px);
  text-align: center;
  vertical-align: middle;
  color: white;

}

.your_score_content {
  height: calc((43 / 844) * var(--app-height));
  width: calc((257 / 390) * 100dvw);
  ;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.your_score_content_table {
  display: grid;
  align-items: center;
  justify-content: center;
  color: white;

}

.your_score_content_table>div {
  text-align: center;
  width: 100%;
  ;
  position: relative;
}

.your_score_content_table_line {
  position: absolute;
  top: 0px;
  left: calc(((83 + 95.5) / 390) * 100dvw);
  ;
  height: 100%;
  background-color: white;
  width: 0.1px;
  ;
}

.your_score_content_table_line_second {
  position: absolute;
  top: 0px;
  left: calc((78 / 390) * 100dvw);
  ;
  height: 100%;
  background-color: white;
  width: 0.1px;
  ;
}
</style>
