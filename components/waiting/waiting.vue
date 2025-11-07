<script setup lang="ts">

// imports
import type { WaitingData } from '~/types/stageData'
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'

// data from backend
const props = defineProps<{
  stage: string
  data: WaitingData
  context: string

}>()

</script>

<template>
  <div class="waiting_participant_waiting">
    <div class="waiting_grey"></div>

    <div class="waiting_logo">
      <img src="/public/images/waiting/Group 7067.svg" id = "_waiting_logo"/>
      <img src="/public/images/waiting/Group 7095 (2).svg" class="waiting_fixed" />
    </div>

    <div class="waiting_description">
     
    </div>
     <div class="waiting_grey-line"></div>
    <div class="waiting_description-content">
      <p>Ждём участников, скоро начнём.</p>

      <Active :count="props.data.participants_active" :context="context" />
      <Description :title="props.data?.title || ''" :description="props.data?.description || ''" :context="context" />
    </div>
  </div>
</template>

<style>
@import url("/assets/css/waiting/active_users.scss");
@import url("/assets/css/waiting/description.scss");
@import url("/assets/css/waiting/waiting.scss");
</style>
