<script setup lang="ts">
import type { WaitingData } from '~/types/stageData'  // Импортируем тип данных
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'
//данные от бекенда
const props = defineProps<{
  stage: string
  data: WaitingData 
   context:string
   // Используем тип WaitingData
}>()

</script>

<template>
  <div class="waiting_participant_waiting">
    <div class="waiting_grey"></div>

    <div class="waiting_logo">
      <img src="/images/waiting/Clik.svg" />
      <img src="/images/waiting/Group.svg" />
      <img src="/images/waiting/Vector_88.svg" class="waiting_fixed" />
    </div>

    <div class="waiting_description">
      <div class="waiting_grey-line"></div>
    </div>

    <!-- Основной контент -->
    <div class="waiting_description-content">
      <p>Ждём участников, скоро начнём.</p>
    
      <!-- Передаем тестовые данные в компоненты -->
      <Active :count="props.data.participants_active " :context="context"/>
      <Description :title="props.data?.title || ''" :description="props.data?.description || ''" :context="context"/>
    </div>
  </div>
</template>

<style>
@import url("/assets/css/waiting/active_users.scss");
@import url("/assets/css/waiting/description.scss");
@import url("/assets/css/waiting/waiting.scss");


</style>
