<script setup lang="ts">
const participants = ref([
    { username: "Иванов Иван Сергеевич", participant_id: "1", is_hidden: false, is_blocked: false },
    { username: "Петров Петр Петрович", participant_id: "2", is_hidden: true, is_blocked: false },
    { username: "Сидоров Сидор Сидорович", participant_id: "3", is_hidden: false, is_blocked: true },
    { username: "Кузнецов Алексей Андреевич", participant_id: "4", is_hidden: false, is_blocked: false },
    { username: "Смирнова Анна Олеговна", participant_id: "5", is_hidden: true, is_blocked: true },
    { username: "Попов Дмитрий Сергеевич", participant_id: "6", is_hidden: false, is_blocked: false },
    { username: "Васильева Мария Ивановна", participant_id: "7", is_hidden: true, is_blocked: false },
    { username: "Новиков Артем Павлович", participant_id: "8", is_hidden: false, is_blocked: true },
    { username: "Федорова Екатерина Ильинична", participant_id: "9", is_hidden: false, is_blocked: false },
    { username: "Морозов Николай Викторович", participant_id: "10", is_hidden: true, is_blocked: true },
    { username: "Волков Сергей Анатольевич", participant_id: "11", is_hidden: false, is_blocked: false },
    { username: "Алексеев Максим Игоревич", participant_id: "12", is_hidden: true, is_blocked: false },
    { username: "Лебедева Ольга Сергеевна", participant_id: "13", is_hidden: false, is_blocked: true },
    { username: "Семенов Роман Евгеньевич", participant_id: "14", is_hidden: false, is_blocked: false },
    { username: "Егорова Татьяна Викторовна", participant_id: "15", is_hidden: true, is_blocked: true },
    { username: "Козлов Андрей Николаевич", participant_id: "16", is_hidden: false, is_blocked: false },
    { username: "Никитина Юлия Андреевна", participant_id: "17", is_hidden: true, is_blocked: false },
    { username: "Орлов Денис Сергеевич", participant_id: "18", is_hidden: false, is_blocked: true },
    { username: "Григорьева Анастасия Павловна", participant_id: "19", is_hidden: false, is_blocked: false },
    { username: "Юрий Борисович Мельников", participant_id: "20", is_hidden: true, is_blocked: true },
    { username: "Михаил Петрович Воронов", participant_id: "21", is_hidden: false, is_blocked: false },
    { username: "Беляева Дарья Сергеевна", participant_id: "22", is_hidden: true, is_blocked: false }
]);
//сортируем в порядке очереди - участник имеющий больший id зашел позже - выводим его выше в таблице
const sortedParticipants = computed(() =>
    [...participants.value].sort((a, b) => Number(b.participant_id) - Number(a.participant_id))
);
function toggleHidden(id: string) {
    const participant = participants.value.find(p => p.participant_id === id);
    if (participant) {
        participant.is_hidden = !participant.is_hidden;
    }
}
function banParticipant(id: string) {
    const participant = participants.value.find(p => p.participant_id === id);
    if (participant?.is_blocked) return
    showBan.value = true
}
const showBan = ref(false)
</script>

<template>
    <div :class="$style.moderation">
        <div :class="$style.moderation__header">
            <div :class="$style.moderation__goback">
                <img src="/public/images/moderation/goback.svg">
                <span>Назад</span>
            </div>
            <img src="/public/images/logo.svg" :class="$style.moderation__logo" />

        </div>
        <div :class="$style.moderation__block">
            <span :class="$style.moderation__block_header">
                Модерация участников
            </span>
            <div class="users_form_finder_finder" :class="$style.users_form_finder_finder">
                <img src="/public/images/history/finder.svg" class="users_form_input-icon"
                    :class="$style['users_form_input-icon']">

                <input type="text" placeholder="Поиск участников" class="users_form_search-input" maxlength="32"
                    :class="$style['users_form_search-input']">
            </div>
            <div :class="$style.moderation__list">
                <div :class="$style.moderation__list_header">
                    <span>
                        №
                    </span>
                    <span>Никнейм</span>
                    <span>
                        Модерация
                    </span>
                </div>
                <div v-for="(participant, index) in sortedParticipants" :key="participant.participant_id"
                    :class="$style.moderation__list_body" :style="{
                        backgroundColor: Number(participant.participant_id) % 2 === 0
                            ? '#F5F5F5'
                            : '#FFFFFF'
                    }">
                    <span>
                        {{ index + 1 }}
                    </span>
                    <div>
                        <img :src="participant.is_hidden ? '/images/moderation/hide_name.svg' : '/images/moderation/open_name.svg'"
                            @click="toggleHidden(participant.participant_id)" />
                        <span>{{ !participant.is_hidden ? '•••' : participant.username
                            }}</span>
                    </div>
                    <span :style="{
                        color: participant.is_blocked ? '#FFFFFF' : '#F0436C',
                        backgroundColor: participant.is_blocked ? '#F0436C' : '#F0436C4D',
                        cursor: participant.is_blocked ? 'default' : 'pointer'

                    }" @click="banParticipant(participant.participant_id)">
                        {{ participant.is_blocked ? 'Заблокирован' : 'Заблокировать' }}
                    </span>
                </div>
            </div>
        </div>
        <div v-if="showBan" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <img src="/images/moderation/close_popup.svg" @click="showBan = false" />
                <div class="settings_popup-text">
                    Вы уверены, что хотите заблокировать <br /> участника?
                </div>

                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn cancel delete" @click="showBan = false">
                        Отмена
                    </button>
                    <button class="settings_popup-btn confirm delete">
                        Заблокировать
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style module lang="scss">
:root {
    --app-height: 100dvh;
}

