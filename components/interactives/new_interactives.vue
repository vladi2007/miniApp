<script setup lang="ts">
const router = useRouter()
async function goTo(url: string) {
    router.push(url)
}

const finder = ref<string>("")

const isOpen = ref(false)
const selectedText = ref("Все")

const options = ["Все", "Проведенные", "Не проведенные"]

function toggleDropdown() {
    isOpen.value = !isOpen.value
}

function selectOption(option: string) {
    selectedText.value = option
    isOpen.value = false
}
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownRefsMore = ref<(HTMLElement | null)[]>([])

function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }

    // Проверяем все dropdownRefsMore
    if (openDropdownId.value !== null) {
        const clickedInsideAnyDropdown = dropdownRefsMore.value.some(ref =>
            ref && ref.contains(event.target as Node)
        )
        if (!clickedInsideAnyDropdown) {
            openDropdownId.value = null
        }
    }
}

// Функция для добавления ref в массив
function setDropdownRef(el: HTMLElement | null, index: number) {
    dropdownRefsMore.value[index] = el
}


// Добавляем и удаляем обработчик событий


// В onMounted добавь:
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
const is_empty_list = computed(() => {
    if (list.value.length > 0) {
        return false;
    } else {
        return true;
    }
})

const list = ref<any>([
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "1",
        participant_count: "10",
        is_conducted: true,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "2",
        participant_count: "210",
        is_conducted: false,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "3",
        participant_count: "2202",
        is_conducted: true,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "4",
        participant_count: "220",
        is_conducted: false,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "5",
        participant_count: "210",
        is_conducted: true,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "6",
        participant_count: "2202",
        is_conducted: false,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "7",
        participant_count: "220",
        is_conducted: true,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "8",
        participant_count: "210",
        is_conducted: false,
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "9",
        participant_count: "2202",
        is_conducted: true,
    },
])
const showPopup = ref(false);
const currentInteractiveId = ref<string | null>(null)
function Popup(id: string) {
    currentInteractiveId.value = id
    showPopup.value = true
}

// переход на редактирование, если пользователь хочет продублированный интерактив сразу изменить
function dublicate_interactive(id: string) {
    showPopup.value = false
    router.push(`/leader/duplicate/${id}`)
}

