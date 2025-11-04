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


//функция для копирования ссылки в буфер обмена
function copyToClipboard() {
  try {
    // Создаём скрытое поле ввода
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    input.value = participantUrl;
    document.body.appendChild(input);
    input.focus();
    input.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(input);

    if (successful) {
      window.Telegram?.WebApp?.showAlert?.('Ссылка скопирована!');
    } else {
      throw new Error('Не удалось скопировать');
    }
  } catch (err) {
    console.error('Ошибка копирования (fallback):', err);
    // Fallback на ручное копирование
    const manualCopy = prompt('Не удалось автоматически скопировать. Скопируйте вручную:', participantUrl);
    if (!manualCopy) {
      window.Telegram?.WebApp?.showAlert?.('Копирование отменено.');
    }
  }
}
const qrSize = ref(300)

function updateQrSize() {
  const w = window.innerWidth
  const h = window.innerHeight
  // формула — как твоя calc((300 / 1280) * 100dvw) и calc((300 / 832) * 100dvh)
  const sizeW = (300 / 1280) * w
  const sizeH = (300 / 832) * h
  qrSize.value = Math.min(sizeW, sizeH) // берём минимальное, чтобы не вылезало
}

onMounted(() => {
  updateQrSize()
  window.addEventListener('resize', updateQrSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQrSize)
})
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
.waiting_links_column {

  font-family: 'Lato', sans-serif;

  display: flex;
  flex-direction: column;
  /* Элементы идут вертикально */
  align-items: center;
  /* Центрирование по горизонтали */
  /* Центрирование по вертикали */
  width: calc((483 / 1280) * 100dvw);
  height: calc((636 / 832) * 100dvh);
  margin-left: calc((40 / 1280) * 100dvw);
  margin-top:calc((80 / 832) * 100dvh);
  border-radius: 30px;
  border: 3px solid #853CFF;
box-sizing: border-box;


display: flex;
  flex-direction: column;

  /* Чтобы контент не прилипал вплотную к краям */
  box-sizing: border-box;
}



.waiting_code-text {
  font-family: 'Lato', sans-serif;
  font-size: clamp(10px, calc((32 / 1280) * 100dvw), 64px);
  margin-top:calc((47 / 832) * 100dvh);

font-weight: 700;

}

.waiting_code {
  margin: 0 auto;  margin-top:calc((15 / 832) * 100dvh);
  color: #853CFFB2;
  font-size: clamp(20px, calc((64 / 1280) * 100dvw), 128px);
  min-height: calc((44 / 832) * 100dvh);;
  font-family: "Work Sans", sans-serif;
font-weight: 700;
font-style: Bold;
vertical-align: middle;box-sizing: border-box;

}

.waiting_qr_code {margin-top:calc((15 / 832) * 100dvh);
  width: calc((300 / 1280) * 100dvw);
  height: calc((300 / 832) * 100dvh);
  font-family: 'Lato', sans-serif;
  display: flex;
  align-self: center;box-sizing: border-box;
  justify-content: center;
}

.waiting_link {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lato', sans-serif;box-sizing: border-box;
  border-radius: 14px;
  border: 3px solid #853CFF;
margin-top:calc((52 / 832) *100dvh);
min-height: calc((52 / 832) *100dvh);;
  width: calc((428 / 1280) * 100dvw);

}
.waiting_qr_code .qr {
  width: 100%; box-sizing: border-box;
  height: 100%;box-sizing: border-box;
}
.waiting-link_text {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  white-space: nowrap;
  /* Запрещает перенос строк */
  overflow: hidden;
  /* Обрезает содержимое */
  text-overflow: ellipsis;
    font-size: clamp(20px, calc((32 / 1280) * 100dvw), 64px);
  font-family: Lato;
font-weight: 500;
font-style: Medium;
vertical-align: middle;box-sizing: border-box;
  margin-left: calc((10 / 1280) * 100dvw);
}

#link {  margin-left: calc((10 / 1280) * 100dvw);
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  vertical-align: middle;
   background-size: contain;height: calc((30 / 832) *100dvh);;
  width: calc((30 / 1280) * 100dvw);
}
</style>
