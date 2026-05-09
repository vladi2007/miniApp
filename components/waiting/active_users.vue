<script setup lang="ts">
// data from backend
const props = defineProps<{ count: string, context: string }>()
</script>

<template>
  <div :class="$style.active">
    <div :class="$style.active__count">
      {{ count }}
    </div>
    <div :class="$style.active__text">
      Подключившихся<br> участников
    </div>
  </div>
</template>

<style module lang="scss">
* {
  letter-spacing: 1%;
  vertical-align: middle;

}

.active {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
  margin-top: 12px;
  height: 42px;
  font-family: 'Work Sans', sans-serif;
  color: white;
  font-size: 24px;
  font-weight: 500;

  @media (min-width:1280px) {
    justify-content: center;
    margin-top: calc(59/832*100dvh);
    height: calc(97/832*100dvh);
    gap: calc(12/1280*100dvw);
    ;
  }

  &__count {

    padding: 7px 5px 7px 5px;
    background-color: #F7F7F766;
    border-radius: 5px;

    @media (min-width:1280px) {
      height: calc(97/832*100dvh);
      aspect-ratio: 1;
      border: 2px solid #853CFF;
      border-radius: 50%;
      ;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1D1D1D;
      font-size: clamp(40px, 2.5vw, 56px);
      ;
    }
  }

  &__text {
    font-size: 16px;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    display: flex;
    align-items: center;
    padding: 11.5px 10px;
    background-color: #F7F7F766;
    border-radius: 5px;

    @media (min-width:1280px) {
      padding: 0;
      height: calc(61/832*100dvh);
      width: calc(280/1280*100dvw);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: clamp(32px, 2vw, 44px);
      color: #1D1D1D;
      background-color: white;
    }

    &>br {
      display: none;

      @media (min-width:1280px) {
        display: flex;
      }
    }
  }
}
</style>
