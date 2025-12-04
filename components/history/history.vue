<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'
import { postEvent } from '@telegram-apps/sdk';

// для маршрутизации
const route = useRouter();
// подтверждения рассылки
const showPopup = ref(false);
// для выбора типа отчёта
const selectedOption = ref("");

// Массив для хранения выбранных интерактивов
const selectedInteractives = ref([]); // Массив для выбранных интерактивов

// Статус для выбора нескольких интерактивов
const selectMany = ref(false);

// Функция для возврата на главную страницу
function goToMainMenu() {
  route.push('/leader/main_menu')
}
// для скачивания отчёта одного
function openPopup(interactiveId) {
  selectedOption.value = null; // Очищаем выбор при открытии попапа
  selectedInteractives.value = Array.isArray(interactiveId) ? interactiveId : [interactiveId]; // Обновляем выбранные интерактивы
  showPopup.value = true;
}
// для открытия чекбоксов для множественного выбора интерактивов
function openPopupManySelect() {
  selectedOption.value = null; // Очищаем выбор при открытии попапа

  showPopup.value = true;
}
// Функция для закрытия попапа
function closePopup() {
  showPopup.value = false;
  selectedOption.value = null;
  selectedInteractives.value=[];
 
      
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
    а
    selectedInteractives.value.push(id); // Добавляем в выбранные
  } else {
    selectedInteractives.value.splice(index, 1); // Убираем из выбранных
  }
}
// функция для скачивания отчета: запрос, проверки
async function submitReport() {
  showPopup.value=false
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



// данные о пользователе 
const webApp = ref(null)

const userId = ref(null)
const props = ref(null)
const isReady = ref(false)


const HISTORY_KEY = 'history_interactives'
const HISTORY_SELECT_MANY_KEY = 'history_select_many'
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
      //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
    const savedInteractives = loadFromDeviceStorage(HISTORY_KEY);
    if (Array.isArray(savedInteractives)) {
      if (savedInteractives.length > 0 && typeof savedInteractives[0] === 'object') {
        selectedInteractives.value = savedInteractives.map(item => Number(item.id));
      } else {
        selectedInteractives.value = savedInteractives.map(Number);
      }
    } else {
      selectedInteractives.value = [];
    }

    const savedSelectMany = loadFromDeviceStorage(HISTORY_SELECT_MANY_KEY);
    if (savedSelectMany && selectedInteractives.value.length > 0) {
      selectMany.value = savedSelectMany;
    }

   

    const data = await useFetch('/api/reports/preview', {

      query: {
        telegram_id: userId.value
      },
    });
    props.value = data

    isReady.value = true

  }
});

// дл смены цвета фона
onMounted(() => {
  document.body.classList.add('history-background');
});
onUnmounted(() => {
  document.body.classList.remove('history-background');
});
// флаг для подтверждения выхода со страницы
const showConfirmPopup = ref(false)
// поп ап для подтверждения выхода со страницы
function handleBackClick() {
  showConfirmPopup.value = true
}
// функция для выхода в главное меню
async function confirmBack(save) {
  if (save) {

    showConfirmPopup.value = false
    route.push('/leader/main_menu')
 
    sessionStorage.removeItem('history_interactives');
    sessionStorage.removeItem('history_select_many');



  } else {
    showConfirmPopup.value = false

  }
}

watch(selectedInteractives, (newSelectedInteractives) => {
  saveToDeviceStorage(HISTORY_KEY, newSelectedInteractives);
}, { deep: true });
watch(selectMany, (newSelectMany) => {
  saveToDeviceStorage(HISTORY_SELECT_MANY_KEY, newSelectMany)
})
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
            <button class="history_backButton" @click="handleBackClick()">
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
                  :class="{ selectManyClass: selectMany, 'hoverable-select': !selectMany, 'hoverable-select_red': selectMany }" v-if="props.data.interactives_list.length > 0">
                  {{ !selectMany ? "Выбрать" : "Отмена" }}
                </button>
              </div>
            </div>
          </div>

          <div class="history_content_list">
            <div v-if="props.data.interactives_list.length > 0" v-for="interactive in props.data.interactives_list" :key="interactive.interactive_id" >
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
                    v-model=selectedInteractives />
                </label>
              </div>
            </div>
            <div  class ="history_content_list_warn"  v-if="props.data.interactives_list.length ===0">
              Вы не провели ни один интерактив!
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
    <div v-if="showConfirmPopup" class="history_edit_popup-overlay">
      <div class="history_edit_popup-content">
        <div class="history_edit_popup-text">Вы действительно хотите вернуться на главное меню?

        </div>
        <div class="history_edit_popup-actions">
          <button @click="confirmBack(true)" class="history_edit_popup-btn save">Да</button>
          <button @click="confirmBack(false)" class="history_edit_popup-btn cancel">Нет</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/history/history.scss");
</style>
