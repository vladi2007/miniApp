<script setup lang="ts">
// imports
import QrcodeVue from 'qrcode.vue'

// composables
import { UseLinks } from '~/composables/interactive/interactive_leader/waiting_leader/waiting_links'

// data from backend
const props = defineProps<{
  code: string
  id: string
}>()
const { copyToClipboard, participantUrl, qrSize } = UseLinks(props.id)
</script>

<template>
  <div :class="$style.links">
    <div :class="$style.links__header">
      Код интерактива:
    </div>
    <div :class="$style.links__code">
      {{ props.code }}
    </div>
    <div :class="$style.links__qr">
      <QrcodeVue :value="participantUrl" :size="qrSize" />
    </div>
    <div :class="$style.links__link">
      <img id="link" src="/images/waiting/line-md_link.svg" title="Скопировать ссылку" @click="copyToClipboard">
      <a :href="participantUrl" target="_blank" rel="noopener noreferrer">
        {{ participantUrl }}
      </a>
    </div>
  </div>
</template>

<style module lang="scss">
* {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1%;
  vertical-align: middle;

}

.links {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 281px;
  border: 1.5px solid #853CFF80;
  border-radius: 15px;
  width: 100%;

  @media (min-width:1280px) {
    margin-top: calc(80/832*100dvh);
    border: 2px solid #853CFF80;
    height: calc(636/832*100dvh);
    width: calc(483/1280*100dvw);
    border-radius: 30px;
  }



  &__header {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin-top: 6px;
    color: #000000;

    @media (min-width:1280px) {
      margin-top: calc(47/832*100dvh);
      font-size: clamp(32px, 2vw, 44px);
      line-height: clamp(32px, 2vw, 44px);
      ;
    }
  }

  &__code {
    font-family: 'Work Sans', sans-serif;
    font-weight: 700;
    font-size: 32px;
    line-height: 37.5px;
    color: #853CFFB2;

    @media (min-width:1280px) {
      font-size: 64px;
      font-weight: 700;
      line-height: 64px;
      margin-top: calc(20/832*100dvh);
    }

    ;
  }

  &__qr {
    margin-top: 9px;


    @media (min-width:1280px) {

      margin-top: calc(23/832*100dvh);

    }
  }

  &__link {
    display: flex;
    align-items: center;
    width: 292px;
    padding-left: 18px;
    gap: 8px;
    margin-top: 15px;
    border: 1.5px solid #853CFF80;
    border-radius: 24px;

    @media (min-width:1280px) {
      border: 2px solid #853CFF80;
      margin-top: calc(56/832*100dvh);
      width: calc(428/1280*100dvw);
      height: calc(52/832*100dvh);
      border-radius: 14px;
      padding-left: calc(18/1280*100dvw);
      gap: calc(16/1280*100dvw);
    }

    &>img {
      width: 20px;
      height: 20px;

      @media (min-width:1280px) {

        width: calc(24/1280*100dvw);
        height: calc(26/832*100dvh);
        ;
      }
    }

    &>a {
      max-width: 230px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: none;
      color: #000000;

      @media (min-width:1280px) {
        max-width: calc(357/1280*100dvw);
        font-size: clamp(32px, 2vw, 44px);
        line-height: clamp(32px, 2vw, 44px);
      }
    }
  }
}
</style>