// переход на редактирование интерактива
function edit_interactive(id: string) {
    router.push(`/leader/edit/${id}`)
}
function start_interactive(id: string) {
    router.push(`/leader/${id}`)
}
const openDropdownId = ref<string | null>(null)
function toggleItemDropdown(id: string) {
    if (openDropdownId.value === id) {
        openDropdownId.value = null
    } else {
        openDropdownId.value = id
    }
}
</script>
<template>
    <div class="interactives">
        <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
        </div>
        <div class="nav">
            <div class="nav_main">
                О нас
            </div>
            <div :class="['active_nav', 'nav_interactives']">
                Интерактивы
            </div>
            <div :class="['nav_reports']" @click="goTo('/leader/history')">
                Отчеты
            </div>
            <div class="nav_broadcasts" @click="goTo('/leader/broadcasts')">
                Рассылка
            </div>
        </div>
        <div class="interactives_finder">
            <div class="interactives_finder_finder">
                <img src="/public/images/history/finder.svg" class="interactives_input-icon" />

                <input v-model="finder" type="text" placeholder="Поиск интерактива" class="interactives_search-input" />
            </div>
            <div class="interactives_create" @click="goTo('/leader/create_interactive')">
                Создать интерактив
            </div>
        </div>
        <div class="interactives_input-group_type" ref="dropdownRef">
            <div class="interactives_custom-dropdown" @click="toggleDropdown">
                <div class="interactives_custom-dropdown-selected">Фильтр</div>
                <div class="interactives_custom-arrow" :class="{ open: isOpen }">
                    <img src="/public/images/interactives/open.svg" v-if="isOpen" />
                    <img src="/public/images/interactives/close.svg" v-if="!isOpen" />
                </div>
            </div>

            <div class="interactives_custom-dropdown-options" v-if="isOpen">
                <div class="interactives_custom-dropdown-option-list">
                    <div class="interactives_custom-dropdown-option" v-for="(option, index) in options" :key="index"
                        @click.stop="selectOption(option)">
                        <img class="interactives_custom-dropdown-circle" src="/public/images/interactives/picked.svg"
                            v-if="selectedText === option" />
                        <img class="interactives_custom-dropdown-circle" src="/public/images/interactives/Ellipse.svg"
                            v-else />

                        <div class="interactives_custom-dropdown-text">{{ option }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="interactives_empty_list_info" v-if="is_empty_list">
            <img src="/public/images//history/finder_info.svg" />
            <div class="interactives_empty_list_info_h1">
                У Вас нет интерактивов
            </div>
            <div class="interactives_empty_list_info_h2">
                Создайте свой первый интерактив и он появится здесь
            </div>
        </div>
        <div class="interactives_list" v-if="!is_empty_list">
            <div class="interactives_list_header">
                <div class="interactives_list_header_title">
                    Название
                </div>
                <div class="interactives_list_header_date">
                    Дата
                </div>
                <div class="interactives_list_header_status">
                    Статус
                </div>
                <div class="interactives_list_header_count">
                    Количество участников
                </div>
            </div>
            <div class="interactives_list_list" v-for="(item, index) in list" :key="item.id">
                <div class="interactives_Line" v-if="index === 0" />
                <div class="interactives_list_list_item">
                    <div class="interactives_list_list_item_title">
                        {{ item.title }}
                    </div>
                    <div class="interactives_list_list_item_date">
                        {{ item.date_completed }}
                    </div>
                    <div class="interactives_list_list_item_status">
                        {{ item.is_conducted ? "Проведен" : "Не проведен" }}
                    </div>
                    <div class="interactives_list_list_item_count">
                        {{ item.participant_count }}
                    </div>
                    <div class="interactives_buttons">
                        <div class="interactives_leader_board" v-if="item.is_conducted" title="Показать лидерборд">
                            <img src="/images/interactives/leader_board.svg"
                                style="     height: calc((24/832) * 100dvh) !important;width: calc((24 / 1280) * 100dvw) !important;" />
                        </div>
                        <div class="interactives_dublicate" title="Дублировать интерактив" @click="Popup(item.id)">
                            <img src="/images/interactives/dublicate_2.svg"
                                style="     height: calc((24/832) * 100dvh) !important;width: calc((24 / 1280) * 100dvw) !important;" />
                        </div>

                        <div class="interactives_edit" title="Редактировать интерактив" v-if="!item.is_conducted"
                            @click="edit_interactive(item.id)">
                            <img src="/images/interactives/edit_2.svg"
                                style="     height: calc((17/832) * 100dvh) !important;width: calc((16 / 1280) * 100dvw) !important;" />
                        </div>
                        <div class="interactives_start" title="Запустить интерактив" v-if="!item.is_conducted"
                            @click="start_interactive(item.id)">
                            <img src="/images/interactives/start_2.svg"
                                style="     height: calc((17    /832) * 100dvh) !important;width: calc((12 / 1280) * 100dvw) !important;" />
                        </div>

                        <div class="interactives_list_list_item_actions" :ref="el => setDropdownRef(el, index)">
                            <div class="interactives_more_options" v-if="item.is_conducted"
                                @click="toggleItemDropdown(item.id)" title="Еще">
                                <img src="/images/interactives/more_options.svg"
                                    style="     height: calc((30/832) * 100dvh) !important;width: calc((30 / 1280) * 100dvw) !important;" />
                            </div>
                            <div class="interactives_item-dropdown-options" v-if="openDropdownId === item.id"
                                style=" z-index: 10001 !important;">
                                <div class="interactives_item-dropdown-option"
                                    style="  margin-top: calc((22/832)*100dvh);">
                                    <img src="/public/images/interactives/download.svg"
                                        class="interactives_item-dropdown-icon"
                                        style="     height: calc((24/832) * 100dvh) !important;width: calc((24 / 1280) * 100dvw) !important; margin-left: calc((24/1280)*100dvw);"  />
                                    <span style="margin-left: calc((9/1280)*100dvw);">Выгрузить отчет</span>
                                </div>
                                <div class="interactives_item-dropdown-option"
                                    style="  margin-top: calc((14/832)*100dvh);">
                                    <img src="/public/images/interactives/send.svg"
                                        class="interactives_item-dropdown-icon"
                                        style="     height: calc((24/832) * 100dvh) !important;width: calc((24 / 1280) * 100dvw) !important; margin-left: calc((24/1280)*100dvw);" />
                                    <span style="margin-left: calc((9/1280)*100dvw);">Отправить рассылку</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="interactives_Line" />
            </div>
            <div class="interactives_show_more">Показать еще</div>
        </div>
    </div>
</template>

<style>
.interactives_list_list_item_actions {
    position: relative;
}

.interactives {
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background-color: white;
    position: relative;
    overflow-x: hidden;
}

.header {
    width: 100dvw;
    height: calc((71 / 832) * 100dvh);
    background-color: #853CFF;
    display: flex;
    align-items: center;
}

#logo_header {
    width: calc((123/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
    margin-left: auto;
    margin-right: calc((40.29/1280) * 100dvw);
}

.nav {
    display: flex;
    gap: calc((20 / 1280) * 100dvw);
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((112 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    font-style: Medium;
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;

}

.nav>div:hover {
    color: #1D1D1D;
}
.nav >div{
    cursor: pointer;
}

.nav_main:not(.active_nav):hover::after,
.nav_interactives:not(.active_nav):hover::after,
.nav_reports:not(.active_nav):hover::after,
.nav_broadcasts:not(.active_nav):hover::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 0px;
    background-color: #853CFF;
}

.active_nav {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #1D1D1D;

    vertical-align: middle;
    display: grid;
    width: fit-content;
}

.active_nav::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    color: #1D1D1D !important;
    margin-top: 0px;
    background-color: #853CFF;
}

.interactives_finder {
    width: calc((1056/1280) * 100dvw);
    margin-left: calc((112 / 1280) * 100dvw);
    margin-top: calc((15 / 832) * 100dvh);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.interactives_finder_header {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
}

.interactives_finder_finder {
    position: relative;
    display: flex;
    align-items: center;
}

.interactives_search-input {
    width: calc((715/1280) * 100dvw);
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
}

.interactives_search-input::placeholder {
    line-height: calc((39 / 832) * 100dvh);
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    color: #A9A9A9;
}

.interactives_input-icon {
    position: absolute;
    left: calc((17 / 1280) * 100dvw);
    top: 50%;
    transform: translateY(-50%);
    width: calc((19/1280) * 100dvw);
    height: calc((19/1280) * 100dvw);
    pointer-events: none;
}

.interactives_create {cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6AB23D;
    border-radius: calc((5/832) * 100dvh);
    width: calc((261/1280) * 100dvw);
    height: calc((39 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: white;
}

.interactives_input-group_type {
    position: relative;
    z-index: 1000;
    margin-left: calc((112/1280)*100dvw);
    height: calc((47 / 832) * 100dvh);
    width: calc((159 / 1280) * 100dvw) !important;
}

.interactives_input-group_type select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: calc((47 / 832) * 100dvh);
    border-radius: calc((14/832)*100dvh);
    box-sizing: border-box;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
}

.interactives_input-group_row {
    display: flex;
    width: calc((159 / 1280) * 100dvw);
    height: calc((47 / 832) * 100dvh);
    align-items: center;
    border-radius: calc((14/832)*100dvh);
    background-color: #F3F3F3;
}

/* Кастомный выпадающий список */
.interactives_custom-dropdown {
    margin-top: calc(20/832*100dvh);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc((159 / 1280) * 100dvw);
    height: calc((47 / 832) * 100dvh);
    border-radius: calc((14/832)*100dvh);
    background-color: #F3F3F3;
    box-sizing: border-box;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    z-index: 999;
    letter-spacing: 0.1px;
    vertical-align: middle;
    box-sizing: border-box;
    padding-left: calc((25/1280)*100dvw);
    padding-right: calc((25/1280)*100dvw);
}

.interactives_custom-arrow {
    width: calc((16 / 1280) * 100dvw);
    height: calc((9 / 832) * 100dvh);
    display: flex;
}

/* Стили для списка - ИЗМЕНЕНИЯ ЗДЕСЬ */
.interactives_custom-dropdown-options {
    box-shadow: 0px 1px 13.8px 0px #00000040;
    border-radius: calc((8/832)*100dvh);
    width: calc((256 / 1280) * 100dvw) !important;
    height: calc((143 / 832) * 100dvh);
    margin-top: calc((10 / 832) * 100dvh);
    position: absolute;
    top: 100%;
    /* Позиционируем относительно родителя */
    left: 0;
    z-index: 9999;
    /* Увеличиваем z-index */
    background-color: white;
    /* Добавляем фон */
}

.interactives_custom-dropdown-option-list {
    margin-top: calc((25 / 832) * 100dvh);
    margin-left: calc((30 / 1280) * 100dvw);
    z-index: 10000;
    /* Увеличиваем z-index */
}

.interactives_custom-dropdown-options_header {
    font-family: "Lato", sans-serif;
    font-weight: 600;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    line-height: 120%;
    letter-spacing: 0.1px;
    vertical-align: middle;
    margin-top: calc((7 / 832) * 100dvh);
    margin-left: calc((41 / 1280) * 100dvw);
}

.interactives_custom-dropdown-selected {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
}

.interactives_custom-dropdown-option {
    display: flex;
    align-items: center;
    margin-top: calc((5 / 832) * 100dvh);
    height: calc((26 / 832) * 100dvh);
    cursor: pointer;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
}

.interactives_custom-dropdown-circle {
    width: calc((18 / 1280) * 100dvw);
    height: calc((18 / 832) * 100dvh);
    display: flex;
    cursor: pointer;
    justify-content: center;
}

.interactives_custom-dropdown-circle>img {
    width: calc((16 / 1280) * 100dvw);
    height: calc((16 / 832) * 100dvh);
}

.interactives_custom-dropdown-text {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
    margin-left: calc((12 / 1280) * 100dvw);
    display: flex;
    align-items: center;
}

.interactives_input-group_score {
    display: flex;
    align-items: center;
    margin-left: calc((58 / 1280) * 100dvw);
}

textarea:focus,
input:focus {
    border-color: none !important;
    box-shadow: none !important;
    outline: none !important;
}

.interactives_input-group_score>input {
    margin-left: calc((10 / 1280) * 100dvw);
    width: calc((73 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    border: 1.5px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 8px;
    box-sizing: border-box;
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
}

.interactives_input-group_score>div {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    width: calc((55 / 1280) * 100dvw);
    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;
}

.interactives_empty_list_info {
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((403 / 1280) * 100dvw);
    width: calc((475/1280) * 100dvw);
    display: grid;
    justify-items: center;
}

.interactives_empty_list_info>img {
    width: calc((54/1280) * 100dvw);
    height: calc((54/1280) * 100dvw);
}

.interactives_empty_list_info_h1 {
    margin-top: calc((10 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;
}

.interactives_empty_list_info_h2 {
    margin-top: calc((5 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Bold;
    font-size: clamp(10px, calc(14 / 1280 * 100dvw), 28px);
    letter-spacing: clamp(0.1px, calc(14 / 100 / 1280 * 100dvw), 0.28px);
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;
}

.interactives_list {
    width: calc((1056 / 1280) * 100dvw);
    margin-left: calc((112 / 1280) * 100dvw);
    margin-top: calc((20 / 832) * 100dvh);
    padding-bottom: calc((100 / 832) * 100dvh);
}

.interactives_list_header {
    display: flex;
    margin-left: calc((22 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;
    margin-bottom: calc((15 / 832) * 100dvh);
}

.interactives_list_header_title {
    width: calc((89 / 1280) * 100dvw);
    text-align: left;
}

.interactives_list_header_date {
    margin-left: calc((306 / 1280) * 100dvw);
    width: calc((96 / 1280) * 100dvw);
    text-align: center;
}

.interactives_list_header_status {
    margin-left: calc((64 / 1280) * 100dvw);
    width: calc((102 / 1280) * 100dvw);
    text-align: center;
}

.interactives_list_header_count {
    margin-left: calc((20 / 1280) * 100dvw);
    width: calc((192 / 1280) * 100dvw);
    text-align: center;
}

.interactives_list_list {
    display: flex;
    flex-direction: column;
}

.interactives_list_list_item {
    display: flex;
    align-items: center;
    height: calc((46.13/832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    text-align: center;
    vertical-align: middle;
}

.interactives_list_list_item>img {
    height: calc((18/832) * 100dvh);
    width: calc((14 / 1280) * 100dvw);
    margin-left: auto;
    margin-right: calc((22 / 1280) * 100dvw);
}

.interactives_Line {
    background-color: #e9e9e9 !important;
    height: calc((1 / 832) * 100dvh) !important;
}

.interactives_list_list_item_title {
    margin-left: calc((22 / 1280) * 100dvw);
    width: calc((375 / 1280) * 100dvw);
    text-align: left;
}

.interactives_list_list_item_date {
    margin-left: calc((0 / 1280) * 100dvw);
    width: calc((137 / 1280) * 100dvw);
    text-align: center;
}

.interactives_list_list_item_status {
    margin-left: calc((30 / 1280) * 100dvw);
    width: calc((128 / 1280) * 100dvw);
    text-align: center;
}

.interactives_list_list_item_count {
    margin-left: calc((69 / 1280) * 100dvw);
    width: calc((68 / 1280) * 100dvw);
    text-align: center;
}

.interactives_show_more {
    width: calc((141 / 1280) * 100dvw);
    margin-left: calc((457 / 1280) * 100dvw);
    margin-top: calc((15 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    text-align: center;
    vertical-align: middle;
    color: #853CFF;
    cursor: pointer;
}

.interactives_buttons {
    display: flex;
    align-items: center;
    margin-left: calc((77 / 1280) * 100dvw);
}

#leader_board {
    height: calc((24/832) * 100dvh) !important;
    width: calc((24 / 1280) * 100dvw) !important;
}

#start,
#edit,
#dublicate {
    height: calc((24/832) * 100dvh) !important;
    width: calc((24 / 1280) * 100dvw) !important;
}

.interactives_delete {}

.interactives_leader_board {
    background-color: #6AB23D;
    margin-right: calc((10 / 1280) * 100dvw);
}

.interactives_dublicate {
    background-color: #853CFF;
}

.interactivs_dublicate:hover {}

.interactives_edit {
    background-color: #F0436C;
    margin-left: calc((10 / 1280) * 100dvw);
}

.interactives_edit:hover {}

.interactives_start {
    background-color: #6AB23D;
    margin-left: calc((10 / 1280) * 100dvw);
}

.interactives_start:hover {}

.interactives_dublicate,
.interactives_edit,
.interactives_start,
.interactives_leader_board {
    width: calc((36/1280) * 100dvw);
    height: calc((36/832) * 100dvh);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc((5/832)*100dvh); cursor: pointer;
}

/* Стили для троеточия и dropdown */
.interactives_dots {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((24 / 1280) * 100dvw);
    height: calc((24 / 832) * 100dvh);
    margin: 0 auto;
}

.interactives_dots img {
    width: 100%;
    height: 100%;
}

.interactives_item-dropdown-options {
    position: absolute;
    top: calc(100% + calc(7/832)*100dvh);
    box-shadow: 0px 1px 13.8px 0px #00000025;
    width: calc((283 / 1280) * 100dvw);
    height: calc((106 / 832) * 100dvh);
    border-radius: calc((8/832*100dvh));
    right: 0;
    background: white;
    z-index: 665455;

}

.interactives_item-dropdown-option {
    margin:0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
   
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
width: calc((271/1280) * 100dvw);
}

.interactives_item-dropdown-option:hover {
    background-color:#DFDFDF;
    border-radius: calc((7/832)*100dvh);
}



.interactives_more_options {
    margin-left: calc((38 / 1280) * 100dvw) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((30/1280) * 100dvw);
    height: calc((30/1280) * 100dvw);cursor: pointer;
    z-index: 0 !important;
}

.interactives_more_options>img {
    z-index: 0 !important;
}
</style>