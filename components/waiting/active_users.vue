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
      Активные<br> пользователи
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



  &__count {

    padding: 7px 5px 7px 5px;
    background-color: #F7F7F766;
    border-radius: 5px;
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

    &>br {
      display: none;
    }
  }
}
</style>