.moderation {
    overflow-x: hidden;
    height: var(--app-height);
    width: 100dvw;
    display: flex;
    flex-direction: column;
    align-items: center;


    &__header {
        background-color: #853CFF;
        height: calc(71/844*var(--app-height));
        width: 100dvw;
        display: flex;
        align-items: center;
    }

    &__logo {
        height: calc(50/832*var(--app-height));
        width: calc(123/1280*100dvw);
        margin-left: auto;
        margin-right: calc(77/1280*100dvw);
    }

    &__goback {
        display: flex;
        align-items: center;
        gap: calc(5/1280*100dvw);
        margin-top: auto;
        margin-bottom: calc(5/832*var(--app-height));
        height: calc(24/832*var(--app-height));
        margin-left: calc(27/1280*100dvw);
        cursor: pointer;

        &>span {
            color: #FFFFFF;
            font-family: "Lato", sans-serif;
            font-weight: 500;
            font-style: Medium;
            font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
            line-height: 120%;
            letter-spacing: 1%;
            vertical-align: middle;

        }

        &>img {
            height: calc(18/832*var(--app-height));
            width: calc(10/1280*100dvw);
        }
    }

    &__block {
        margin-top: calc(34/832*var(--app-height));
        width: calc(1056/1280*100dvw);

        &_header {
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-style: Regular;
            font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
            line-height: 120%;
            letter-spacing: 1%;
            vertical-align: middle;
            color: #1D1D1D;
            height: calc(18/832*var(--app-height));
        }
    }

    &__list {
        margin-top: calc(20/832*var(--app-height));
        min-height: calc(294/832*var(--app-height));
        width: calc(1056/1280*100dvw);
        background-color: #FFFFFF;
        overflow: hidden;
        margin-bottom: calc(34/832*var(--app-height));
        ;

        &_header {
            background-color: #D4BEF9;
            height: calc(42/832*var(--app-height));
            border-top-left-radius: calc(14/832*var(--app-height));
            border-top-right-radius: calc(14/832*var(--app-height));
            display: flex;
            align-items: center;

            padding-left: calc(20/1280*100dvw);

            &>span {
                font-family: "Lato", sans-serif;
                font-weight: 400;
                font-style: Regular;
                font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
                letter-spacing: 1%;
                vertical-align: middle;
                white-space: nowrap;
                display: flex;
                align-items: center;

            }

            >span:nth-child(1) {
                height: calc(24/832*var(--app-height));
                width: calc(19/1280*100dvw);
            }

            >span:nth-child(2) {
                height: calc(24/832*var(--app-height));
                width: calc(69/1280*100dvw);
                margin-left: calc(60.5/1280*100dvw);

            }

            >span:nth-child(3) {
                height: calc(24/832*var(--app-height));
                width: calc(87/1280*100dvw);
                margin-left: auto;
                margin-right: calc(31/1280*100dvw);
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        &_body {
            padding-left: calc(22.5/1280*100dvw);
            display: flex;
            align-items: center;
            background-color: #D4BEF9;
            height: calc(42/832*var(--app-height));
            border-bottom: 2px solid #F5F5F5;
            border-left: 2px solid #F5F5F5;
            border-right: 2px solid #F5F5F5;

            &:last-child {
                border-bottom: none;
                border-bottom-left-radius: calc(14/832*var(--app-height));
                border-bottom-right-radius: calc(14/832*var(--app-height));
            }

            & span {
                font-family: "Lato", sans-serif;
                font-weight: 400;
                font-style: Regular;
                font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
                letter-spacing: 1%;
                vertical-align: middle;
                white-space: nowrap;
                display: flex;
                align-items: center;

            }

            &>div {
                display: flex;
                align-items: center;
                height: calc(24/832*var(--app-height));

                margin-left: calc(33/1280*100dvw);

                &>img {
                    cursor: pointer;
                    height: calc(18/832*var(--app-height));
                    width: calc(18/1280*100dvw);
                }

                &>span {
                    margin-left: calc(12/1280*100dvw);
                }
            }

            >span:nth-child(1) {
                height: calc(14/832*var(--app-height));
                width: calc(14/1280*100dvw);
            }



            >span:nth-child(3) {
                height: calc(27/832*var(--app-height));
                width: calc(110/1280*100dvw);
                margin-left: auto;
                margin-right: calc(20/1280*100dvw);
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: calc(17/832*var(--app-height));
                font-size: clamp(10px, calc(14 / 1280 * 100dvw), 28px);
                background-color: #F0436C4D;
                color: #F0436C;
                border-radius: calc(30/1280*100dvw);
                font-family: "Lato", sans-serif;
                font-weight: 400;
                font-style: normal;
                letter-spacing: 1%;

            }
        }
    }
}

.users_form_finder_finder {
    margin-top: calc(20/832*var(--app-height));
    position: relative;
    display: flex;
    align-items: center;
}

.users_form_search-input {
    width: calc(765 / 1280 * 100dvw);
    height: calc((39 / 832) * 100dvh);
    line-height: calc((39 / 832) * 100dvh);
    color: #1D1D1D !important;
    border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;
    border-radius: calc((8 / 832)*100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    display: flex;
    align-items: center;
    padding-left: calc((50 / 1280) * 100dvw);
    box-sizing: border-box;
}

.users_form_search-input::placeholder {
    line-height: calc((39 / 832) * 100dvh);
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    color: #A9A9A9;
}

.users_form_input-icon {
    position: absolute;
    left: calc((17 / 1280) * 100dvw);
    top: 50%;
    transform: translateY(-50%);
    width: calc((17/1280) * 100dvw);
    height: calc((17/832) * 100dvh);
    pointer-events: none;
}
</style>

<style>
.settings_popup-overlay {
    font-family: "Lato", sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #00000052;
    display: flex;
    justify-content: center;
    z-index: 1000;

}

.settings_popup-content {
    margin-top: calc((273/832)*100dvh);
    background: white;
    width: calc((524 / 1280) * 100dvw);
    height: calc((173 / 832) * 100dvh);
    border-radius: calc((18/832)*100dvh);
    box-sizing: border-box;
    position: relative;

}

.settings_popup-content>img {
    position: absolute;
    right: calc((20 / 1280) * 100dvw);
    top: calc((20 / 832) * 100dvh);
    width: calc((16 / 1280) * 100dvw);
    height: calc((16 / 832) * 100dvh);
    cursor: pointer;
}

.settings_popup-text {
    margin-top: calc((24/832)*100dvh) !important;
    margin-left: calc((20/1280)*100dvw) !important;
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 40px);
    letter-spacing: clamp(0.20px, calc((20 /100/ 1280) * 100dvw), 0.4px);
    ;
}

.settings_popup-text_ {
    height: calc((47/832)*100dvh);
    margin-top: calc((19/832)*100dvh) !important;
    margin-left: calc((20/1280)*100dvw) !important;
    line-height: calc((19.2 / 1280) * 100dvw);

    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    color: #7D7D7D;
    letter-spacing: clamp(0.10px, calc((16 /100/ 1280) * 100dvw), 0.32px);
    ;
    vertical-align: middle;

}

.settings_popup-buttons {
    margin-top: calc((20/832)*100dvh);
    margin-left: calc((221 / 1280) * 100dvw);
    display: flex;

}

.settings_popup-btn.confirm {
    margin-left: calc((10 / 1280) * 100dvw);
}

.settings_popup-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    height: calc((41/832)*100dvh);
    font-size: clamp(20px, calc((20 / 1280) * 100dvw), 40px);
    font-family: "Lato", sans-serif;
    border-radius: calc((8/832)*100dvh);
    cursor: pointer;
}

.settings_popup-btn.confirm {
    background-color: #6ab23d;
    border: calc((1.5/832)*100dvh) solid #6ab23d;
    color: white;
}

.settings_popup-btn.confirm:hover {
    background-color: #559130;
    border: calc((1.5/832)*100dvh) solid #559130;
}

.settings_popup-btn.cancel {
    background-color: #FFFFFF;
    border: calc((1.5/832)*100dvh) solid #853CFF;
    color: #853CFF;
}

.settings_popup-btn.cancel:hover {
    color: #FFFFFF;
    background-color: #AA77FF;
}

.settings_popup-btn.cancel.delete {
    width: calc((118 / 1280) * 100dvw);
    background-color: #FFFFFF;
    border: none;
    color: #7D7D7D;
}

.settings_popup-btn.cancel.delete:hover {
    color: #1D1D1D;
    border: calc((1.5/832)*100dvh) solid#1D1D1D;
}

.settings_popup-btn.confirm.delete {
    width: calc((155 / 1280) * 100dvw);
    background-color: white;
    border: calc((1.5/832)*100dvh) solid #F0436C !important;
    color: #F0436C;
}

.settings_popup-btn.confirm.delete:hover {
    background-color: #F0436C;
    color: white;
    border: calc((1.5/832)*100dvh) solid#F0436C;
}
</style>