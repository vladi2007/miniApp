<script setup lang="ts">
import { useMeInOrganization } from '~/composables/api/organization/useOrganizationQuery'
import { useAuthStore } from '~/store/auth'

const telegramName = useState<string | null>('userName')
const auth = useAuthStore()
console.log(telegramName)

const router = useRouter()
async function goTo(url: string) {
  showMenu.value = false
  router.push(url)
}
const orgs = ref(false)
const org_name = ref('ИРИТ РТФ')
const userId = useState('telegramUser')
const { data: org, isLoading, refetch } = useMeInOrganization({
  enabled: computed(() => auth.isAuthenticated),
},
)
const showLogout = ref(false)
const showMenu = ref(false)

import { onClickOutside } from '@vueuse/core'
import { useTemplateRef } from 'vue'
// Создаём ref для меню и кнопки
const menuBarRef = useTemplateRef('menuBar')
const menuButtonRef = useTemplateRef('menuButton')

// Закрываем меню при клике вне его
onClickOutside(menuBarRef, () => {
  showMenu.value = false
}, {
  ignore: [menuButtonRef], // Игнорируем клики по кнопке меню
})
import { useMediaQuery } from '@vueuse/core'
const isMobile = useMediaQuery('(max-width: 767px)')
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
import { useCssModule } from 'vue'
// Получаем стили
const $style = useCssModule()



const popupClass = $style.logout__popup
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
    const sheet = document.querySelector(`.${$style.logout__popup}`) as HTMLElement
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
  const sheet = document.querySelector(`.${$style.logout__popup}`) as HTMLElement

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.3s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    showLogout.value = false
    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch(showLogout, (val) => {
  document.body.classList.toggle('modal-open', val)
})
</script>

<template>
  <div :class="$style.header__fon">
    <div :class="$style.header">

      <img id="logo_header" src="/public/images/interactive_editor/logo.svg" :class="[
        $style.header__logo,
        !auth.isAuthenticated && $style.header__logo_login
      ]">
      <div :class="[
        $style.header__menu_fon,
        showMenu && $style.header__menu_fon_active
      ]" v-if="auth.isAuthenticated" @click="showMenu = !showMenu" ref="menuButton">
        <img src="/public/images/header_logo_menu.svg" :class="$style.header__menu">
      </div>

      <div :class="$style.header__menu_bar" v-if="auth.isAuthenticated && showMenu" ref="menuBar">
        <div :class="$style.header__menu_main" @click="goTo('/main')">
          <p>О нас</p>
        </div>
        <div :class="$style.header__menu_org" @click="goTo('/leader/organization_settings')">
          <p>Организация ({{ org?.organization_name }})</p>
        </div>
        <div :class="$style.header__menu_name" @click="goTo('/leader/user')">
          <p>@{{ org?.name }}</p>
        </div>
        <div :class="$style.header__menu_logout" @click="showLogout = true; showMenu = false;">
          <p style="color: #F0436C !important">Выход</p>
        </div>
      </div>
      <div :class="$style.header__nav">
        <div class="header_nav_about_us" @click="goTo('/main')">
          О нас
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_organization_settings" style="gap: 5px;">
          <div class="header_nav_organization_settings_name">
            {{ org?.organization_name }}
          </div>
          <img src="../public/images/Vector.svg">
          <!-- <div v-if="orgs" class="header_nav_item-dropdown-options" style=" z-index: 10001 !important;">
            <div class="header_nav_item-dropdown-options-header">
              Выберите организацию:
            </div>
            <div class="header_nav_item-dropdown-option" @click="org_name = 'Джойтека'">
              Джойтека
            </div>
            <div class="header_nav_item-dropdown-option" @click="org_name = 'Звезда'">
              Звезда
            </div>
            <div class="header_nav_item-dropdown-option" @click="org_name = 'ИРИТ РТФ'">
              ИРИТ РТФ
            </div>
          </div> -->
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_user" @click="goTo('/leader/user')">
          {{ org?.name }}
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_photo" @click="goTo('/leader/user')">
          <img src="../public/images/profile.svg">
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_logout" @click="showLogout = true; showMenu = false;">
          <img src="../public/images/logout.svg">
        </div>
        <div v-if="!auth.isAuthenticated" class="header_nav_login" @click="goTo('/')">
          Вход/Регистрация
        </div>
      </div>

      <div v-if="showLogout" class="logout_popup-overlay" :class="$style.logout__popup_overlay">
        <div class="logout" :class="$style.logout__popup" @click.stop @touchstart="onTouchStart"
          @touchmove="onTouchMove" @touchend="onTouchEnd">
          <div :class="$style.logout__popup_line"></div>
          <div class="logout_popup-close" @click="showLogout = false" :class="$style.logout__popup_close">
            <img src="/public/images/interactives/delete_close.svg">
          </div>
          <div class="logout_popup-header" :class="$style.logout__popup_header">
            <div class="logout_popup-header-text" :class="$style.logout__popup_header_text">
              Вы уверены, что хотите выйти из профиля?
            </div>
          </div>
          <div class="logout_popup-body" :class="$style.logout__popup_body">
            <button class="logout_popup-button cancel" @click="showLogout = false"
              :class="[$style.logout__popup_button]">
              Отменить
            </button>
            <button class="logout_popup-button confirm" @click="showLogout = false; auth.logout();"
              :class="[$style.logout__popup_button]">
              Выйти
            </button>
          </div>
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
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;

}

