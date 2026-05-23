<script setup lang="ts">
const emit = defineEmits(['update:score', 'updateCurrentQuestionIndex', 'closeSave'])
const props = defineProps<{
  showSavePopup: boolean
  handleSave: () => void

}>()
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
    const sheet = document.querySelector(`.${$style.popup}`) as HTMLElement
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
  const sheet = document.querySelector(`.${$style.popup}`) as HTMLElement

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    emit('closeSave')
    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch([props.showSavePopup,], (val) => {
  document.body.classList.toggle('modal-open', props.showSavePopup)
})
</script>

<template>
  <div v-if="showSavePopup" :class="[$style.popup_overlay]">
    <div :class="[$style.popup, $style.popup_delete]" @click.stop @touchstart="onTouchStart" @touchmove="onTouchMove"
      @touchend="onTouchEnd">
      <div :class="$style.popup_line"></div>
      <div :class="$style.popup_text">
        Вы уверены, что хотите сохранить интерактив?
      </div>
      <div :class="$style.popup_text_">
        Данный интерактив можно будет найти в общем списке.
        <br></br>Вопросы и данные интерактива будут сохранены.
      </div>
      <div :class="[$style.popup_buttons, $style.popup_buttons_delete]">
        <button :class="[$style.popup_btn, $style.popup_btn_first, $style.popup_btn_first_change]"
          @click="emit('closeSave')">
          Отменить
        </button>
        <button :class="[$style.popup_btn, $style.popup_btn_second, $style.popup_btn_second_change]"
          @click="handleSave">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>
<style module lang="scss">
.popup {
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
    margin-top: 148px;

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

      &_unsave {
        background-color: white;
        border: 1px solid #F0436C;
        color: #F0436C;

        &:hover {
          @media (min-width:768px) {
            background-color: #AA77FF;
            color: white;
          }
        }
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

      &_change {
        background-color: white;
        border: 1px solid #853CFF;
        color: #853CFF;

        &:hover {
          @media (min-width:768px) {
            background-color: #AA77FF;
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
</style>
