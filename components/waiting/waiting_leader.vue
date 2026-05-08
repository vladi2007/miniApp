<script setup lang="ts">
// imports
import type { WaitingData, Pause } from '~/store/types/stageData'
import Active from '~/components/waiting/active_users.vue'
import Description from '~/components/waiting/description.vue'
import Links from '~/components/waiting/links.vue'
import mobile from '../moderation/mobile.vue'
// composables
import { UseGoBack } from '~/composables/go_back'
import { UseWaitingLeader } from '~/composables/interactive/interactive_leader/waiting_leader/waiting_leader'

// data from backend
const props = defineProps<{
  stage: string
  data: WaitingData
  context: string
  onStatus: (status: string) => void
  pause: Pause
  code: string
}>()
const { router, go_Back } = UseGoBack()
const { morePause, startBeforePause } = UseWaitingLeader(props.pause.timer_n, router, props.onStatus)
const showMobileModeration = ref(false)
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
const isMobile = useMediaQuery('(max-width: 1280px)')
function closeMobileModeration() {
  showMobileModeration.value = false
}
</script>

<template>
  <div :class="$style.waiting">
    <div :class="$style.waiting__links">
      <div v-if="context === 'leader'" :class="$style.waiting__buttons">
        <button @click="go_Back" :class="$style.waiting__buttons_back">
          Вернуться
        </button>
        <button @click="onStatus('going')" :class="$style.waiting__buttons_start">
          Запустить
        </button>
      </div>
      <Links :code="props.data.code" :id="props.code" />
    </div>
    <div :class="$style.waiting__desc">
      <div :class="$style.waiting__desc_block">
        <div :class="$style.waiting__logo">
          <div>
            <img id="logo" src="/images/waiting/Group_7055.svg">
          </div>
          <img v-if="!isMobile" id='open_moderation' src="/images/waiting/open_moderation.svg"
            @click="openModeration(code)" />
          <img v-else id='open_moderation' src="/images/waiting/open_moderation.svg" @click="openModeration(code)">
        </div>
        <Description :title="props.data?.title || ''" :description="props.data?.description || ''" :context="context"
          :go-back="go_Back" :on-status="props.onStatus" />

        <div>

          <Active :class="$style.waiting__desc_countMobile" :count="props.data.participants_active"
            :context="context" />
        </div>
      </div>

      <Active :class="$style.waiting__desc_count" :count="props.data.participants_active" :context="context" />
    </div>

    <div v-if="props.pause.state === 'timer_n'">
      <div>
        <div>
          Вы слишком долго бездействовали, запустите интерактив или через
          {{ props.pause.timer_n }}
          секунд он будет закрыт
        </div>
        <div>
          <button @click="startBeforePause()">
            Запустить
            интерактив
          </button>
          <button @click="morePause()">
            Еще подождать
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showMobileModeration && isMobile" :class="$style.waiting__mobile">
    <mobile :interactive-id="code" @close="closeMobileModeration" />
  </div>
</template>

<style module lang="scss">
* {
  font-family: 'Lato', sans-serif;
  line-height: 100%;
  letter-spacing: 1%;
  vertical-align: middle;

}

.waiting {
  padding: 0 22px;
  display: flex;
  flex-direction: column-reverse;
  padding-bottom: 100px;

  @media (min-width:1280px) {
    padding: 0;
    flex-direction: row;
    gap: calc(8/1280*100dvw);
    margin-left: calc(40/1280*100dvw);
    ;
  }

  &__mobile {
    position: fixed;
    inset: 0;
    z-index: 9999;

    background: white;

    overflow-y: auto;
  }

  &__desc {

    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;

    &_block {
      padding: 0;
      margin: 0;
      height: auto;
      background-color: #853CFF;
      border-bottom-left-radius: 24px;
      border-bottom-right-radius: 24px;
      margin: 0 7px;

      @media (min-width:1280px) {
        padding: 0;
        margin: 0;
        padding: 0;
        margin: 0;
        min-height: calc(491/832*100dvh);
        ;
        height: auto;
        width: calc(749/1280*100dvw);
      }
    }


    &_count {
      display: none;

      @media (min-width:1280px) {
        display: flex;
      }
    }

    &_countMobile {
      display: flex;
      margin-bottom: 25px;

      @media (min-width:1280px) {
        display: none;
      }
    }
  }

  &__logo {

    margin-top: 10px;

    padding: 0px 7px 0px 7px;
    display: flex;
    height: 20px;
    align-items: center;

    justify-content: space-between;

    @media (min-width:1280px) {
      margin-top: calc(12/832*100dvh);
      justify-content: end;
      margin-right: calc(0/1280*100dvw);
      gap: calc(10/1280*100dvw);
      ;
      height: calc(50/832*100dvh);
      padding: 0;
    }

    &>div>img {
      width: 50px;
      height: 20px;

      @media (min-width:1280px) {

        height: calc(50/832*100dvh);
        width: calc(100/1280*100dvw);
        display: flex;
        align-items: center;

      }
    }

    &>img {
      width: 18px;
      height: 12px;

      @media (min-width:1280px) {
        height: calc(18/832*100dvh);
        width: calc(23/1280*100dvw);
        margin-right: calc(40/1280*100dvw);
        ;
      }
    }
  }



  &__links {
    margin-top: 30px;
    width: 100%;

    @media (min-width:1280px) {
      height: calc(636/832*100dvh);
      width: calc(483/1280*100dvw);
      margin: 0;

    }
  }

  &__buttons {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;

    @media (min-width:1280px) {
      display: none;
    }

    &>button {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;
    }

    &_back {
      color: #F0436C;
      border: 1.5px solid #F0436C;
      background-color: white;
    }

    &_start {
      color: white;
      border: 1.5px solid #6AB23D;
      background-color: #6AB23D;
    }
  }
}
</style>
