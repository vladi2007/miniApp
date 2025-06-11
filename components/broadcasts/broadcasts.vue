<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { downloadFile } from '@telegram-apps/sdk';
import { postEvent } from '@telegram-apps/sdk';

// Получаем данные через props
const route = useRouter();
const showPopup = ref(false);
const selectedOption = ref("");
const messageText = ref("")
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
    selfSendButton.value=false
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

async function submitBroadcasts() {
    if (selectedInteractives.value.length > 0) {
        if (messageText.value === "") {
            window.Telegram.WebApp.showAlert(`Вы не набрали текст для сообщения!`);
            closePopup()
            console.log(selectedInteractives.value)
        }
        else {
            try {
                const body = {
                    telegram_id: userId.value,
                    interactive_id: selectedInteractives.value.map(id => ({ id })),
                    text: messageText.value
                };

                const response = await fetch('/api/broadcasts/send', {
                    method: 'POST',
                    
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка сервера');
                }

                window.Telegram.WebApp.showAlert(`Ваше сообщение успешно отправлено!`);
                closePopup()

            } catch (error) {
                window.Telegram.WebApp.showAlert(`Ошибка при отправке сообщения`);
            }
        }

    }

    else {
        window.Telegram.WebApp.showAlert(`Выберите хотя бы один интерактив для формирования рассылки!`);
        closePopup()
    }
    if (window.Telegram?.WebApp?.expand) {
        setTimeout(() => {
            Telegram.WebApp.requestFullscreen()
        }, 0);
    }
}
async function submitSelfBroadcasts() {
    
        if (messageText.value === "") {
            window.Telegram.WebApp.showAlert(`Вы не набрали текст для сообщения!`);
            closePopup()
        }
        else {
            try {
                const body = {
                    telegram_id: userId.value,
                    text: messageText.value
                };

                const response = await fetch('/api/broadcasts/selfsend', {
                    method: 'POST',
                    
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Ошибка сервера');
                }

                window.Telegram.WebApp.showAlert(`Ваше сообщение успешно отправлено!`);
                closePopup()

            } catch (error) {
                window.Telegram.WebApp.showAlert(`Ошибка при отправке сообщения`);
            }
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
    document.body.classList.add('broadcasts-background');
});
onUnmounted(() => {
    document.body.classList.remove('broadcasts-background');
});
const showConfirmPopup = ref(false)
function handleBackClick() {
    showConfirmPopup.value = true
}
function handleSelfSend() {
  selfSendButton.value = true;
  openPopupManySelect();
}
const selfSendButton =ref(false)
async function confirmBack(save ) {
  if (save) {
    
    showConfirmPopup.value = false
      route.push('/leader/main_menu')
  } else {
    showConfirmPopup.value = false
   
  }
}
</script>

<template>
    <div class="broadcasts_fon" v-if="isReady">

        <div class="broadcasts">
            <div class="broadcasts_logo">
                <img src="/images/main_menu/logo.svg" id="broadcasts_nav_bar_logo" />
            </div>
            <div class="broadcasts_content-fon">
                <div class="broadcasts_content">
                    <div>
                        <button class="broadcasts_backButton" @click="handleBackClick">
                            Вернуться
                        </button>
                    </div>
                    <div class="broadcasts_content_menu">
                        <div class="broadcasts_menu_info_header">
                            Рассылка участникам интерактива
                        </div>
                        <div class="broadcasts_content_menu_info">
                            <img src="/images/history/history.svg" id="broadcasts_menu_info" />
                            <div class="broadcasts_content_menu_info_guide">
                                Вы можете отослать материалы для участников интерактива в боте<br />
                                Доступна функция рассылки участникам нескольких интерактивов.<br />
                                Вы можете отправить сообщение сначала только себе для проверки корректности
                            </div>

                            
                        </div>
                        <div class="broadcasts_message_text">

                            <div class="broadcasts_message_text_button">
                                <div>Прикрепить файл</div>
                            </div>
                            <label><textarea v-model="messageText" maxlength="4000"
                                    placeholder="Введите сообщение для участников"
                                    class="broadcasts_message_text_input" />
                            </label>
                            <div class="pick_button">
                                <button v-if="selectMany" class="selectManyDownload" @click="openPopupManySelect()">
                                    Отправить участникам
                                </button>
                                <button v-if="!selectMany" class="selectManyDownload" @click = "handleSelfSend()">
                                    Отправить только себе
                                </button>
                                <button class="broadcasts_content_menu_info_button" @click="selectManyOption()"
                                    :class="{ selectManyClass: selectMany, 'hoverable-select': !selectMany, 'hoverable-select_red': selectMany }">
                                    {{ !selectMany ? "Выбрать" : "Отмена" }}
                                </button>
                            </div>

                        </div>
                        
                        
                    </div>

                    <div class="broadcasts_content_list">
                        <div v-for="interactive in props.data.interactives_list" :key="interactive.interactive_id">
                            <div class="broadcasts_interactive">
                                <div class="broadcasts_header">
                                    <div class="broadcasts_date-fon">
                                        <div class="broadcasts_date">{{ interactive.date_completed }}</div>
                                    </div>
                                    <div class="broadcasts_title">{{ interactive.title }}</div>
                                    <img src="/images/history/Vector_109.svg" id="broadcasts_line" />
                                </div>

                                <div class="broadcasts_info">
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
        <div class="broadcasts_popup-overlay" v-if="showPopup">
            <div class="broadcasts_popup-content">
                <div class="broadcasts_popup-text" v-if="!selfSendButton">Вы точно хотите сделать рассылку?</div>
                <div class="broadcasts_popup-text" v-if="selfSendButton">Вы хотите отправить сообщение только себе?</div>
                <div class="broadcasts_popup-buttons">
                    <button class="broadcasts_popup-btn confirm" @click="submitBroadcasts" v-if="!selfSendButton">Да</button>
                    <button class="broadcasts_popup-btn confirm" @click="submitSelfBroadcasts" v-if="selfSendButton">Да</button>
                    <button class="broadcasts_popup-btn cancel" @click="closePopup">Нет</button>
                </div>
            </div>
        </div>
        <div v-if="showConfirmPopup" class="broadcasts_edit_popup-overlay">
            <div class="broadcasts_edit_popup-content">
                <div class="broadcasts_edit_popup-text">Вы действительно хотите вернуться на главное меню?
                  
                </div>
                <div class="broadcasts_edit_popup-actions">
                    <button @click="confirmBack(true)" class="broadcasts_edit_popup-btn save">Да</button>
                    <button @click="confirmBack(false)" class="broadcasts_edit_popup-btn cancel">Нет</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.broadcasts_edit_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(29, 29, 29, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.broadcasts_edit_popup-content {
  background-color: white;
  border-radius: 10px;
  padding: 32px;
  width: 600px;
  text-align: center;
  font-family: 'Lato', sans-serif;
}

.broadcasts_edit_popup-text {
  font-size: 24px;
  margin-bottom: 24px;
}

.broadcasts_edit_popup-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.broadcasts_edit_popup-btn {
  padding: 12px 32px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.broadcasts_edit_popup-btn.save {
  background-color: #6AB23D;
  color: white;
}

.broadcasts_edit_popup-btn.cancel {
  background-color: #F0436C;
  color: white;
}

.broadcasts_edit_popup-btn:hover {
  opacity: 0.9;
}
.broadcasts_popup-overlay {
    font-family: 'Lato', sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.broadcasts_popup-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.broadcasts_popup-text {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;

}

.broadcasts_popup-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.broadcasts_popup-btn {
    width: 120px;
    height: 45px;
    font-size: 20px;
    font-family: 'Lato', sans-serif;
    border-radius: 8px;
    cursor: pointer;
}

.broadcasts_popup-btn.confirm {
    background-color: #6AB23D;
    border: 2px solid #6AB23D;
    color: white;
}

.broadcasts_popup-btn.confirm:hover {
    background-color: #9AC57E;
    border: 2px solid #9AC57E;
}

.broadcasts_popup-btn.cancel {
    background-color: #F0436C;
    border: 2px solid #F0436C;
    color: white;
}

.broadcasts_popup-btn.cancel:hover {
    background-color: #DE7D94;
    border: 2px solid #DE7D94;
}

.broadcasts_message_text {

    display: flex;


    align-items: center;

    ;
}

.broadcasts_message_text_button {
    height: 62px;
    ;
    width: 229px;
    ;

    background-color: #853CFF;
    border: 1px solid #853CFF;
    border-radius: 5px;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    vertical-align: middle;
    color: white;
    cursor: pointer;
    text-align: center;
}

.broadcasts_message_text_button:hover {

    background-color: #AA77FF;
    border: 1px solid #AA77FF;
    border-radius: 5px;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    vertical-align: middle;
    color: white;
    cursor: pointer;
}

.broadcasts_message_text label {
    display: flex;
    flex-direction: column;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    vertical-align: middle;
    color: white;
    letter-spacing: 1px;
    ;
}

.broadcasts_message_text textarea {
    margin-top: 20px;
    height: 202px;
    ;
    margin-left: 36px;
    ;
    border-radius: 18px;
    ;
    border: 4px solid white;
    ;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    ;
    letter-spacing: 1px;
    ;

}

textarea {
    white-space: pre-wrap;
    /* сохраняет переводы строк и переносит при необходимости */
    word-break: break-word;
    resize: none;
}

.broadcasts_message_text_input {
    width: 800px;
    ;
    height: 100px;
    ;
}

body.broadcasts-background {
    padding-bottom: 42px;
    ;
    background-color: #A774FC;
}

.broadcasts_download {
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

.broadcasts_download:hover {
    background-color: #9AC57E;
    border: 1px #9AC57E;
}

.broadcasts_fon {

    background-color: #A774FC;
    height: 1359px;
    






}

.broadcasts {margin-bottom: 220px;;
    margin-bottom: 60px;
    width: 1360px;
    margin: 0 auto;
height: 1200px;
    padding-top: 12px;
}

.broadcasts_logo {
    width: 139px;
    ;
    margin-left: auto;
}

.broadcasts_content-fon {
    margin-top: 8px;
    width: 1360px;
    ;
    min-height: 1133px;
    
    background-color: white;
    border-radius: 40px;
    ;
}

.broadcasts_backButton {
    cursor: pointer;
    width: 229px;
    height: 62px;
    border-radius: 5px;
    background-color: white;
    color: #853CFF;
    border: 2px solid #853CFF;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
}

.broadcasts_backButton:hover {
    cursor: pointer;
    width: 229px;
    height: 62px;
    border-radius: 5px;
    background-color: #853CFF;
    color: white;
    border: 2px solid #853CFF;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
}

.broadcasts_content {
    padding-top: 20px;
    padding-left: 23px;

    padding-right: 19px;

    padding-bottom: 60px;

    display: grid;
    flex-direction: column;
}

.broadcasts_content_menu {

    margin-top: 65px;
    width: 1314px;
    height: 223px;
    ;
}

.broadcasts_content_menu_info {
   
    margin-top: 60px;
    position: relative;
    display: flex;
}

.pick_button {
    position: relative;
    margin-left: auto;
    margin-top:172px;
}

.broadcasts_content_menu_info_button {
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

.hoverable-select:hover {
    background-color: #AA77FF;
    color: white;
    border: 1px solid #AA77FF;
}

.hoverable-select_red:hover {
    background-color: #DE7D94;
    border: 1px solid #DE7D94;
}

.broadcasts_menu_info_header {
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 36px;

    vertical-align: middle;

}

#broadcasts_menu_info {
    position: absolute;
    top: 0;
    left: 0;
    ;
}

.broadcasts_content_menu_info_guide {
    margin-left: 49px;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    vertical-align: middle;
    color: #7D7D7D;
}

.broadcasts_content_list>div {
    margin-top: 20px;
    ;

}

.broadcasts_content_list::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
}

.broadcasts_content_list {
    overflow-y: scroll;
    /* сохраняем скролл */


    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE и Edge */
    margin-top: 215px;
    width: 1318px;
    height: 588px;
    overflow-y: auto;
    

}

.broadcasts_interactive {
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
.broadcasts_content_list>div:last-child .broadcasts_interactive {
    margin-bottom: 0;
}

.broadcasts_header {
    position: relative;
    height: 90px;
    ;
    margin-left: 35px;
    ;
    display: flex;
    align-items: center;
    width: 950px;

}

.broadcasts_info {
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

.broadcasts_date-fon {

    background-color: #853CFF;
    border-radius: 68px;


}

.broadcasts_date {

    width: 210px;
    color: white;
    text-align: center;
    font-family: 'Work Sans';
    font-weight: 700;
    font-size: 36px;
    ;

    ;

}

.broadcasts_title {
    margin-left: 17px;
    ;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 32px;
    ;
    vertical-align: middle;
    letter-spacing: 1px;
    ;
}

.interactive_info {}

#broadcasts_line {
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
    background-image: url('/public/images/history/circle.svg');
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
    left: 5px;
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
    border: 2px solid #853CFF;
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    font-size: 24px;
    border-radius: 5px;
    cursor: pointer;
    vertical-align: middle;
    letter-spacing: 1px;
    ;

}

.popup-submit:hover {
    margin-left: 292px;
    ;
    width: 233px;
    height: 62px;
    background-color: #853CFF;
    color: white;
    border: 2px solid #853CFF;
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

.selectManyDownload:hover {
    background-color: #9AC57E;
    border: 1px solid #9AC57E;
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

.select_many_option input[type="checkbox"]:hover {
    background-color: #AA77FF;
    border-color: #853CFF;
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

.popup-option:hover input[type="radio"]+span::before {
    background-image: url('/public/images/history/circle_hover.svg');
}
</style>
