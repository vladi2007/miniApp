<script setup lang="ts">
const props = defineProps<{
  take_step: (step: string) => void
  active_step: string
  isFormComplete: boolean
  validateForm: () => boolean
  confirmBack: () => void

}>()
</script>

<template>
  <div :class="$style.edit">
    <div :class="$style.edit__nav">

      <div @click="take_step('main')"" :class="[active_step == 'main' ? $style.edit__active : '']">
        Общие настройки
      </div>
      <div :class="[active_step == 'questions' ? $style.edit__active : '']">
        <div @click=" validateForm() && take_step('questions')">
          Вопросы
        </div>
        <img :class="$style.edit__nav_lock_img" v-if="!props.isFormComplete" id="lock"
          src="/public/images/interactive_editor/lock.svg">
      </div>

      <div :class="$style.edit__nav_lock" v-if="!isFormComplete">
        <span>Будет доступно после заполнения <br>общих настроек</span>
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

.edit {



  &__nav {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: 22px;
    margin-top: 5px;
    width: 220px;
    height: 37px;
    border: 1.5px solid #E0E0E0;
    border-radius: 20px;
    padding: 10px 5px;
    font-size: 14px;
    background-color: white;

    @media (min-width:1056px) {
      height: 53px;
      margin: 0;
      padding: 0;
      border: none;
      border-radius: 0;
      display: flex;
      gap: 20px;
      width: fit-content;
      align-items: start;
      font-size: 20px;
      margin-left: 73px;
    }

    &>div {
      padding: 5px;
      text-align: center;
      color: #A9A9A9;


      @media (min-width:1056px) {
        padding: 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        height: 26px;
        border-bottom: 1.5px solid white;
        margin-top: 6px;
      }
    }

    &_lock {
      display: none;

      @media (min-width:1056px) {
        display: flex;
        align-items: center;
        justify-content: left;
        background-color: #E0E0E0;
        height: 53px !important;
        font-size: 14px;

        color: #7D7D7D;
        text-align: left !important;
        border-radius: 8px;
        width: 248px;
        margin-top: 0 !important;

      }

      &>span {
        padding: 5px 10px;
        line-height: 22px;
      }

      &_img {
        display: none;

        @media (min-width:1056px) {
          display: block;
        }
      }
    }
  }

  &__active {
    background-color: #853CFF4D;
    border-radius: 30px;
    color: #853CFF !important;

    @media (min-width:1056px) {
      background-color: white;
      color: #1D1D1D !important;
      border-bottom: 1.5px solid #853CFF !important;
      border-radius: 0;
    }
  }
}
</style>
