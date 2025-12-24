<script setup>
let groups = {
    "all": 'Все',
    "admins": "Администраторы",
    "leader": "Ведущие"
}
const users = ref([
    {
        id: 1,
        name: 'Новиков Максим Юрьевич',
        role: 'Создатель организации'
    },
    {
        id: 2,
        name: 'Корелина Дарья',
        role: 'Администратор'
    },
    {
        id: 3,
        name: 'Жилин Юрий',
        role: 'Ведущий'
    },
    {
        id: 4,
        name: 'Мельников Борис Юрьевич',
        role: 'Ведущий'
    },

])
const activeGroup = ref('all')
const isOpen = ref(false)
const userId = ref(0)
function toggleItemDropdown(id) {
    if (userId.value === id) {
        userId.value = null
    } else {
        userId.value = id
    }
}
function getDropdownIcon(id) {
    return userId.value === id 
        ? "/images/users/close_role.svg"
        : "/images/users/open_role.svg";
}
</script>
<template>
    <layout :active_nav="'users'">
        <div class='users_title'>
            Пользователи
        </div>
        <form class="users_form">
            <div class="users_form_finder_finder">
                <img src="/public/images/history/finder.svg" class="users_form_input-icon" />

                <input type="text" placeholder="Поиск интерактива" class="users_form_search-input" maxlength="32" />
            </div>
            <div class="users_form_button">
                <div>
                    Добавить
                </div>
                <img src="/public//images/users/add.svg"></img>

            </div>
        </form>
        <div class="users_list">
            <div class="users_list_groups">
                <div v-for="(value, key) in groups" @click="activeGroup = key" class="group">
                    <div v-if="activeGroup == key" class="group_active"></div>
                    <div class="group_value" :style="{ fontWeight: activeGroup === key ? 600 : 400 }">{{ value }}</div>
                </div>
            </div>
            <div class='users_list_list_column'>


                <div class="users_list_list">
                    <div class="users_list_list_header" style="color: #853CFF;">
                        <span class='users_list_list_name'>
                            Имя
                        </span>
                        <span class="users_list_list_role">
                            Роль
                        </span>

                    </div>
                    <div class="users_list_list_line"></div>
                </div>
                <div class="users_list_list_list" v-for="user in users" :key=user.id>
                    <div class="users_list_list_header">
                        <span class='users_list_list_name'>
                            {{ user.name }}
                        </span>
                        <div :class="{ users_list_list_role: user.role !== 'Создатель организации' }"
                            :style="{ cursor: user.role !== 'Создатель организации' ? 'pointer' : 'default' }"
                            @click=" user.role !== 'Создатель организации' && toggleItemDropdown(user.id)">


                            <div style="color:#7D7D7D;"
                                :class="{ users_list_list_role_margin: user.role !== 'Создатель организации' }">
                                {{ user.role }}
                            </div>

                            <img class="open_role" v-if="user.role !== 'Создатель организации'"
                               :src="getDropdownIcon(user.id)"
                                 />

                            <div class="users_list_item-dropdown-options" v-if="userId === user.id"
                                style=" z-index: 10001 !important;">
                                <div class="users_list_item-dropdown-option"
                                    style="margin-top:calc((17 / 832) * 100dvh)"
                                    @click=" users.find(u => u.id === user.id).role = 'Администратор'">
                                    <span>Выдать роль “Администратор”</span>
                                </div>
                                <div class="users_list_item-dropdown-option" style="margin-top:calc((4 / 832) * 100dvh)"
                                    @click=" users.find(u => u.id === user.id).role = 'Ведущий'">
                                    <span>Выдать роль “Ведущий”</span>
                                </div>
                            </div>
                        </div>
                        <img class="kick_user" src="/public/images/users/kick_user.svg"
                            v-if="user.role !== 'Создатель организации'" />

                    </div>
                    <div class="users_list_list_line"></div>

                </div>
            </div>
        </div>

    </layout>
