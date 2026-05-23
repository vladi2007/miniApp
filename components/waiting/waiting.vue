<script setup lang="ts">
// imports
import type { WaitingData } from '~/store/types/stageData'
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'

// data from backend
const props = defineProps<{
  stage: string
  data: WaitingData
  context: string
  isBanned?: any
}>()
</script>

<template>
  <div class="waiting_participant_waiting">
    <div class="waiting_grey" />

    <div class="waiting_logo">
      <img id="_waiting_logo" src="/public/images/waiting/Group 7067.svg">
      <img src="/public/images/waiting/Group 7095 (2).svg" class="waiting_fixed">
    </div>

    <div class="waiting_description" />
    <div class="waiting_grey-line" />
    <div class="waiting_description-content">
      <p v-if="!isBanned">Ждём участников, скоро начнём.</p>
      <div class="waiting_description-content-ban" v-else>
        <div>
          <img src="/public/images/waiting/ban_info.svg">
          <p>
            Вы были заблокированы в текущем квизе
          </p>
        </div>

      </div>
      <div class="waiting__count">
        <div class="waiting__count_number">
          {{ props.data.participants_active }}
        </div>
        <div class="waiting__count_text">
          Подключившихся<br> участников
        </div>
      </div>
      <div class="waiting__desc">
        <div class="waiting__desc_title">
          {{ props.data.title
          }}
        </div>
        <div class="waiting__desc_text">
          {{ props.data.description }}
        </div>

      </div>
    </div>
  </div>
</template>

<style>
@import url("/assets/css/waiting/active_users.scss");
@import url("/assets/css/waiting/description.scss");
@import url("/assets/css/waiting/waiting.scss");

.waiting__count {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.waiting__count_number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #853CFF;
  font-family: 'Work Sans', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 117%;
  letter-spacing: 1%;
  vertical-align: middle;
  color: #1D1D1D;

}

.waiting__count_text {
  font-family: "Lato", sans-serif;
  font-weight: 500;
  font-style: Medium;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1%;
  text-align: center;
  vertical-align: middle;
  color: #1D1D1D;
}

.waiting__desc {
  background-color: #853CFF;
  margin: 0 auto;
  width: 354px;
  height: 199px;
  margin-top: 57px;
  border-radius: 24px;
}

.waiting__desc_title {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1%;
  vertical-align: middle;
  color: white;
  height: 54px;
  display: flex;
  align-items: center;
  text-align: center;
  margin: 0 17px;
  padding: 0 13px;
  border-bottom: 1.5px solid #FFFFFF;
}

.waiting__desc_text {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 1%;
  vertical-align: middle;
  color: white;

  margin: 0 17px;
  margin-top: 20px;
  padding: 0 13px;
  ;
}
</style>
