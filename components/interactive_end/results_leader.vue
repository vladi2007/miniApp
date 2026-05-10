<script setup lang="ts">
// данные о результатах интерактива: таблица лидеров
const props = defineProps<{
  title: string
  participantsTotal: string
  stage: string
}>()
</script>

<template>
  <div :class="$style.results">
    <img id="interactive_end_rectangle" src="/public/images/interactive_end/Rectangle_98_leader.svg">
    <img id="interactive_end_rectangle2" src="/public/images/interactive_end/Group 7094.svg">
    <img id="interactive_end_rectangle4" src="/public/images/interactive_end/Group 7095 (1).svg">
    <img id="interactive_end_rectangle5" src="/public/images/interactive_end/Group 2.svg">
    <img id="interactive_end_rectangle6" src="/public/images/interactive_end/Group 3.svg">
    <img id="interactive_end_ellipse2" src="/public/images/interactive_end/Ellipse_44_leader.svg">
    <img id="interactive_end_rectangle9" src="/public/images/interactive_end/Group 7097.svg">
    <img id="interactive_end_ellipse3" src="/public/images/interactive_end/Ellipse_45_1_leader.svg">


    <div :class="$style.results__title">
      {{ props.title }}
    </div>
    <div :class="$style.results__count">
      <div :class="$style.results__number">{{ props.participantsTotal }}</div>
      <div :class="$style.results__text">
        Участников
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.results {
  margin-top: 15px;
  padding: 0 20px;


  img {
    display: none;

  }

  @media (min-width: 1280px) {
    padding: 0;

    margin: 0;

    img {
      display: block;
    }

    :global(#interactive_end_rectangle) {
      position: absolute;
      width: calc((40 / 1280) * 100dvw);
      height: calc((55 / 832) * 100dvh);
      top: calc((74 / 832) * 100dvh);
      right: calc((64 / 1280) * 100dvw);
    }

    :global(#interactive_end_rectangle2) {
      position: absolute;
      bottom: 0;
      right: calc((127 / 1280) * 100dvw);
      z-index: 3;
      width: calc((74 / 1280) * 100dvw);
      height: calc((71 / 832) * 100dvh);
    }

    :global(#interactive_end_rectangle4) {
      position: absolute;
      width: calc((266 / 1280) * 100dvw);
      height: calc((260 / 832) * 100dvh);
      right: calc((170 / 1280) * 100dvw);
      top: calc((0 / 832) * 100dvh);
      z-index: 2;
    }

    :global(#interactive_end_rectangle5) {
      position: absolute;
      width: calc((210 / 1280) * 100dvw);
      height: calc((190 / 832) * 100dvh);
      bottom: calc((-70 / 832) * 100dvh);
      right: calc((400 / 1280) * 100dvw);
      z-index: 22;
    }

    :global(#interactive_end_rectangle6) {
      position: absolute;
      width: calc((61 / 1280) * 100dvw);
      height: calc((22 / 832) * 100dvh);
      top: calc((30 / 832) * 100dvh);
      right: calc((548 / 1280) * 100dvw);
      z-index: 2;
    }

    :global(#interactive_end_ellipse2) {
      position: absolute;
      top: calc((-2 / 832) * 100dvh);
      right: calc((498 / 1280) * 100dvw);
      z-index: 2;
    }

    :global(#interactive_end_rectangle9) {
      position: absolute;
      z-index: 2;
      width: calc((57 / 1280) * 100dvw);
      height: calc((41 / 832) * 100dvh);
      top: calc((-10 / 832) * 100dvh);
      right: calc((671 / 1280) * 100dvw);
    }

    :global(#interactive_end_ellipse3) {
      position: absolute;
      width: calc((20 / 1280) * 100dvw);
      height: calc((20 / 832) * 100dvh);
      bottom: calc((50 / 832) * 100dvh);
      right: calc((682 / 1280) * 100dvw);
      z-index: 2;
    }
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 24px;
    color: #FFFFFF;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-word;
    height: 52px;


    @media (min-width:1280px) {
      position: relative;
      margin-top: calc(5/832*100dvh);
      margin-left: calc(40/1280*100dvw);
      width: calc(711/1280*100dvw);
      height: auto;
      font-size: clamp(40px, 2.5vw, 56px);
      z-index: 100000;
      line-height: 40px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-word;
    }
  }

  &__count {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 24px;
    font-family: 'Work Sans', sans-serif;
    color: #FFFFFF;

    @media (min-width:1280px) {
      position: relative;
      margin-top: calc(30/832*100dvh);
      margin-left: calc(70/1280*100dvw);
      font-size: clamp(40px, 2.5vw, 56px);
      z-index: 100000;
      line-height: 40px;
    }
  }

  &__number {
    padding: 7px 5px;
    background-color: #F7F7F766;
    border-radius: 5px;
    box-sizing: border-box;
    min-width: 42px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width:1280px) {
      padding: calc(7/832*100dvh) calc(5/1280*100dvw);
      ;
      ;
      font-size: clamp(40px, 2.5vw, 56px);
      line-height: 40px;
    }
  }

  &__text {
    font-size: 16px;
    padding: 12px;
    background-color: #F7F7F766;
    border-radius: 5px;
    font-family: 'Lato', sans-serif;
    box-sizing: border-box;

    @media (min-width:1280px) {
      padding: calc(7/832*100dvh) calc(14/1280*100dvw);
      font-size: clamp(40px, 2.5vw, 56px);
      line-height: 40px;
    }
  }
}
</style>