</template>
<style>
@media (max-width:1918px),
(max-height:1078px) {
    .users_title {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        margin-top: calc((25 / 832) * 100dvh);
    }

    .users_form {
        margin-top: calc((20 / 832) * 100dvh);
        display: flex;

    }

    .users_list {
        margin-top: calc((12 / 832) * 100dvh);
        display: grid;
        grid-template-columns: calc(231/1280*100dvw) calc(805/1280*100dvw);
        gap: calc(20/1280*100dvw)
    }

    .users_list_groups {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc(231 / 1280 * 100dvw);
        height: calc((107 / 832) * 100dvh) !important;
        padding-left: calc(10 / 1280 * 100dvw);
        padding-top: calc((15 / 832) * 100dvh);
        border: calc(1.5/832*100dvh)solid #E0E0E0;
        border-radius: calc(8/832*100dvh);
    }

    .users_list_groups>div {
        height: calc((19 / 832) * 100dvh);
        margin-bottom: calc((10 / 832) * 100dvh);
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .group {
        position: relative;
    }

    .group_value {
        margin-left: calc(10 / 1280 * 100dvw);
    }

    .group_active {
        position: absolute;
        height: 100%;
        background-color: #853CFF;
        width: calc(2/1280*100dvw);
        border-radius: calc(2/832*100dvh);
    }


    .users_list_list {
        margin-top: calc((23 / 832) * 100dvh);
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

    }

    .users_list_list_list {
        color: #1D1D1D !important;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    }

    .users_list_list_header {
        margin-left: calc(18/1280*100dvw);
        display: flex;
        align-items: center;
        height: calc((46.13 / 832) * 100dvh) !important;
    }

    .users_list_list_header>div {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_list_list_name {
        width: calc(473/1280*100dvw);
    }

    .users_list_list_role {
        width: calc(146/1280*100dvw) !important;
    }

    .open_role {
        margin-left: calc(10/1280*100dvw);
        width: calc(16 / 1280 * 100dvw);
        height: calc((9 / 832) * 100dvh);
    }

    .kick_user {
        margin-left: calc(110/1280*100dvw);
        width: calc(24 / 1280 * 100dvw);
        height: calc((24 / 832) * 100dvh);
        cursor: pointer;
    }

    .users_list_list_role_margin {
        display: flex;
        width: calc(120/1280*100dvw) !important;
    }

    .users_list_list_line {
        background-color: #e9e9e9 !important;
        height: calc((1 / 832) * 100dvh) !important;
    }

    .users_form_finder_header {

        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        color: #1D1D1D;
    }

    .users_form_finder_finder {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_form_search-input {
        width: calc(231 / 1280 * 100dvw);
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
        width: calc((19/1280) * 100dvw);
        height: calc((19/1280) * 100dvw);
        pointer-events: none;
    }

    .users_form_button {
        box-sizing: border-box;
        width: calc((157/1280) * 100dvw) !important;
        height: calc((39/832) * 100dvh);
        background-color: #6AB23D;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: calc((10/1280) * 100dvw);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);

    }

    .users_form_button {
        margin-left: calc(20/1280*100dvw);
        border-radius: calc((5 / 832)*100dvh);
        cursor: pointer;
    }

    .users_form_button>div {}

    .users_form_button>img {
        width: calc((19/1280) * 100dvw);
        height: calc((19/832) * 100dvh);
    }

    .users_list_item-dropdown-options {
        position: absolute;
        top: calc(100% + calc(11/832)*100dvh);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: calc((310 / 1280) * 100dvw);
        height: calc((106 / 832) * 100dvh);
        border-radius: calc((14/832*100dvh));
        left: calc((-14 / 1280) * 100dvw);
        background: white;
        z-index: 665455;

    }

    .users_list_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        width: calc((298/1280) * 100dvw);
        height: calc((34 / 832) * 100dvh);
        padding-left: calc((8/1280) * 100dvw);

    }

    .users_list_item-dropdown-option:hover {
        border-radius: calc(7/832*100dvh);
        background-color: #DFDFDF !important;
    }

}

@media (min-width:1918px),
(min-height:1078px) {
    .users_title {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size:20px;
        letter-spacing: 0.2px;
        margin-top: 25px;
    }

    .users_form {
        margin-top: 20px;
        display: flex;

    }

    .users_list {
        margin-top: 12px;
        display: grid;
        grid-template-columns: 231px 805px;
        gap: 20px;
    }

    .users_list_groups {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;;
        letter-spacing: 0.16px;;
        width: 231px;
        height: 107px !important;
        padding-left: 10px;
        padding-top: 15px;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
    }

    .users_list_groups>div {
        height: 19px;
        margin-bottom: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .group {
        position: relative;
    }

    .group_value {
        margin-left: 10px;
    }

    .group_active {
        position: absolute;
        height: 100%;
        background-color: #853CFF;
        width: 2px;;
        border-radius: 2px;
    }


    .users_list_list {
        margin-top: 23px;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;;
        letter-spacing: 0.16px;;

    }

    .users_list_list_list {
        color: #1D1D1D !important;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;;
        letter-spacing: 0.16px;;
    }

    .users_list_list_header {
        margin-left: 18px;
        display: flex;
        align-items: center;
        height: 46.13px !important;
    }

    .users_list_list_header>div {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_list_list_name {
        width: 473px;
    }

    .users_list_list_role {
        width: 146px !important;
    }

    .open_role {
        margin-left: 10px;
        width: 16px;
        height: 9px;
    }

    .kick_user {
        margin-left: 110px;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .users_list_list_role_margin {
        display: flex;
        width: 120px !important;
    }

    .users_list_list_line {
        background-color: #e9e9e9 !important;
        height: 1px !important;
    }

    .users_form_finder_header {

        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;;
        letter-spacing: 0.16px;;
        color: #1D1D1D;
    }

    .users_form_finder_finder {
        position: relative;
        display: flex;
        align-items: center;
    }

    .users_form_search-input {
        width: 231px;
        height: 39px;
        line-height: 39px;
        color: #1D1D1D !important;
        border: 1.5px solid #E0E0E0;
        border-radius: 8px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;;
        letter-spacing: 0.16px;;
        display: flex;
        align-items: center;
        padding-left: 50px;
        box-sizing: border-box;
    }

    .users_form_search-input::placeholder {
        line-height: 39px;
        display: flex;
        align-items: center;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;;
        letter-spacing: 0.16px;;
        color: #A9A9A9;
    }

    .users_form_input-icon {
        position: absolute;
        left: 17px;
        top: 50%;
        transform: translateY(-50%);
        width: 19px;
        height: 19px;
        pointer-events: none;
    }

    .users_form_button {
        box-sizing: border-box;
        width: 157px !important;
        height: 39px;
        background-color: #6AB23D;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 20px;
        letter-spacing: 0.2px;;

    }

    .users_form_button {
        margin-left: 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    .users_form_button>div {}

    .users_form_button>img {
        width: 19px;
        height: 19px;
    }

    .users_list_item-dropdown-options {
        position: absolute;
        top: calc(100% + 11px);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: 310px;
        height: 106px;
        border-radius: 14px;
        left: -14px;
        background: white;
        z-index: 665455;

    }

    .users_list_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size: 20px;
        letter-spacing: 0.2px;;
        width: 298px;
        height: 34px;
        padding-left: 8px;

    }

    .users_list_item-dropdown-option:hover {
        border-radius: 7px;
        background-color: #DFDFDF !important;
    }
}

* {
    box-sizing: border-box;
}
</style>