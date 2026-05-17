<script setup lang="ts">
import Settings from '~/components/interactive_editor/settings.vue'
import { onMounted, ref } from 'vue'

const settings = ref(null)
const route = useRouter()
const router = useRoute()
const header = computed(() => route.params.mode === 'edit' ? 'Сохранить изменения перед выходом?' : '')
async function confirmBack(save) {
  if (save) {
    const success = await settings.value.handleSave()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/new_interactives')
    }
    else { showConfirmPopup.value = false }
  }
  else {
    showConfirmPopup.value = false
    route.push('/leader/new_interactives')
  }
}
const showConfirmPopup = ref(false)

const isCheckMode = ref(false)

onMounted(() => {
  // 👇 читаем то что передали в router.push state
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
  }
})
function handleBackClick() {
  if (
    router.params.mode === 'edit'
    && settings.value
    && !settings.value.isFormChanged() || isCheckMode.value === true
  ) {
    route.push('/leader/new_interactives')
    return
  }
  showConfirmPopup.value = true


}
const isMobile = useMediaQuery('(max-width: 767px)')
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const $style = useCssModule()
function onTouchStart(e: TouchEvent) {
  if (!isMobile.value) return
  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  if (diff > 0) {
    e.preventDefault()
    const sheet = document.querySelector(`.${$style.edit__popup}`) as HTMLElement
    if (sheet) {
      sheet.style.transform = `translateY(${diff}px)`
      sheet.style.transition = 'none'
    }
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return
  isDragging.value = false

  const diff = currentY.value - startY.value
  const sheet = document.querySelector(`.${$style.edit__popup}`) as HTMLElement

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    showConfirmPopup.value = false
    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch([showConfirmPopup,], (val) => {
  document.body.classList.toggle('modal-open', showConfirmPopup.value)
})
</script>

<template>
  <div :class="$style.edit">
    <div :class="$style.edit__header">
      <div>
        <img id="interactive_editor_logo" src="/public/images/interactive_editor/logo.svg">
        <div @click="handleBackClick()">
          <img id="interactive_editor_back" src="/public/images/interactive_editor/Vector.svg">
          <div>
            Управление интерактивами
          </div>
        </div>
      </div>

    </div>
    <Settings ref="settings" :confirm-back="handleBackClick" />
    <div v-if="showConfirmPopup" :class="$style.edit__popup_overlay" @click.stop @touchstart="onTouchStart"
      @touchmove="onTouchMove" @touchend="onTouchEnd">
      <div @click="showConfirmPopup = false" :class="[$style.edit__popup]">
        <div :class="$style.edit__popup_line"></div>
        <img src="/public/images/interactives/delete_close.svg">
        <div v-if="router.params.mode !== 'edit'" :class="$style.edit__popup_text">
          Сохранить изменения перед выходом?
        </div>
        <div v-if="router.params.mode === 'edit'" :class="$style.edit__popup_text">
          Сохранить настройки интерактива перед<br></br> выходом из редактирования?
        </div>
        <div :class="$style.edit__popup_buttons">
          <button @click="confirmBack(false)"
            :class="[$style.edit__popup_btn, $style.edit__popup_btn_first, $style.edit__popup_btn_first_unsave]">
            {{ router.params.mode !== "edit" ? "Не сохранять" : "Удалить" }}
          </button>
          <button @click="confirmBack(true)"
            :class="[$style.edit__popup_btn, $style.edit__popup_btn_second, $style.edit__popup_btn_second_change]">
            Сохранить
          </button>
          <!-- <button @click="confirmBack(false)" class="interactive_edit_popup-btn cancel">Нет</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;

}

.edit {
  min-height: 100dvh;
  background-color: #F7F2FF;
  padding-bottom: 100px;

  @media (min-width:1056px) {
    background-color: white
  }

  &__header {
    background-color: #853CFF;
    height: 49px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
    margin: 0 22px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;

    @media (min-width:1056px) {
      padding: 0 20px;
      margin: 0;
      height: 71px;
      border-radius: 0;

    }


    &>div {


      width: 100%;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px 0px 16px;

      @media (min-width:1056px) {
        padding: 0 20px;
        margin: 0 auto;
        max-width: 1234px;
      }

      @media (min-width:1280px) {
        padding: 0px;
        margin: 0 auto;
        max-width: 1234px;

      }


    }

    &>div>img {
      width: 50px;
      height: 20px;

      @media (min-width:1056px) {
        width: 125px;
        height: 50px;
        margin-right: 17px;
      }
    }

    &>div>div {




      @media (min-width:1056px) {
        display: flex;
        gap: 5px;
        margin-top: auto;
        margin-bottom: 5px;
        cursor: pointer;
      }

      &>div {
        display: none;

        @media (min-width:1056px) {
          margin-top: auto;
          color: #FFFFFF;
          font-size: 20px;
          display: block;
        }
      }
    }
  }

  &__popup {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    background: white;
    height: 458px;
    margin-top: auto;
    width: 100%;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    touch-action: pan-y; // Разрешаем только вертикальный скролл
    transition: transform 1s ease;

    @media (min-width:768px) {
      width: 524px;
      height: 173px;
      margin-top: 290px;
      border-radius: 18px;
    }

    &_delete {
      @media (min-width:768px) {
        height: 233px;
      }
    }

    &_add {
      @media (min-width:768px) {
        height: 266px;
      }
    }

    &>img {
      display: none;

      @media (min-width:768px) {
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        top: 20px;
        right: 20px;
      }
    }

    &_overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #00000052;

      z-index: 22222999;

      display: flex;
      justify-content: center;
    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:768px) {
        display: none;

      }
    }

    &_text {
      font-size: 14px;
      padding: 0 22px;
      margin-top: 40px;
      font-weight: 500;


      @media (min-width:768px) {
        font-size: 20px;
        padding: 0 22px;
        margin-top: 29px;
        line-height: 32px;
        font-weight: 700;
        vertical-align: middle;
      }

      &>span {
        @media (min-width:768px) {
          padding: 0;
        }
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;

        @media (min-width:768px) {
          font-size: 16px;

        }
      }
    }

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 191px;

      @media (min-width:768px) {
        margin-top: 19px;
        display: flex;
        flex-direction: row;
        margin-left: 186px;
      }

      &_delete {
        @media (min-width:768px) {
          margin-top: 56px;
        }
      }
    }



    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:768px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_first {
        @media (min-width:768px) {
          width: 138px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:768px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_unsave {
          background-color: white;
          border: 1px solid #F0436C;
          color: #F0436C;

          &:hover {
            @media (min-width:768px) {
              background-color: #F0436C;
              color: white;
            }
          }
        }



      }

      &_second {
        @media (min-width:768px) {
          width: 150px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:768px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:768px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_change {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:768px) {
              background-color: #559130;
            }
          }
        }
      }
    }
  }
}
</style>
