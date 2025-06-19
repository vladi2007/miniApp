<script setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';


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
    selfSendButton.value = false
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
const isSending = ref(false);
async function submitBroadcasts() {
    if (isSending.value) return;
    isSending.value = true;
    if (selectedInteractives.value.length > 0) {
        if (messageText.value === "") {
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
async function submitSelfBroadcasts() {
    if (isSending.value) return;
    isSending.value = true;
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
const selfSendButton = ref(false)
async function confirmBack(save) {
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