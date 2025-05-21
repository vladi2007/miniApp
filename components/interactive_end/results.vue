<script setup lang="ts">
const props = defineProps<{
  title: string
  participantsTotal: string
  stage:string
}>()

const isParticipant = computed(() => props.stage === 'participant')
</script>

<template>
  <div class="end_description">
    <div class ='end_img_leader' v-if="!isParticipant">
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
.end_description{
  position: relative;
  
}
#interactive_end_rectangle{
  position: absolute;
  top:110px;
  right: 12px;
}
#interactive_end_rectangle2{
  position: absolute;
  top:164px;
  right: 64px;
  z-index: 3;
}
#interactive_end_rectangle3{
  position: absolute;
  top:182px;
  right: 97px;
  z-index: 2;
}
#interactive_end_rectangle4{
  position: absolute;
  top:139px;
  right: 197px;
  z-index: 2;
}
#interactive_end_star{
  position: absolute;
  bottom:62px;
  right: 208px;
  z-index: 2;
}
#interactive_end_vector{
  position: absolute;
  top:20px;
  right: 279px;
  z-index: 2;
}
#interactive_end_vector2{
  position: absolute;
  top:98px;
  right: 197px;
  z-index: 2;
}
#interactive_end_vector3{
  position: absolute;
  top:165px;
  right: 312px;
  z-index: 2;
}
#interactive_end_vector4{
  position: absolute;
  top:191px;
  right: 251px;
  z-index: 2;
}
#interactive_end_rectangle5{
  position: absolute;
  top:101px;
  right: 387px;
  z-index: 2;
}
#interactive_end_rectangle6{
  position: absolute;
  top:25px;
  right: 416px;
  z-index: 2;
}

#interactive_end_ellipse{
  position: absolute;
  top:75px;
  right: 529px;
  z-index: 2;
}

#interactive_end_vector5{
  position: absolute;
  top:169px;
  right: 380px;
  z-index: 2;
}
#interactive_end_ellipse2{
  position: absolute;
  top:207px;
  right: 539px;
  z-index: 2;
}

#interactive_end_rectangle7{
  position: absolute;
  top:263px;
  right: 648px;
  z-index: 2;
}

#interactive_end_rectangle8{
  position: absolute;
  top:115px;
  right: 606px;
  z-index: 2;
}

#interactive_end_rectangle9{
  position: absolute;
  top:30px;
  right: 688px;
  z-index: 2;
}

#interactive_end_ellipse3{
  position: absolute;
  top:168px;
  right: 762px;
  z-index: 2;
}

.end_interactive-title {
  color: white;
  margin-left: 73px;
  padding-top: 92px;
  font-family: 'Lato';
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 1px;;
  vertical-align: middle;
}






.participants-num {
  margin-top: 51px;
  ;
  display: flex;
  margin-left: 132px;
  ;
}


.num {
  background-color: #F7F7F766;
  padding: 6px;
  ;
  border-radius: 5px;
}

.num>p {
  color: #FFFFFF;
  font-weight: 700;
  font-size: 40px;
  font-family: 'Work Sans';
}

.participant-text {
  color: #FFFFFF;
  background-color: #F7F7F766;
  padding: 6px;
  ;
  border-radius: 5px;
  padding-left: 16px;
  padding-right: 16px;
  ;
  margin-left: 33px;
  ;
  font-weight: 500;
  font-size: 40px;
  font-family: 'Work Sans';
  vertical-align: middle;

}
</style>
