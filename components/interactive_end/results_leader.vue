<script setup lang="ts">

// данные о результатах интерактива: таблица лидеров
const props = defineProps<{
  title: string
  participantsTotal: string
  stage:string
}>()


</script>

<template>
    <div class ='end_img_leader' >
      <img src="/public/images/interactive_end/Rectangle_98_leader.svg" id="interactive_end_rectangle" />
      <img src="/public/images/interactive_end/Group 7094.svg" id="interactive_end_rectangle2" />
      <img src="/public/images/interactive_end/Group 7095 (1).svg" id="interactive_end_rectangle4" />
      <img src="/public/images/interactive_end/Group 2.svg" id="interactive_end_rectangle5" />
      <img src="/public/images/interactive_end/Group 3.svg" id="interactive_end_rectangle6" />
      <img src="/public/images/interactive_end/Ellipse_44_leader.svg" id="interactive_end_ellipse2" />
      <img src="/public/images/interactive_end/Group 7097.svg" id="interactive_end_rectangle9" />
      <img src="/public/images/interactive_end/Ellipse_45_1_leader.svg" id="interactive_end_ellipse3" />
    </div>
      
      <div class="end_interactive-title">{{ props.title }}</div>
      <div class="participants-num">
        <div class="num">
          <div>{{ props.participantsTotal }}</div>
        </div>
        <div class="participant-text">Участников</div>
      </div>
</template>

<style>

</style>
