<script setup lang="ts">

// данные о результатах интерактива: таблица лидеров
const props = defineProps<{
  title: string
  participantsTotal: string
  stage:string
}>()


</script>

<template>
  <div class="end_description">
    <div class ='end_img_leader' >
      <img src="/images/interactive_end/Rectangle_98_leader.svg" id="interactive_end_rectangle" />
      <img src="/images/interactive_end/Rectangle_97_leader.svg" id="interactive_end_rectangle2" />
      <img src="/images/interactive_end/Rectangle_88_leader.svg" id="interactive_end_rectangle3" />
      <img src="/images/interactive_end/Rectangle_76_leader.svg" id="interactive_end_rectangle4" />
      <img src="/images/interactive_end/Star_1_leader.svg" id="interactive_end_star" />
      <img src="/images/interactive_end/Vector_3_leader.svg" id="interactive_end_vector" />
      <img src="/images/interactive_end/Vector_6_leader.svg" id="interactive_end_vector2" />
      <img src="/images/interactive_end/Vector_4_leader.svg" id="interactive_end_vector3" />
      <img src="/images/interactive_end/Vector_5_leader.svg" id="interactive_end_vector4" />
      <img src="/images/interactive_end/Rectangle_89_leader.svg" id="interactive_end_rectangle5" />
      <img src="/images/interactive_end/Rectangle_92_leader.svg" id="interactive_end_rectangle6" />
      <img src="/images/interactive_end/Ellipse_40_leader.svg" id="interactive_end_ellipse" />
      <img src="/images/interactive_end/Vector_89_1_leader.svg" id="interactive_end_vector5" />
      <img src="/images/interactive_end/Ellipse_44_leader.svg" id="interactive_end_ellipse2" />
      <img src="/images/interactive_end/Rectangle_94_leader.svg" id="interactive_end_rectangle7" />
      <img src="/images/interactive_end/Rectangle_100_leader.svg" id="interactive_end_rectangle8" />
      <img src="/images/interactive_end/Rectangle_95_leader.svg" id="interactive_end_rectangle9" />
      <img src="/images/interactive_end/Ellipse_45_1_leader.svg" id="interactive_end_ellipse3" />
    </div>
    <div class="end_desc-content">
      <div class="end_interactive-title">{{ props.title }}</div>
      <div class="participants-num">
        <div class="num">
          <p>{{ props.participantsTotal }}</p>
        </div>
        <div class="participant-text">Участников</div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
