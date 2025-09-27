<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'

// для маршрутизации
const route = useRouter();
// подтверждения рассылки
const showPopup = ref(false);

// текст для рассылки - string
const messageText = ref("")
//для выбора участников интерактивов, кому будет отослано сообщение - массив id
const selectedInteractives = ref([]);
// флаг для смены кнопок: выбрать интерактива\ отмена
const selectMany = ref(false);


//функция для вызова попапа с подтверждением отправки сообщения
function openPopupManySelect() {
    showPopup.value = true;
}
// функция для закрытия попапа с подтверждением отправки сообщения
function closePopup() {
    showPopup.value = false;
    selfSendButton.value = false
}

// для смены кнопок, и очистки массива с выбранными интерактивами, если нажал отмена
function selectManyOption() {
    selectMany.value = !selectMany.value;
    if (!selectMany.value) {
        selectedInteractives.value = [];
    }
}

// добавляет id: string, в массив выбранных интерактивов для рассылки
function toggleInteractiveSelection(id) {
    const index = selectedInteractives.value.indexOf(id);
    if (index === -1) {
        selectedInteractives.value.push(id);
    } else {
        selectedInteractives.value.splice(index, 1);
    }
    console.log(selectedInteractives)
}
// флажок для ограничения отправки, чтоб только одно сообщение за раз
const isSending = ref(false);

// асинхронная функция для отправки рассылки участникам: запрос к api, проверки
async function submitBroadcasts() {
    if (isSending.value) return;
    isSending.value = true;
    if (selectedInteractives.value.length > 0) {
        if (!messageText.value || messageText.value.trim() === "") {
            window.Telegram.WebApp.showAlert(`Вы не набрали текст для сообщения!`);
            closePopup()
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
    isSending.value = false;
    if (window.Telegram?.WebApp?.expand) {
        setTimeout(() => {
            Telegram.WebApp.requestFullscreen()
        }, 0);
    }
}

// асинхронная функция для отправки рассылки себе(тестовое): запрос к api, проверки, показ алертов
async function submitSelfBroadcasts() {
    if (isSending.value) return;
    isSending.value = true;
    if (!messageText.value || messageText.value.trim() === "") {
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
            closePopup()
            window.Telegram.WebApp.showAlert(`Ваше сообщение успешно отправлено!`);


        } catch (error) {
            window.Telegram.WebApp.showAlert(`Ошибка при отправке сообщения`);
        }
    }

    isSending.value = false;
    if (window.Telegram?.WebApp?.expand) {
        setTimeout(() => {
            Telegram.WebApp.requestFullscreen()
        }, 0);
    }
}

//данные для проверки, что telegram подгрузил данные о пользователе: для запросов и т.д.
const webApp = ref(null)

const userId = ref(null)
const props = ref(null)
const isReady = ref(false)

const TEXT_MESSAGE_KEY = 'broadcasts_text_message'
const INTERACTIVES_KEY = 'broadcasts_interactives'
const SELECT_MANY_KEY = 'broadcasts_select_many'
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const savedMessage = loadFromDeviceStorage(TEXT_MESSAGE_KEY);
    if (savedMessage !== null) {
      messageText.value = savedMessage;
    }

    const savedSelect = loadFromDeviceStorage(SELECT_MANY_KEY);
    if (typeof savedSelect === 'boolean') {
      selectMany.value = savedSelect;
    }

    const savedInteractives = loadFromDeviceStorage(INTERACTIVES_KEY);
    if (Array.isArray(savedInteractives)) {
      if (savedInteractives.length > 0 && typeof savedInteractives[0] === 'object') {
        selectedInteractives.value = savedInteractives.map(item => Number(item.id));
      } else {
        selectedInteractives.value = savedInteractives.map(Number);
      }
    } else {
      selectedInteractives.value = [];
    }

    if (selectedInteractives.value.length === 0) {
      selectMany.value = false;
    }

    webApp.value = window.Telegram.WebApp;
      //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
    const { $telegram } = useNuxtApp();
    userId.value = $telegram.initDataUnsafe.value?.user?.id;

    const data = await useFetch('/api/reports/preview', {
      query: {
        telegram_id: userId.value
      },
    });

    props.value = data;
    isReady.value = true;
  }
});

// функция для смены цвета фона
onMounted(() => {
    document.body.classList.add('broadcasts-background');
});
// функция для смены цвета фона
onUnmounted(() => {
    document.body.classList.remove('broadcasts-background');
});
// флаг для подтверждения выхода со страницы
const showConfirmPopup = ref(false)
// поп ап для подтверждения выхода со страницы
function handleBackClick() {
    showConfirmPopup.value = true
}
// флажок
const selfSendButton = ref(false)
// функция для показа кнопки отправки рассылки только себе
function handleSelfSend() {
    selfSendButton.value = true;
    openPopupManySelect();
}
// функция для выхода в главное меню
async function confirmBack(save) {
    if (save) {

        showConfirmPopup.value = false
        route.push('/leader/main_menu')
        clearDeviceStorage(SELECT_MANY_KEY)
        clearDeviceStorage(TEXT_MESSAGE_KEY)
        clearDeviceStorage(INTERACTIVES_KEY)
    } else {
        showConfirmPopup.value = false

    }
}

watch(messageText, (newMessageText) => {
    saveToDeviceStorage(TEXT_MESSAGE_KEY, newMessageText)
})
watch(selectMany, (newSelectMany) => {
    saveToDeviceStorage(SELECT_MANY_KEY, newSelectMany)
})
watch(selectedInteractives, (newSelectedInteractives) => {
    saveToDeviceStorage(INTERACTIVES_KEY, newSelectedInteractives);
}, { deep: true });


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
                                <button v-if="!selectMany" class="selectManyDownload" @click="handleSelfSend()">
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
                                        v-model="selectedInteractives" />

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
                <div class="broadcasts_popup-text" v-if="selfSendButton">Вы хотите отправить сообщение только себе?
                </div>
                <div class="broadcasts_popup-buttons">
                    <button class="broadcasts_popup-btn confirm" @click="submitBroadcasts"
                        v-if="!selfSendButton">Да</button>
                    <button class="broadcasts_popup-btn confirm" @click="submitSelfBroadcasts"
                        v-if="selfSendButton">Да</button>
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
@import url("~/assets/css/broadcasts/broadcasts.scss");
</style>