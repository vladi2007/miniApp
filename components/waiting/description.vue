<script setup lang="ts">
// data from backend
const props = defineProps<{ title: string, description: string, context: string, goBack?: () => void, onStatus?: any }>()
</script>

<template>
  <div :class="$style.desc">
    <div :class="$style.desc__title">
      {{ title
      }}
    </div>
    <div :class="$style.desc__desc">
      {{ description }}
    </div>
    <div v-if="context === 'leader'" :class="$style.desc__buttons">
      <button @click="goBack" :class="$style.desc__buttons_back">
        Вернуться
      </button>
      <button @click="onStatus('going')" :class="$style.desc__buttons_start">
        Запустить
      </button>
    </div>
  </div>
</template>

<style module lang="scss">
* {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1%;
  vertical-align: middle;

}

.desc {
  width: calc(100% - 40px);
  margin: 0 20px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  flex: 1; // 👈 важно

  @media (min-width:1280px) {
    width: calc(100% - calc(80/1280*100dvw));
    margin: 0 calc(40/1280*100dvw);
    padding: 0;
    background-color: #FFFFFF;
    margin-top: calc(19/832*100dvh);
    border-radius: 16px;
    margin-bottom: calc(40/1280*100dvw);
    min-height: calc(370/832*100dvh);
  }

  &__buttons {
    display: none;

    @media (min-width:1280px) {
      display: flex;
    }

    &_back {
      width: calc(185/1280*100dvw);
      height: calc(50/832*100dvh);
      border-radius: 5px;
      background-color: #F0436C;
      color: white;
      font-size: clamp(24px, 1.5vw, 32px);
      font-weight: 500;
      border: none;
    }

    &_start {
      width: calc(185/1280*100dvw);
      height: calc(50/832*100dvh);
      border-radius: 5px;
      background-color: #6AB23D;
      color: white;
      font-size: clamp(24px, 1.5vw, 32px);
      font-weight: 500;
      border: none;
    }
  }

  &__title {
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    color: #FFFFFF;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    overflow: hidden;
    word-break: break-word;

    @media (min-width:1280px) {
      display: flex;
      font-weight: 500;
      color: #000000;
      padding: 0 calc(40/1280*100dvw);
      margin-top: calc(40/832*100dvh);
      font-size: clamp(40px, 2.5vw, 56px);
      line-height: clamp(40px, 2.5vw, 56px);
      ;
    }
  }

  &__desc {
    display: none;

    @media (min-width:1280px) {
      display: flex;
      overflow: hidden;
      word-break: break-word;
      padding: 0 calc(40/1280*100dvw);
      margin-top: calc(36/832*100dvh);
      font-size: clamp(32px, 2vw, 44px);
      font-weight: 400;
      line-height: clamp(40px, 2.5vw, 56px);
      ;
    }
  }

  &__buttons {
    display: none;

    @media (min-width:1280px) {
      display: flex;
      align-items: center;
      gap: calc(50/1280*100dvw);
      margin: 0 auto;
      margin-top: auto;
      margin-bottom: calc(20/1280*100dvw);
      ;
    }
  }
}
</style>