.header {
  display: flex;
  justify-content: space-between;
  padding: 7px 4px 0px 14px;

  @media (min-width:768px) {
    margin: 0 auto;
    padding: 10px 30px 0px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1620px;
  }


  &__fon {
    margin: 0 22px;
    position: relative;
    background-color: #853CFF;
    height: 49px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;

    @media (min-width:768px) {
      height: 71px;
      margin: 0px;
      border-radius: 0;
    }


  }

  &__logo {


    margin-top: 3px;
    position: relative;
    width: 50px;
    height: 20px;

    @media (min-width:768px) {
      position: relative;
      width: 125px;
      height: 50px;

    }

    &_login {
      margin-left: auto;

      @media (min-width:768px) {
        margin-left: 0;

      }
    }

  }

  &__menu {
    width: 21px;
    height: 14px;



    &_fon {


      width: 41px;
      height: 27px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (min-width:768px) {
        display: none;

      }

      &_active {
        background-color: #DAC4FF;
        border-radius: 30px;
      }
    }



    &_bar {
      position: absolute;
      top: 100%;
      right: 0;

      width: 210px;
      height: 150px;
      background: white;
      border-radius: 8px;
      box-shadow: 0px 1px 13.8px 0px #00000040;
      // z-index если нужно
      z-index: 1000;
      padding: 15px 13px 15px 13px;
      display: flex;
      flex-direction: column;

      @media (min-width:768px) {
        display: none;

      }

      &>div {
        width: 100%;
        height: 31px;
        display: flex;
        align-items: center;
        border-radius: 7px;
        padding: 0 7px;
        font-size: 14px;

        &:hover {
          background-color: #E0E0E0;
        }

        &>p {
          color: #1D1D1D;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

    }

  }

  &__nav {
    display: none;

    @media (min-width:768px) {
      display: flex;
      align-items: center;
      gap: 30px;
      font-size: 20px;
      color: white;
    }

    &>div {
      @media (min-width:768px) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

}

.logout {
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
      margin-top: 290px;
      border-radius: 18px;
      width: 524px;
      height: 173px;
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

    &_close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      color: #aaa;
      display: none;

      @media (min-width:768px) {

        display: block;
      }

      &>img {
        width: 16px;
        height: 16px;
      }
    }

    &_header {
      &_text {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 40px;

        @media (min-width:768px) {

          font-size: 20px;
          color: #1D1D1D;
          margin: 0 auto;
          margin-top: 24px;
          margin-left: 20px;
        }

      }
    }

    &_body {
      margin-top: 190px;
      display: flex;
      flex-direction: column-reverse;
      padding: 0 22px;
      gap: 10px;

      @media (min-width:768px) {

        margin-left: 218px;
        display: flex;
        flex-direction: row;
        margin-top: 59px;
      }

    }

    &_button {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;

      @media (min-width:768px) {

        width: 138px;
        height: 41px;
        border-radius: 8px;
        font-family: "Lato", sans-serif;
        font-size: 20px;
      }

      &:nth-child(1) {
        background-color: white;
        border: 1.5px solid #7D7D7D;
        color: #7D7D7D;

        @media (min-width:768px) {

          background-color: white;
          color: #7D7D7D;
          border: none;
        }


      }


      &:nth-child(2) {
        background-color: #F0436C;
        border: 1.5px solid #F0436C;
        color: #FFFFFF;

        @media (min-width:768px) {

          margin-left: 10px;
          background-color: white;
          color: #F0436C;
          border: 1.5px solid #F0436C;
          border-color: #F0436C;
        }


      }


    }
  }
}
</style>
