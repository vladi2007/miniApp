<script setup lang="ts">
import type { EndData, EndWinners } from '~/types/stageData'
import Results_leader from '~/components/interactive_end/results_leader.vue'
import WinnersTable_leader from '~/components/interactive_end/winners_table_leader.vue'
import { useAuthStore } from '~/store/auth'
import mobile from '../moderation/mobile.vue'
// Получаем данные через props
const props = defineProps<{
  onAnswer?: (id: string) => void
  isCheck?: boolean
  stage: string
  data: EndData
  winners: { position: number, username: string, time: number, score: number }[]
  code?: string
}>()

onMounted(() => {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  $queryClient.removeQueries({
    queryKey: ['interactives', auth.id],
  })
  clearAllDeviceStorage()
})
const isMobile = useMediaQuery('(max-width: 1280px)')
async function openModeration(id: string) {
  // Проверяем, есть ли id
  if (!id) return;
  // если мобильный экран — открываем компонент
  if (isMobile.value) {
    showMobileModeration.value = true
    return
  }
  // Формируем URL (подставляем id)
  const url = `/leader/moderation/${id}`;

  // Открываем в новой вкладке
  window.open(url, '_blank');
}
const showMobileModeration = ref(false);
function closeMobileModeration() {
  showMobileModeration.value = false
}
const router = useRouter()
function goToMainMenu() {
  router.push({ path: '/leader/new_interactives' })
}
</script>

<template>
  <div :class="$style.end">
    <div :class="$style.end__header">
      <div :class="$style.end__moderation">
        <img :class="$style.end__header_logo" id="logo_leader" src="/images/waiting/Group_7055.svg">
        <img :class="$style.end__header_moderation" v-if="props.code" id='open_moderation'
          src="/images/waiting/open_moderation.svg" @click="openModeration(props.code)" />
      </div>

      <Results_leader :title="props.data.title" :participants-total="props.data.participants_total"
        :stage="props.stage" />
      <img @click="goToMainMenu" :class="$style.end__header_home" src="/public/images/waiting/home.svg" alt="">
    </div>

    <WinnersTable_leader :winners="props.data.winners" :on-answer="onAnswer" :isCheck="props.isCheck" />
  </div>
  <div v-if="showMobileModeration && isMobile && props.code" :class="$style.end__mobile">
    <mobile :interactive-id="code" @close="closeMobileModeration" />
  </div>
</template>

<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.end {
  padding: 0 10px;

  &__mobile {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: white;

    overflow-y: auto;
  }

  @media (min-width:1280px) {
    padding: 0 calc(30/1280*100dvw);
    ;
  }

  &__header {
    height: 176px;
    background-color: #853CFF;
    margin: 0 19px;
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
    position: relative;

    @media (min-width:1280px) {
      min-height: calc(248/832*100dvh);
      margin: 0;
    }

    &_logo {
      width: 50px;
      height: 20px;

      @media (min-width:1280px) {
        width: calc(120/1280*100dvw);

        height: calc(50/832*100dvh);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: calc(10/1280*100dvw);
        ;
        margin-top: calc(12/832*100dvh);
      }
    }

    &_home {
      width: 54px;
      height: 54px;
      position: absolute;
      right: -22px;
      bottom: -22px;

      @media (min-width:1280px) {
        display: none
      }
    }

    &_moderation {
      width: 18px;
      height: 12px;
    }
  }

  &__moderation {
    padding: 10px 7px;
    box-sizing: border-box;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width:1280px) {
      padding: 0;
      height: calc(50/832*100dvh);
    }
  }
}
</style>
