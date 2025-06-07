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
        file_name: data.url.split('/').pop() || 'report.xlsx'
      })
    } else {
      throw new Error(data.error || 'Не удалось получить ссылку на файл')
    }
  } catch (error) {
    window.Telegram.WebApp.showAlert(`Ошибка при выгрузке отчета: ${error.message}`);
  }
  }
  else{
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
    console.log(userId.value)
    const data = await useFetch('/api/reports/preview', {

      query: {
        telegram_id: userId.value
      },
    });
    props.value = data
    console.log(props.value)
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
                  :class="{ selectManyClass: selectMany }">
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

    <!-- Popup модальное окно -->
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
body.history-background {
  padding-bottom: 42px;
  ;
  background-color: #A774FC;
}

.history_download {
  cursor: pointer;
  position: absolute;
  top: 179px;
  left: 1086px;
  ;
  width: 202px;
  height: 60px;
  ;
  border-radius: 5px;
  background-color: #6AB23D;
  border: 1px #6AB23D;
  color: white;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  ;
  letter-spacing: 1px;
  ;

}

.history_fon {

  background-color: #A774FC;
  height: 1159px;
  ;
  margin-bottom: 56px;
  ;






}

.history {
  min-height: 100vh;
  height: 50px;
  ;
  width: 1360px;
  margin: 0 auto;

  padding-top: 12px;
}

.history_logo {
  width: 139px;
  ;
  margin-left: auto;
}

.history_content-fon {
  margin-top: 8px;
  width: 1360px;
  ;
  min-height: 1033px;
  ;
  background-color: white;
  border-radius: 40px;
  ;
}

.history_backButton {
  cursor: pointer;
  width: 229px;
  height: 62px;
  border-radius: 5px;
  background-color: #853CFF;
  color: white;
  border: 1px solid #853CFF;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
}

.history_content {
  padding-top: 20px;
  padding-left: 23px;
  ;
  padding-right: 19px;
  ;
  padding-bottom: 60px;
  ;
  display: grid;
  flex-direction: column;
}

.history_content_menu {

  margin-top: 65px;
  width: 1314px;
  height: 193px;
  ;
}

.history_content_menu_info {

  margin-top: 60px;
  position: relative;
  display: flex;
}

.pick_button {
  position: relative;
  margin-left: auto;
}

.history_content_menu_info_button {
  cursor: pointer;
  margin-left: auto;
  width: 210px;
  height: 50px;
  border-radius: 5px;
  background-color: #853CFF;
  color: white;
  border: 1px solid #853CFF;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
}

.history_menu_info_header {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 36px;

  vertical-align: middle;

}

#history_menu_info {
  position: absolute;
  top: 0;
  left: 0;
  ;
}

.history_content_menu_info_guide {
  margin-left: 49px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  color: #7D7D7D;
}

.history_content_list::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari */
}

.history_content_list {
  overflow-y: scroll;
  /* сохраняем скролл */


  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE и Edge */
  margin-top: 65px;
  width: 1318px;
  height: 568px;
  overflow-y: auto;

}

.history_interactive {
  background-color: #F7F7F7;
  border-radius: 26px;
  ;
  position: relative;
  width: 100%;
  height: 269px;
  ;
  margin-bottom: 30px;
}

/* Убираем нижний отступ у последнего элемента */
.history_content_list>div:last-child .history_interactive {
  margin-bottom: 0;
}

.history_header {
  position: relative;
  height: 90px;
  ;
  margin-left: 35px;
  ;
  display: flex;
  align-items: center;
  width: 950px;

}

.history_info {
  margin-top: 11px;
  display: grid;
  flex-direction: column;
  margin-left: 49px;
  ;
  gap: 29px;
  ;
  width: 950px;
  height: 119px;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  letter-spacing: 1px;
  ;
}

.history_date-fon {

  background-color: #853CFF;
  border-radius: 68px;


}

.history_date {
  padding-left: 15px;
  width: 210px;
  color: white;
  text-align: left;
  font-family: 'Work Sans';
  font-weight: 700;
  font-size: 36px;
  ;

  ;

}

.history_title {
  margin-left: 18px;
  ;
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 32px;
  ;
  vertical-align: middle;
  letter-spacing: 1px;
  ;
}

