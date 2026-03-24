<script setup lang="ts">
// imports
import QrcodeVue from 'qrcode.vue'

// composables
import { UseLinks } from '~/composables/interactive/interactive_leader/waiting_leader/waiting_links'

// data from backend
const props = defineProps<{
  code: string
}>()
const { copyToClipboard, participantUrl, qrSize } = UseLinks(props.code)
</script>

<template>
  <div class="waiting_links_column">
    <div class="waiting_code-text">
      Код викторины:
    </div>
    <div class="waiting_code">
      {{ props.code }}
    </div>
    <div class="waiting_qr_code">
      <QrcodeVue
        :value="participantUrl"
        :size="qrSize"
        class="qr"
      />
    </div>
    <div class="waiting_link">
      <div>
        <img
          id="link"
          src="/images/waiting/line-md_link.svg"
          title="Скопировать ссылку"
          @click="copyToClipboard"
        >
      </div>
      <div class="waiting-link_text">
        <a
          href="participantUrl"
          target="_blank"
          rel="noopener noreferrer"
        />{{
          participantUrl }}
      </div>
    </div>
  </div>
</template>

<style>
</style>
