<script setup lang="ts">
import { defineProps } from 'vue'
import type { CountdownData } from '~/store/types/stageData'

const props = defineProps<{
  data: CountdownData
}>()
</script>

<template>
  <div class="countdown">
    <div class="countdown__logo">
      <!-- DESKTOP -->
      <img class="countdown__vectorBottom desktop-only" src="/public/images/countdown/Vector_94_leader.svg">

      <img class="countdown__starLeft desktop-only" src="/public/images/countdown/Star_2_leader.svg">

      <img class="countdown__circle desktop-only" src="/public/images/countdown/circle_leader.svg">

      <img class="countdown__vectorTop desktop-only" src="/public/images/countdown/Vector_95_leader.svg">

      <img class="countdown__starTop desktop-only" src="/public/images/countdown/Star_8_leader.svg">

      <img class="countdown__starBottomRight desktop-only" src="/public/images/countdown/Star_7_2_leader.svg">

      <img class="countdown__starSmallBottom desktop-only" src="/public/images/countdown/Star_3_2_leader.svg">

      <img class="countdown__starBottom desktop-only" src="/public/images/countdown/Star_9_leader.svg">

      <img class="countdown__starLargeBottom desktop-only" src="/public/images/countdown/Star_6_1_leader.svg">

      <img class="countdown__dotLeft desktop-only" src="/public/images/countdown/Ellipse_49_leader.svg">

      <img class="countdown__starTopLeft desktop-only" src="/public/images/countdown/Star_13_leader.svg">

      <img class="countdown__dotTop desktop-only" src="/public/images/countdown/Ellipse_51_leader.svg">

      <!-- MOBILE -->
      <img class="countdown__circleStar mobile-only" src="/public/images/countdown/Group 7045.svg">

      <img class="countdown__starRight mobile-only" src="/public/images/countdown/Group 7096 (1).svg">

      <img class="countdown__starLeft mobile-only" src="/public/images/countdown/Star_2.svg">

      <img class="countdown__starBottomLeft mobile-only" src="/public/images/countdown/Group 7097 (1).svg">

      <img class="countdown__starBottomRight mobile-only" src="/public/images/countdown/Group 7098.svg">
    </div>

    <div class="countdown__text">
      {{ props.data.timer }}
    </div>
  </div>
</template>

<style lang="scss">
.countdown {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100dvw;
  height: 100dvh;

  overflow: hidden;
  background-color: #853cff;

  &__logo {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__text {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    font-weight: 700;
    color: white;

    z-index: 10;
    pointer-events: none;
  }
}

/* =========================
   MOBILE
========================= */

@media (max-width: 1279px) {
  .desktop-only {
    display: none;
  }

  .countdown {
    &__text {
      font-size: 128px;
    }

    &__circleStar {
      position: absolute;

      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);

      width: 100dvw;
      height: calc((460 / 844) * 100dvh);

      z-index: 0;
    }

    &__starLeft {
      position: absolute;

      left: 0;
      top: calc((131 / 844) * 100dvh);

      height: calc((213 / 844) * 100dvh);

      z-index: 0;
    }

    &__starRight {
      position: absolute;

      top: 0;
      right: 0;

      height: calc((262 / 844) * 100dvh);

      z-index: 0;
    }

    &__starBottomLeft {
      position: absolute;

      left: calc((28 / 844) * 100dvh);
      bottom: calc((60 / 844) * 100dvh);

      width: calc((83 / 390) * 100dvw);
      height: calc((83 / 844) * 100dvh);

      z-index: 0;
    }

    &__starBottomRight {
      position: absolute;

      right: calc((13 / 844) * 100dvh);
      bottom: calc((133 / 844) * 100dvh);

      width: calc((121 / 844) * 100dvh);
      height: calc((121 / 844) * 100dvh);

      z-index: 4;
    }
  }
}

/* =========================
   DESKTOP
========================= */

@media (min-width: 1280px) {
  .mobile-only {
    display: none;
  }

  .countdown {
    &__text {
      font-size: clamp(200px, calc((200 / 1280) * 100dvw), 300px);
    }

    &__vectorBottom {
      position: absolute;

      left: 0;
      bottom: 0;

      z-index: 2;
    }

    &__vectorTop {
      position: absolute;

      top: 0;
      right: 0;

      z-index: 2;
    }

    &__circle {
      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
      width: calc((820 / 1280) * 100dvw);
      height: calc((820 / 832) * 100dvh);
      z-index: 2;
    }

    &__starLeft {
      position: absolute;

      top: calc((230 / 832) * 100dvh);
      left: 0;

      transform: translateY(-50%);

      z-index: 0;
    }

    &__starTop {
      position: absolute;

      top: 65px;
      right: 200px;

      z-index: 0;
    }

    &__starTopLeft {
      position: absolute;

      top: calc((20 / 832) * 100dvh);
      left: calc((230 / 1280) * 100dvw);

      width: calc((110 / 1280) * 100dvw);
      height: calc((110 / 832) * 100dvh);
    }

    &__starLargeBottom {
      position: absolute;

      bottom: calc((126 / 832) * 100dvh);
      left: calc((99 / 1280) * 100dvw);

      width: calc((232 / 1280) * 100dvw);
      height: calc((232 / 832) * 100dvh);
    }

    &__starBottom {
      position: absolute;

      bottom: calc((56 / 832) * 100dvh);
      left: calc((292 / 1280) * 100dvw);

      width: calc((111 / 1280) * 100dvw);
      height: calc((111 / 832) * 100dvh);

      z-index: 2;
    }

    &__starBottomRight {
      position: absolute;

      right: calc((45 / 1280) * 100dvw);
      bottom: calc((45 / 832) * 100dvh);

      width: calc((274 / 1280) * 100dvw);
      height: calc((274 / 832) * 100dvh);

      z-index: 2;
    }

    &__starSmallBottom {
      position: absolute;

      right: calc((360 / 1280) * 100dvw);
      bottom: calc((20 / 832) * 100dvh);

      width: calc((90 / 1280) * 100dvw);
      height: calc((90 / 832) * 100dvh);

      z-index: 2;
    }

    &__dotLeft {
      position: absolute;

      left: calc((18 / 1280) * 100dvw);
      bottom: calc((372 / 832) * 100dvh);

      width: calc((17 / 1280) * 100dvw);
      height: calc((17 / 832) * 100dvh);
    }

    &__dotTop {
      position: absolute;

      top: calc((54 / 832) * 100dvh);
      left: calc((439 / 1280) * 100dvw);

      width: calc((17 / 1280) * 100dvw);
      height: calc((17 / 832) * 100dvh);
    }
  }
}
</style>