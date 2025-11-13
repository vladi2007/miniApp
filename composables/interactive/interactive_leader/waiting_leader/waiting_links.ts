export function UseLinks(code: string) {
  const participantUrl = `https://t.me/ClikInteractive_Bot?start=${code}`;
  function copyToClipboard() {
    try {
      // Создаём скрытое поле ввода
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = "0";
      input.value = participantUrl;
      document.body.appendChild(input);
      input.focus();
      input.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(input);

      if (successful) {
      } else {
        throw new Error("Не удалось скопировать");
      }
    } catch (err) {
      console.error("Ошибка копирования (fallback):", err);
      // Fallback на ручное копирование
      const manualCopy = prompt(
        "Не удалось автоматически скопировать. Скопируйте вручную:",
        participantUrl
      );
      if (!manualCopy) {
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

return {copyToClipboard, participantUrl, qrSize}
}
