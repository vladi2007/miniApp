<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const props = defineProps<{
  goTo: (url: string, active: string) => void
  active: string
}>()
const auth = useAuthStore()
</script>

<template>
  <div v-if="!auth.isAuthenticated" :class="[$style.header, $style.header__login]">
    <div>
      <div :class="$style.header__interactives">
        <div @click="goTo('/', 'login')" :class="active == 'login' ? $style.header_active : ''">
          Вход/регистрация
        </div>
        <div @click="goTo('/main', 'main')" :class="active == 'main' ? $style.header_active : ''">
          О нас
        </div>

      </div>
    </div>
  </div>

  <div v-if="auth.isAuthenticated" :class="$style.header">
    <div :class="$style.header__interactives">
      <div @click="goTo('/leader/new_interactives', 'interactives')"
        :class="active == 'interactives' ? $style.header_active : ''">
        Интерактивы
      </div>
      <div @click="goTo('/leader/history', 'reports')" :class="active === 'reports' ? $style.header_active : ''">
        Отчет
      </div>
      <div @click="goTo('/leader/broadcasts', 'broadcasts')"
        :class="active === 'broadcasts' ? $style.header_active : ''">
        Рассылка
      </div>
    </div>
    <div :class="$style.header__organization">

      <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"
        :class="$style.header__organization_settings_img"
        @click="goTo('/leader/organization_settings', 'organization_settings')">
        <path
          d="M5.7001 0C7.51614 0 8.98704 1.5042 8.98704 3.36134C8.98704 5.21849 7.51614 6.72269 5.7001 6.72269C3.88407 6.72269 2.41316 5.21849 2.41316 3.36134C2.41316 1.5042 3.88407 0 5.7001 0ZM4.88385 8.29132H6.55197C6.19862 9.04202 6.33832 9.92157 6.86697 10.5182C6.31367 11.1429 6.18767 12.0812 6.60949 12.8543L7.22579 13.986C7.25044 14.0308 7.27784 14.0756 7.30523 14.1176H0.813518C0.364303 14.1176 0 13.7451 0 13.2857C0 10.5266 2.18582 8.29132 4.88385 8.29132ZM10.5237 6.71148C10.5237 6.33894 10.8168 6.03922 11.1811 6.03922H12.4959C12.8602 6.03922 13.1532 6.33894 13.1532 6.71148V6.88235C13.1532 7.41177 13.8134 7.80112 14.2626 7.53782L14.3995 7.45658C14.7173 7.26891 15.1254 7.38375 15.3034 7.71148L15.917 8.83753C16.0868 9.15126 15.9882 9.54342 15.6924 9.73389L15.5637 9.81513C15.1199 10.098 15.1199 10.9328 15.5637 11.2185L15.6897 11.2997C15.9855 11.4902 16.0868 11.8824 15.917 12.1961L15.3007 13.3277C15.1227 13.6555 14.7145 13.7731 14.3968 13.5826L14.2626 13.5014C13.8134 13.2353 13.1532 13.6275 13.1532 14.1569V14.3277C13.1532 14.7003 12.8602 15 12.4959 15H11.1811C10.8168 15 10.5237 14.7003 10.5237 14.3277V14.1625C10.5237 13.6303 9.86082 13.2381 9.40887 13.5042L9.27739 13.5826C8.95965 13.7703 8.55426 13.6555 8.37348 13.3277L7.75444 12.1961C7.58462 11.8824 7.68322 11.4874 7.98179 11.2969L8.10231 11.2213C8.54879 10.9384 8.54879 10.098 8.10231 9.81513L7.97905 9.7367C7.68049 9.54622 7.58188 9.15126 7.7517 8.83753L8.368 7.70868C8.54605 7.38095 8.95417 7.26611 9.26917 7.45378L9.40065 7.53221C9.85261 7.79832 10.5155 7.40616 10.5155 6.87395V6.70868L10.5237 6.71148ZM13.2601 10.5266C13.2601 9.72269 12.6219 9.07003 11.8357 9.07003C11.0496 9.07003 10.4114 9.72269 10.4114 10.5266C10.4114 11.3305 11.0496 11.9832 11.8357 11.9832C12.6219 11.9832 13.2601 11.3305 13.2601 10.5266Z"
          :fill="active === 'organization_settings' ? '#853CFF' : '#7D7D7D'" />
      </svg>

      <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg"
        :class="$style.header__organization_parts_img" @click="goTo('/leader/users', 'users')">
        <path
          d="M12 0C12.9283 0 13.8185 0.368749 14.4749 1.02513C15.1313 1.6815 15.5 2.57174 15.5 3.5C15.5 4.42826 15.1313 5.3185 14.4749 5.97487C13.8185 6.63125 12.9283 7 12 7C11.0717 7 10.1815 6.63125 9.52513 5.97487C8.86875 5.3185 8.5 4.42826 8.5 3.5C8.5 2.57174 8.86875 1.6815 9.52513 1.02513C10.1815 0.368749 11.0717 0 12 0ZM5 2.5C5.56 2.5 6.08 2.65 6.53 2.92C6.38 4.35 6.8 5.77 7.66 6.88C7.16 7.84 6.16 8.5 5 8.5C4.20435 8.5 3.44129 8.18393 2.87868 7.62132C2.31607 7.05871 2 6.29565 2 5.5C2 4.70435 2.31607 3.94129 2.87868 3.37868C3.44129 2.81607 4.20435 2.5 5 2.5ZM19 2.5C19.7956 2.5 20.5587 2.81607 21.1213 3.37868C21.6839 3.94129 22 4.70435 22 5.5C22 6.29565 21.6839 7.05871 21.1213 7.62132C20.5587 8.18393 19.7956 8.5 19 8.5C17.84 8.5 16.84 7.84 16.34 6.88C17.2115 5.75423 17.6161 4.33616 17.47 2.92C17.92 2.65 18.44 2.5 19 2.5ZM5.5 12.75C5.5 10.68 8.41 9 12 9C15.59 9 18.5 10.68 18.5 12.75V14.5H5.5V12.75ZM0 14.5V13C0 11.61 1.89 10.44 4.45 10.1C3.86 10.78 3.5 11.72 3.5 12.75V14.5H0ZM24 14.5H20.5V12.75C20.5 11.72 20.14 10.78 19.55 10.1C22.11 10.44 24 11.61 24 13V14.5Z"
          :fill="active === 'users' ? '#853CFF' : '#7D7D7D'" />
      </svg>

      <div @click="goTo('/leader/users', 'users')"
        :class="[$style.header__organization_parts, active === 'users' ? $style.header_active : $style.header__organization_parts]">
        Пользователи
      </div>
      <div @click=" goTo('/leader/organization_settings', 'organization_settings')"
        :class="[$style.header__organization_parts, active === 'organization_settings' ? $style.header_active : $style.header__organization_parts]">
        Настройка организации
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