.interactive_info {}

#history_line {
  position: absolute;
  left: 208px;
  ;
  top: 70px;
}

/* Popup Styles */
/* Popup Styles */
/* Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  /* Тёмный фон для затемнения */
  z-index: 999;
  /* Модальное окно поверх контента */
  display: flex;
  justify-content: center;

}

.popup {
  margin-top: 360px;
  background: white;
  border-radius: 35px;
  width: 818px;
  height: 438px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  position: relative;
}

.popup-header {
  position: relative;
}

.popup-header-text {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 36px;
  letter-spacing: 1px;
  padding-top: 48px;
  margin-left: 146px;
  ;
}

.popup-close {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
  font-size: 30px;
  color: #aaa;
}

.popup-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 34px;
  margin-top: 62px;
}

.popup-option {
  margin-left: 51px;
  ;
  display: flex;
  align-items: center;
  font-size: 18px;

  cursor: pointer;
  position: relative;
}

.popup-option span {
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  position: relative;
  padding-left: 62px;
  ;
}

/* Радиокнопка скрыта, используем псевдоэлемент для отображения квадрата */
.popup-option input[type="radio"] {
  display: none;
  /* Скрываем стандартную радиокнопку */
}

/* Картинка квадрата */
.popup-option input[type="radio"]+span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 35px;
  height: 35px;
  background-image: url('/public/images/history/rect.svg');
  /* Картинка квадрата */
  background-size: cover;
  background-position: center;
  cursor: pointer;
}

/* Галочка по центру квадрата при выборе */
.popup-option input[type="radio"]:checked+span::after {
  content: '';
  position: absolute;
  top: 9px;
  left: 7px;
  ;

  width: 24px;
  height: 18px;
  background-image: url('/public/images/history/Vector_2.svg');
  /* Картинка с галочкой */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  /* Чтобы клик не блокировал взаимодействие с другими элементами */
}

/* Радиокнопка при фокусе */
.popup-option input[type="radio"]:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(133, 60, 255, 0.6);
  /* Тень при фокусе */
}

.popup-option span {
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-size: 32px;
  letter-spacing: 1px;
  ;
  position: relative;

}

.popup-footer {
  margin-top: 44px;
}

.popup-submit {
  margin-left: 292px;
  ;
  width: 233px;
  height: 62px;
  background-color: white;
  color: #853CFF;
  border: 3px solid #853CFF;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  border-radius: 5px;
  cursor: pointer;
  vertical-align: middle;
  letter-spacing: 1px;
  ;

}


.select_many_option {
  cursor: pointer;
  position: absolute;
  top: 94px;
  right: 60px;
  ;
}

.selectManyClass {
  width: 185px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #F0436C;
  background-color: #F0436C;
}

.selectManyDownload {
  position: absolute;
  cursor: pointer;
  width: 202px;
  height: 62px;
  border-radius: 5px;
  border: 1px solid #6AB23D;
  background-color: #6AB23D;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;
  vertical-align: middle;
  letter-spacing: 1px;
  ;
  color: white;
  bottom: 80px;
  right: 0px;
  ;
}


/* Скрываем стандартный чекбокс */
.custom-checkbox {}

/* Кастомный круглый чекбокс */
.select_many_option input[type="checkbox"] {
  position: absolute;
  top: 0px;
  right: 0px;
  ;
  height: 81px;
  width: 81px;



  border-radius: 50%;
  /* чтобы было круглое */

  /* Добавим фиолетовую рамку */
  border: 4px solid #853CFF;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: white;
  cursor: pointer;
  outline: none;
  background-color: #F7F7F7;
  /* Плавные переходы */
  transition: all 0.3s ease;
}

/* Для того чтобы радио выглядело как радио с рамкой и менялось при выборе */
.select_many_option input[type="checkbox"]:checked {
  background-color: #853CFF;
  box-shadow: 0 0 0 3px #853CFF inset;
  background-image: url('/public/images/history/pick.svg');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}


/* Добавляем стиль при фокусе на чекбоксе */
.select_many_option input[type="checkbox"]:focus+span::before {
  outline: none;
  box-shadow: 0 0 5px rgba(133, 60, 255, 0.6);
}
</style>
