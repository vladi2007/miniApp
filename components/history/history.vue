<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { downloadFile } from '@telegram-apps/sdk';
import { postEvent } from '@telegram-apps/sdk';

// Получаем данные через props
const route = useRouter();
const showPopup = ref(false);
const selectedOption = ref("");

// Массив для хранения выбранных интерактивов
const selectedInteractives = ref([]); // Массив для выбранных интерактивов

// Статус для выбора нескольких интерактивов
const selectMany = ref(false);

// Функция для возврата на главную страницу
function goToMainMenu() {
  route.push('/leader/main_menu')
}

function openPopup(interactiveId) {
  selectedOption.value = null; // Очищаем выбор при открытии попапа
  selectedInteractives.value = Array.isArray(interactiveId) ? interactiveId : [interactiveId]; // Обновляем выбранные интерактивы
  showPopup.value = true;
}
function openPopupManySelect() {
  selectedOption.value = null; // Очищаем выбор при открытии попапа

  showPopup.value = true;
}
// Функция для закрытия попапа
function closePopup() {
  showPopup.value = false;
  selectedOption.value = null;
}

// Функция для выбора нескольких интерактивов
function selectManyOption() {
  selectMany.value = !selectMany.value;
  if (!selectMany.value) {
    selectedInteractives.value = [];
  }
}

// Функция для выбора интерактива (при выборе нескольких)
function toggleInteractiveSelection(id) {
  const index = selectedInteractives.value.indexOf(id);
  if (index === -1) {
    selectedInteractives.value.push(id); // Добавляем в выбранные
  } else {
    selectedInteractives.value.splice(index, 1); // Убираем из выбранных
  }
}

async function submitReport() {
  if (selectedInteractives.value.length > 0) {
    if (selectedOption.value !== 'forAnalise' && selectedOption.value !== 'forLeader') {
      window.Telegram.WebApp.showAlert(`Выберите тип отчета!`);
      return;
    }
    try {
      const body = {
        telegram_id: userId.value,
        interactive_id: selectedInteractives.value.map(id => ({ id })),
        report_type: selectedOption.value
      };

      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка сервера');
      }

      const data = await response.json()

      if (data.url) {
        postEvent('web_app_request_file_download', {
          url: `https://voshod07.ru${data.url}`,
          file_name: data.userFileName
        })
      } else {
        throw new Error(data.error || 'Не удалось получить ссылку на файл')
      }
    } catch (error) {
      window.Telegram.WebApp.showAlert(`Ошибка при выгрузке отчета: ${error.message}`);
    }
  }
  else {
    window.Telegram.WebApp.showAlert(`Выберите хотя бы один интерактив для формирования отчёта!`);
  }
  if (window.Telegram?.WebApp?.expand) {
    setTimeout(() => {
      Telegram.WebApp.requestFullscreen()
    }, 0);
  }
}




const webApp = ref(null)
const initDataUnsafe = ref(null)
const userId = ref(null)
const props = ref(null)
const isReady = ref(false)
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe


    userId.value = initDataUnsafe.value?.user?.id

    const data = await useFetch('/api/reports/preview', {

      query: {
        telegram_id: userId.value
      },
    });
    props.value = data

    isReady.value = true

  }
});


onMounted(() => {
  document.body.classList.add('history-background');
});
onUnmounted(() => {
  document.body.classList.remove('history-background');
});


</script>

<template>
  <div class="history_fon" v-if="isReady">

    <div class="history">
      <div class="history_logo">
        <img src="/images/main_menu/logo.svg" id="history_nav_bar_logo" />
      </div>
      <div class="history_content-fon">
        <div class="history_content">
          <div>
            <button class="history_backButton" @click="goToMainMenu()">
              Вернуться
            </button>
          </div>
          <div class="history_content_menu">
            <div class="history_menu_info_header">
              Выгрузка отчетов/<br />
              история интерактивов
            </div>
            <div class="history_content_menu_info">
              <img src="/images/history/history.svg" id="history_menu_info" />
              <div class="history_content_menu_info_guide">
                Вы можете выгрузить два вида отчетов.<br />
                Доступна функция выгрузки отчетов с нескольких интерактивов.
              </div>
              <div class="pick_button">
                <button v-if="selectMany" class="selectManyDownload" @click="openPopupManySelect()">
                  Выгрузить
                </button>
                <button class="history_content_menu_info_button" @click="selectManyOption"
                  :class="{ selectManyClass: selectMany, 'hoverable-select': !selectMany, 'hoverable-select_red': selectMany }">
                  {{ !selectMany ? "Выбрать" : "Отмена" }}
                </button>
              </div>
            </div>
          </div>

          <div class="history_content_list">
            <div v-for="interactive in props.data.interactives_list" :key="interactive.interactive_id">
              <div class="history_interactive">
                <div class="history_header">
                  <div class="history_date-fon">
                    <div class="history_date">{{ interactive.date_completed }}</div>
                  </div>
                  <div class="history_title">{{ interactive.title }}</div>
                  <img src="/images/history/Vector_109.svg" id="history_line" />
                </div>

                <div class="history_info">
                  <div class="participant_count">
                    Участников: {{ interactive.participant_count }}
                  </div>
                  <div class="target_audience">
                    Целевая аудитория: {{ interactive.target_audience }}
                  </div>
                  <div class="location">
                    Место проведения: {{ interactive.location }}
                  </div>
                </div>

                <button v-if="!selectMany" class="history_download" @click="openPopup(interactive.interactive_id)">
                  Выгрузить
                </button>
                <label v-if="selectMany" class="select_many_option">
                  <input type="checkbox" :value="interactive.interactive_id" class="custom-checkbox"
                    @change="toggleInteractiveSelection(interactive.interactive_id)" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <div class="popup-header">
          <div class="popup-header-text">Какой отчет хотите выгрузить</div>
          <img src="/images/history/Vector_1.svg" class="popup-close" @click="closePopup" />
        </div>
        <div class="popup-body">
          <label class="popup-option">
            <input type="radio" v-model="selectedOption" value="forLeader" />
            <span class="popup-option-span">Отчет для ведущего</span>
          </label>
          <label class="popup-option">
            <input type="radio" v-model="selectedOption" value="forAnalise" />
            <span class="popup-option-span">Отчет для обработки</span>
          </label>
        </div>
        <div class="popup-footer">
          <button @click="submitReport" class="popup-submit">Выгрузить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/history/history.scss");
</style>
