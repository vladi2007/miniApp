<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useMeInOrganization } from '~/composables/api/organization/useOrganizationQuery'
import { useAuthStore } from '~/store/auth'

const telegramName = useState<string | null>('userName')
const auth = useAuthStore()
const userPhoto = useState<string>('userPhoto')
console.log(telegramName)

const router = useRouter()
async function goTo(url: string) {
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
</script>

<template>
  <div class="header_fon">
    <div class="header">
      <img id="logo_header" src="/public/images/interactive_editor/logo.svg">
      <div class="header_nav">
        <div class="header_nav_about_us" @click="goTo('/main')">
          О нас
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_organization_settings" @click="orgs = !orgs">
          <div class="header_nav_organization_settings_name">
            {{ org?.organization_name }}
          </div>
          <img src="../public/images/Vector.svg">
          <div v-if="orgs" class="header_nav_item-dropdown-options" style=" z-index: 10001 !important;">
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
          </div>
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_user" @click="goTo('/leader/user')">
          {{ org?.name }}
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_photo" @click="goTo('/leader/user')">
          <img src="../public/images/profile.svg">
        </div>
        <div v-if="auth.isAuthenticated" class="header_nav_logout" @click="showLogout = true">
          <img src="../public/images/logout.svg">
        </div>
        <div v-if="!auth.isAuthenticated" class="header_nav_login" @click="goTo('/')">
          Вход/Регистрация
        </div>
      </div>
    </div>
    <div v-if="showLogout" class="logout_popup-overlay">
      <div class="logout_popup">
        <div class="logout_popup-close" @click="showLogout = false">
          <img src="/public/images/interactives/delete_close.svg">
        </div>
        <div class="logout_popup-header">
          <div class="logout_popup-header-text">
            Вы уверены, что хотите выйти из профиля?
          </div>
        </div>
        <div class="logout_popup-body">
          <button class="logout_popup-button cancel" @click="showLogout = false">
            Отменить
          </button>
          <button class="logout_popup-button confirm" @click="showLogout = false; auth.logout();">
            Выйти
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media (max-width:1918px),
(max-height:1078px) {

  .header_fon {
    width: 100dvw;
    height: calc((71 / 832) * 100dvh);
    background-color: #853CFF;
    display: flex;
  }

  .header {
    width: calc((1224/1280) * 100dvw);
    height: calc((71 / 832) * 100dvh);
    display: flex;
    align-items: center;

    margin: 0 auto;
  }

  #logo_header {
    width: calc((123/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
  }

  .header_nav {
    display: flex;
    gap: calc((30/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
    margin-left: auto;
    align-items: center;
  }

  .header_nav>div {
    font-family: "Lato", sans-serif;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    font-style: Medium;
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: #FFFFFF;
    cursor: pointer;

  }

  .header_nav_organization_settings>img {
    width: calc((16/1280) * 100dvw);
    height: calc((9 / 832) * 100dvh);
    margin-left: calc((5/1280) * 100dvw);
  }

  .header_nav_photo {
    width: calc((50/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
  }

  .header_nav_photo>img {
    width: calc((50/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
    border-radius: 50%;
    object-fit: cover;
  }

  .header_nav_logout {
    width: calc((38 / 1280) * 100dvw);
    height: calc((38 / 832) * 100dvh);
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .header_nav_logout>img {
    width: calc((38 / 1280) * 100dvw);
    height: calc((38 / 832) * 100dvh);
  }

  .header_nav_item-dropdown-options {
    position: absolute;
    top: calc(100% + calc(32/832)*100dvh);
    box-shadow: 0px 1px 13.8px 0px #00000025;
    width: calc((318 / 1280) * 100dvw);
    height: calc((206 / 832) * 100dvh);
    border-radius: calc((14/832*100dvh));
    left: calc((-11 / 1280) * 100dvw);
    background: white;
    z-index: 665455;

  }

  .header_nav_item-dropdown-options-header {
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
    white-space: nowrap;
    font-weight: 600;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    width: calc((306/1280) * 100dvw);
    height: calc((34 / 832) * 100dvh);
    padding-left: calc((5/1280) * 100dvw);
    margin-top: calc((17 / 832) * 100dvh)
  }

  .header_nav_item-dropdown-option {
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
    white-space: nowrap;
    font-weight: 400;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    width: calc((306/1280) * 100dvw);
    height: calc((34 / 832) * 100dvh);
    padding-left: calc((5/1280) * 100dvw);
    margin-top: calc((12 / 832) * 100dvh)
  }

  .header_nav_item-dropdown-option:hover {
    border-radius: calc(7/832*100dvh);
    background-color: #DFDFDF !important;
  }

  .logout_popup-overlay {
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

  .logout_popup {
    margin-top: calc((290/832)*100dvh);
    background: white;
    border-radius: calc((18/832)*100dvh);
    width: calc((524/1280)*100dvw);
    height: calc((173/832)*100dvh);

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    position: relative;
  }

  .logout_popup-close {
    position: absolute;
    top: calc((20/832)*100dvh);
    right: calc((20/1280)*100dvw);
    width: calc((16/1280)*100dvw);
    height: calc((16/832)*100dvh);
    cursor: pointer;
    color: #aaa;
  }

  .logout_popup-close>img {
    width: calc((16/1280)*100dvw);
    height: calc((16/832)*100dvh);
  }

  .logout_popup-header-text {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
    margin: 0 auto;
    margin-top: calc((24/832)*100dvh);
    margin-left: calc((20/1280)*100dvw);
    ;
  }

  .logout_popup-header-text_ {
    margin-left: calc((20/1280)*100dvw);
    ;
    font-family: "Lato", sans-serif;
    margin-top: calc((19/832)*100dvh);
    color: #7D7D7D;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;

  }

  .logout_popup-body {
    margin-left: calc((218/1280)*100dvw);
    ;
    display: flex;
    margin-top: calc((59/832)*100dvh);

  }

  .logout_popup-button {
    width: calc((138/1280)*100dvw) !important;
    height: calc((41/832)*100dvh);
    border-radius: 8px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
    line-height: 120%;
    letter-spacing: 1%;
    text-align: center;
    vertical-align: middle;

  }

  .logout_popup-button:nth-child(1) {
    background-color: white;
    color: #7D7D7D;
    border: none;
    ;
  }

  .logout_popup-button:nth-child(1):hover {
    color: #1D1D1D;
    border: calc((1.5/832)*100dvh) solid #1D1D1D;

  }

  .logout_popup-button:nth-child(2) {
    margin-left: calc((10/1280)*100dvw);
    ;
    background-color: white;
    color: #F0436C;
    border: calc((1.5/832)*100dvh) solid #F0436C;
    border-color: #F0436C;
  }

  .logout_popup-button:nth-child(2):hover {
    background-color: #F0436C;
    color: white;
  }
}

@media (min-width:1918px) and (min-height:1078px) {
  .header_fon {
    width: 100dvw;
    height: 71px;
    background-color: #853CFF;
    display: flex;
  }

  .header {
    width: 1620px;
    height: 71px;
    background-color: #853CFF;
    display: flex;
    align-items: center;
    margin: 0 auto;
  }

  #logo_header {
    width: 123px;
    height: 50px;
  }

  .header_nav {
    display: flex;
    gap: 30px;
    ;
    margin-left: auto;
    height: 50px;
    ;
    align-items: center;
  }

  .header_nav>div {
    font-family: "Lato", sans-serif;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;
    font-style: Medium;
    letter-spacing: 0.2px;
    text-align: center;
    vertical-align: middle;
    color: #FFFFFF;
    cursor: pointer;

  }

  .header_nav_organization_settings>img {
    width: 16px;
    height: 9px;
    margin-left: 5px;
    ;
  }

  .header_nav_photo {
    width: 50px;
    height: 50px;
  }

  .header_nav_photo>img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
  }

  .header_nav_logout {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .header_nav_logout>img {
    width: 38px;
    height: 38px;
  }

  .header_nav_item-dropdown-options {
    position: absolute;
    top: calc(100% + 32px);
    box-shadow: 0px 1px 13.8px 0px #00000025;
    width: 318px;
    height: 206px;
    border-radius: 14px;
    left: -11px;
    background: white;
    z-index: 665455;

  }

  .header_nav_item-dropdown-options-header {
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
    white-space: nowrap;
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.2px;
    width: 306px;
    height: 34px;
    padding-left: 5px;
    margin-top: 17px
  }

  .header_nav_item-dropdown-option {
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
    white-space: nowrap;
    font-weight: 400;
    font-size: 20px;
    letter-spacing: 0.2px;
    width: 306px;
    height: 34px;
    padding-left: 5px;
    margin-top: 12px
  }

  .header_nav_item-dropdown-option:hover {
    border-radius: 7px;
    background-color: #DFDFDF !important;
  }

  .logout_popup-overlay {
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

  .logout_popup {
    margin-top: 290px;
    background: white;
    border-radius: 18px;
    ;
    width: 524px;
    ;
    height: 173px;
    ;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    position: relative;
  }

  .logout_popup-close {
    position: absolute;
    top: 25px;
    right: 25px;
    cursor: pointer;
    font-size: 30px;
    color: #aaa;
  }

  .logout_popup-header-text {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 20px;
    ;
    margin: 0 auto;
    margin-top: 24px;
    margin-left: 20px;
    ;
    ;
  }

  .logout_popup-header-text_ {
    margin-left: 20px;
    ;
    ;
    font-family: "Lato", sans-serif;
    margin-top: 19px;
    ;
    color: #7D7D7D;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    ;
    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;

  }

  .logout_popup-body {
    margin-left: 218px;
    ;
    ;
    display: flex;
    margin-top: 59px;

  }

  .logout_popup-button {
    width: 138px !important;
    height: 41px;
    ;
    border-radius: 8px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;
    ;
    line-height: 120%;
    letter-spacing: 1%;
    text-align: center;
    vertical-align: middle;

  }

  .logout_popup-button:nth-child(1) {
    background-color: white;
    color: #7D7D7D;
    border: none;
    ;
  }

  .logout_popup-button:nth-child(1):hover {
    color: #1D1D1D;
    border: 1.5px solid #1D1D1D;

  }

  .logout_popup-button:nth-child(2) {
    margin-left: 10px;
    ;
    ;
    background-color: white;
    color: #F0436C;
    border: 1.5px solid #F0436C;
    border-color: #F0436C;
  }

  .logout_popup-button:nth-child(2):hover {
    background-color: #F0436C;
    color: white;
  }
}

* {
  padding: 0;
  ;
}

.header_nav_organization_settings {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

/* .header{
        background-color: beige;
    } */
</style>
