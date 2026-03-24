<script setup lang="ts">
// данные о результатах интерактива: таблица лидеров
const props = defineProps<{
  title: string
  participantsTotal: string
  stage: string
}>()
</script>

<template>
  <div class="end_img_leader">
    <img
      id="interactive_end_rectangle"
      src="/public/images/interactive_end/Rectangle_98_leader.svg"
    >
    <img
      id="interactive_end_rectangle2"
      src="/public/images/interactive_end/Group 7094.svg"
    >
    <img
      id="interactive_end_rectangle4"
      src="/public/images/interactive_end/Group 7095 (1).svg"
    >
    <img
      id="interactive_end_rectangle5"
      src="/public/images/interactive_end/Group 2.svg"
    >
    <img
      id="interactive_end_rectangle6"
      src="/public/images/interactive_end/Group 3.svg"
    >
    <img
      id="interactive_end_ellipse2"
      src="/public/images/interactive_end/Ellipse_44_leader.svg"
    >
    <img
      id="interactive_end_rectangle9"
      src="/public/images/interactive_end/Group 7097.svg"
    >
    <img
      id="interactive_end_ellipse3"
      src="/public/images/interactive_end/Ellipse_45_1_leader.svg"
    >
  </div>

  <div class="end_interactive-title">
    {{ props.title }}
  </div>
  <div class="participants-num">
    <div class="num">
      <div>{{ props.participantsTotal }}</div>
    </div>
    <div class="participant-text">
      Участников
    </div>
  </div>
</template>

<style>

</style>