.header {

  margin: 0 22px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  height: 37px;

  @media (min-width:768px) {

    font-size: 20px;
    height: 26px;
    padding: 0 22px;
    margin: 0 auto;
    margin-top: 34px;
    max-width: 1056px;
  }

  @media (min-width:1280px) {
    max-width: 1056px;
    margin: 0 auto;
    margin-top: 34px;
  }

  &__login {
    @media (min-width:768px) {
      display: none;
    }
  }

  &_active {
    border-radius: 30px;
    color: #853CFF;
    background-color: #853CFF4D;

    @media (min-width:768px) {
      background-color: white;
      color: #1D1D1D;
      border-radius: 0px;
      border-bottom: 1px solid #853CFF !important;
    }
  }

  &__interactives {
    height: 37px;
    display: flex;
    align-items: center;
    border: 1px solid #E0E0E0;
    border-radius: 20px;

    padding: 0 5px;
    color: #A9A9A9;

    @media (min-width:768px) {
      padding: 0;
      border: none;
      height: 26px;
      width: 315px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    &>div {
      padding: 5px;

      @media (min-width:768px) {
        padding: 0;
        box-sizing: border-box;
        border-bottom: 1px solid white;
      }
    }


  }

  &__organization {
    height: 37px;

    display: flex;
    align-items: center;
    gap: 10px;
    margin-right: 10px;
    color: #A9A9A9;

    &>div {

      @media (min-width:768px) {
        padding: 0;
        box-sizing: border-box;
        border-bottom: 1px solid white;
      }
    }

    &_settings {
      display: none;

      @media (min-width:768px) {
        display: block;
      }

      &_img {
        width: 16px;
        height: 15px;

        @media (min-width:768px) {
          display: none;
        }
      }
    }

    &_parts {
      display: none;

      @media (min-width:768px) {
        display: block;
      }

      &_img {
        width: 24px;
        height: 14.5px;

        @media (min-width:768px) {
          display: none;
        }
      }
    }


  }
}
</style>
