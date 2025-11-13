<script setup lang="ts">

// imports
import QrcodeVue from 'qrcode.vue'

// data from backend
const props = defineProps<{
  code: string
}>()

// composables
import { UseLinks } from '~/composables/interactive/interactive_leader/waiting_leader/waiting_links';
const {copyToClipboard, participantUrl, qrSize} = UseLinks(props.code)

</script>

<template>
  <div class="waiting_links_column">
    <div class="waiting_code-text">Код викторины:</div>
    <div class="waiting_code">{{ props.code }}</div>
    <div class="waiting_qr_code">
       <QrcodeVue :value="participantUrl" :size="qrSize" class="qr" /> 
    </div>
    <div class="waiting_link">
      <div><img src='/images/waiting/line-md_link.svg' id="link" @click="copyToClipboard" title="Скопировать ссылку" />
      </div>
      <div class="waiting-link_text"><a href="participantUrl" target="_blank" rel="noopener noreferrer"></a>{{
        participantUrl }}</div>
    </div>
  </div>
</template>

<style>
</style>
