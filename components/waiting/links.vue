<script setup lang="ts">
import { useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()

// Получаем interactive_id из параметров URL
const interactiveId = route.params.id as string
const props = defineProps<{
    code: string
}>()
// Формируем URL
const participantUrl = `https://t.me/ClikInteractive_Bot?start=${props.code}`
function copyToClipboard() {
  navigator.clipboard.writeText(participantUrl)
    .then(() => {
      window.Telegram?.WebApp?.showAlert?.('Ссылка скопирована!');
    })
    .catch(err => {
      console.error('Ошибка копирования:', err);
      window.Telegram?.WebApp?.showAlert?.('Не удалось скопировать ссылку');
    });
}
</script>

<template>
  <div class="waiting_links_column">
    <div class="waiting_code-text">Код викторины:</div>
    <div class="waiting_code">{{props.code}}</div>
    <div class="waiting_qr_code"><QrcodeVue :value="participantUrl" :size="300" /></div>
    <div class="waiting_link">
      <div><img src='/images/waiting/line-md_link.svg' id="link" @click="copyToClipboard"
      title="Скопировать ссылку" /></div>
      <div class="waiting-link_text"><a href="participantUrl" target="_blank" rel="noopener noreferrer"></a>{{
        participantUrl }}</div>
    </div>
  </div>
</template>

<style>
.waiting_links_column {
  font-family: 'Lato', sans-serif;
  width: 526px;

  margin-top: 191px;
  height: 636px;
  display: flex;
  flex-direction: column;
  /* Элементы идут вертикально */
  align-items: center;
  /* Центрирование по горизонтали */
  /* Центрирование по вертикали */


  border-radius: 30px;
  border: 3px solid #853CFF;

}



.waiting_code-text {
  margin-top: 44px;
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  font-weight: 700;
  font-size: 32px;
  line-height: 24px;
}

.waiting_code {
  font-family: 'Work Sans', sans-serif;
  margin: 0 auto;
  font-weight: 700;
  font-size: 64px;
  vertical-align: middle;
  line-height: 28px;
  ;
  margin-top: 44px;
  color: #853CFFB2;
  letter-spacing: 3px;
}

.waiting_qr_code {
  background-color: #853CFF;
  height: 300px;
  width: 300px;
  font-family: 'Lato', sans-serif;
  margin-top: 35px;
}

.waiting_link {
  display: flex;
  align-items: center;
  font-family: 'Lato', sans-serif;
  margin-top: 53px;
  width: 428px;
  border-radius: 14px;
  border: 3px solid #853CFF;
  height: 51px;
  ;


}

.waiting-link_text {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 30px;
  vertical-align: middle;
  padding-left: 25px;
  white-space: nowrap;
  /* Запрещает перенос строк */
  overflow: hidden;
  /* Обрезает содержимое */
  text-overflow: ellipsis;
}

#link {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 32px;
  line-height: 24px;
  vertical-align: middle;
  margin-left: 12px;
  ;
}
</style>
