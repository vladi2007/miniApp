<script setup lang="ts">
import type { EndData, EndWinners } from '~/types/stageData'
import Results_leader from '~/components/interactive_end/results_leader.vue'
import WinnersTable_leader from '~/components/interactive_end/winners_table_leader.vue'
import { useAuthStore } from '~/store/auth'

// Получаем данные через props
const props = defineProps<{
  onAnswer?: (id: string) => void
  isCheck?: boolean
  stage: string
  data: EndData
  winners: { position: number, username: string, time: number, score: number }[]
}>()

onMounted(() => {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  $queryClient.removeQueries({
    queryKey: ['interactives', auth.id],
  })
  clearAllDeviceStorage()
})
</script>

<template>
  <div class="interactive_leader_end">
    <div class="interactive_end_leader_results">
      <img id="logo_leader" src="/images/waiting/Group_7055.svg">
      <div style="height: 0px; font-size: 0.01px; color: blueviolet;">
        sd
      </div>
      <Results_leader :title="props.data.title" :participants-total="props.data.participants_total"
        :stage="props.stage" />
    </div>

    <WinnersTable_leader :winners="props.data.winners" :on-answer="onAnswer" :isCheck="props.isCheck" />
  </div>
</template>

<style>
@import url("~/assets/css/interactive_end/results_leader.scss");
@import url("~/assets/css/interactive_end/winners_table_leader.scss");
@import url("~/assets/css/interactive_end/interactive_end_leader.scss");
</style>
