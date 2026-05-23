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

    <div :class="$style.waiting__popup" v-if="props.pause.state == 'timer_n'">
      <div :class="[$style.waiting__popup_overlay]">
        <div :class="$style.waiting__popup_line"></div>
        <div :class="$style.waiting__popup_text">
          Вы слишком долго бездействовали, запустите интерактив или через
          {{ props.pause.timer_n }}
          секунд он будет закрыт
        </div>
        <div :class="[$style.waiting__popup_buttons, $style.waiting__popup_buttons_delete]">

          <button
            :class="[$style.waiting__popup_btn, $style.waiting__popup_btn_first, $style.waiting__popup_btn_first_start]"
            @click="morePause()">
            Еще подождать
          </button>
          <button
            :class="[$style.waiting__popup_btn, $style.waiting__popup_btn_second, $style.waiting__popup_btn_second_start]"
            @click="startBeforePause()">
            Запустить

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

  &__popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #00000052;

    z-index: 22222999;

    display: flex;
    justify-content: center;

    &_more {
      height: 317px !important;
    }

    &_overlay {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      background: white;
      height: 458px;
      margin: 0px;
      width: 100%;
      margin-top: auto;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      touch-action: pan-y; // Разрешаем только вертикальный скролл
      transition: transform 1s ease;

      @media (min-width:1280px) {
        height: 233px;
        margin-top: 273px;
        width: 524px;
        border-radius: 18px;
      }

      &>img {
        display: none;

        @media (min-width:1280px) {
          position: absolute;
          display: block;
          top: 16px;
          right: 16px;
          width: 20px;
          height: 20px;
        }
      }

      &_dubl {
        @media (min-width:1280px) {
          height: 270px !important;
        }

      }

      &_edit {
        @media (min-width:1280px) {
          height: 173px !important;
        }

      }

    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:1280px) {
        display: none;

      }
    }

    &_text {
      color: #1D1D1D;
      font-size: 14px;
      font-weight: 500;
      margin-top: 40px;
      padding: 0 22px;

      @media (min-width:1280px) {
        font-size: 20px;
        font-weight: 700;
        margin-top: 24px;
      }

      &_report {
        text-align: center;
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;
        line-height: 120%;
        font-weight: 400;
        letter-spacing: 1%;

        @media (min-width:1280px) {
          font-size: 16px;
          margin-top: 19px;
        }
      }
    }

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 148px;

      @media (min-width:1280px) {
        position: absolute;
        right: 0;
        position: absolute;
        bottom: 20px;
        display: flex;
        flex-direction: row;
      }

      &_delete {
        @media (min-width:1280px) {
          margin-top: 56px;
        }
      }

      &_report {
        margin-top: 121px;

        @media (min-width:1280px) {
          margin: 0;
          position: absolute;
          bottom: 20px;
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
          right: 62px;

        }

        &>button {

          @media (min-width:1280px) {
            width: 360px;


          }
        }
      }

      &_edit {
        @media (min-width:1280px) {
          margin-top: 25px;
        }
      }

    }

    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:1280px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_first {
        @media (min-width:1280px) {
          width: 178px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:1280px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:1280px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_start {
          background-color: white;
          border: 1px solid #853CFF;
          color: #853CFF;
          white-space: nowrap;

          &:hover {
            @media (min-width:1280px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

        &_report {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;

          &:hover {
            @media (min-width:1280px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

      }

      &_second {
        @media (min-width:1280px) {
          width: 138px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:1280px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:1280px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_start {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:1280px) {
              background-color: #559130;
            }
          }
        }
      }

      &_third {
        @media (min-width:1280px) {
          width: 138px;
        }

        &_start {
          background-color: #853CFF;
          color: white;
          border: 1px solid #853CFF;

          &:hover {

            @media (min-width:1280px) {
              background-color: #AA77FF;
            }
          }
        }
      }
    }

    &_block {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 0px;
      font-size: 14px;
      font-weight: 400;
      color: #1D1D1D;

      &_conducted {
        margin-top: 11px;
        padding-top: 11px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 22px; // Отступ слева
          right: 22px; // Отступ справа
          height: 1px;
          background-color: #1D1D1D1D;
        }
      }
    }

    &_func {
      height: 39px;
      display: flex;
      align-items: center;
      padding: 0px 22px 0px 18px;

      &:hover {
        background-color: #E0E0E0;
      }

      img:first-child {
        width: 24px;
        height: 24px;
      }

      img:last-child {
        margin-left: auto; // Прижимает стрелку к правому краю
      }

      &>div {
        margin-left: 6px;
      }
    }



    &_div {
      height: 1px;
      margin-top: 11px;
      padding: 0 22px;
    }

    &_report {
      margin-top: 19px;
      padding: 0 22px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      font-size: 14px;

    }

    &_option {
      display: flex;
      align-items: center;
      gap: 5px;

      &>img {
        width: 17px;
        height: 17px;
      }
    }
  }

}
</style>
