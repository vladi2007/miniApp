<script setup lang="ts">

import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'

const HISTORY_KEY = 'history_interactives'
const HISTORY_SELECT_MANY_KEY = 'history_select_many'
const HISTORY_SELECT_ONE_KEY = 'history_select_one'

const showPopup = ref<boolean>(false);
const selectedInteractives = ref<number[]>([]);
const selectedInteractive = ref<number>(0);
const selectedOption = ref<string | null>("");
const selectMany = ref(false);

watch(selectedInteractives, (newSelectedInteractives) => {
    saveToDeviceStorage(HISTORY_KEY, newSelectedInteractives);
}, { deep: true });

watch(selectMany, (newSelectMany) => {
    saveToDeviceStorage(HISTORY_SELECT_MANY_KEY, newSelectMany)
})
watch(selectedInteractive, (newSelectOne) => {
    saveToDeviceStorage(HISTORY_SELECT_ONE_KEY, newSelectOne)
})

const webApp = ref(null)

const userId = ref(null)
const props = ref(null)
const isReady = ref(false)
onMounted(async () => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        webApp.value = window.Telegram.WebApp
        //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
        const { $telegram } = useNuxtApp();
        userId.value = $telegram.initDataUnsafe.value?.user?.id;
        const savedInteractives = loadFromDeviceStorage(HISTORY_KEY);
        if (Array.isArray(savedInteractives)) {

            selectedInteractives.value = savedInteractives

        }

        const savedSelectMany = loadFromDeviceStorage(HISTORY_SELECT_MANY_KEY);
        if (savedSelectMany && selectedInteractives.value.length > 0) {
            selectMany.value = savedSelectMany;
        }
        const savedSelectOne = loadFromDeviceStorage(HISTORY_SELECT_ONE_KEY)
        //    if (savedSelectOne){
        //     selectedInteractive.value = savedSelectOne
        //    }

        // const data = await useFetch('/api/reports/preview', {

        //   query: {
        //     telegram_id: userId.value
        //   },
        // });
        //props.value = data!!!!!!!!!! пропсы надо будет сделать

        isReady.value = true

    }
});

const finder = ref<string>("")
const is_empty_list = computed(() => {
    if (list.value.length > 0){
        return false;
    }else{
        return true;
    }
})

const list = ref<any>([
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "1",
        participant_count: "220"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "2",
        participant_count: "210"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "3",
        participant_count: "2202"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "4",
        participant_count: "220"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "5",
        participant_count: "210"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "6",
        participant_count: "2202"
    },

    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 14:59",
        id: "7",
        participant_count: "220"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 7:35",
        id: "8",
        participant_count: "210"
    },
    {
        title: "1231231231231231231231231231231231231231",
        date_completed: "25.10.25 1:35",
        id: "9",
        participant_count: "2202"
    },


])

function openPopupManySelect() {
    selectedOption.value = null;

    showPopup.value = true;
}
function selectManyOption(id: number) {

    if (selectedInteractives.value.length > 4) {
        return
    }
    if (!selectedInteractives.value.includes(id)) {
        selectedInteractives.value.push(id)

    }


}

// для скачивания отчёта одного
function openPopup(id: number) {
    if (selectedInteractives.value.length === 0) {
        selectedOption.value = null; 
        selectedInteractive.value = id; 
        showPopup.value = true;
    }

}

function closePopup() {
    showPopup.value = false;
    selectedOption.value = null;
    selectedInteractive.value = 0;
   


}


async function submitReport() {
    if (selectedOption.value!==null) {
        console.log(selectMany.value)
        showPopup.value = false
        if (selectMany.value) {
            console.log(selectedOption.value)
            console.log(selectedInteractives.value)
        }
        else {
            console.log(selectedOption.value)
            console.log(selectedInteractive.value)
            selectedInteractive.value = 0
        }

        selectedOption.value = null
    }

}

watch(selectedInteractives, (newSelectedInteractives) => {
    console.log(newSelectedInteractives.length)
    selectMany.value = newSelectedInteractives.length > 0
}, { deep: true })


const router = useRouter()
async function goTo(url: string) {
    await clearDeviceStorage(HISTORY_KEY)
    await clearDeviceStorage(HISTORY_SELECT_MANY_KEY)
    await clearDeviceStorage(HISTORY_SELECT_ONE_KEY)
  router.push(url)
}
</script>

<template>
    <div class="history">
        <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
        </div>
        <div class="nav">
            <div class="nav_main"  @click="goTo('/leader/main_menu')" style="cursor: pointer;">
                О нас
            </div>
            <div class="nav_interactives" @click="goTo('/leader/new_interactives')" style="cursor: pointer;">
                Интерактивы
            </div>
            <div :class="['active_nav', 'nav_reports']">
                Отчеты
            </div>
            <div class="nav_broadcasts" @click="goTo('/leader/broadcasts')"style="cursor: pointer;">
                Рассылка
            </div>
        </div>
        <div class="history_info">
            <img src="/public/images/history/history_info.svg" />
            <div>
                Вы можете выгрузить два вида отчетов.<br />
                Доступна функция выгрузки отчетов с нескольких интерактивов.</div>
        </div>
        <div class="history_selected_interactives" v-if="!is_empty_list">
            <div class="history_selected_interactives_header">
                Список выбранных интерактивов
            </div>
            <div :class="{ selected_list: selectedInteractives.length > 0 }" style="width: calc((1056/1280)*100dvw);">


                <div class="history_list_list" v-for="id in selectedInteractives" :key="id"
                    v-if="selectedInteractives.length > 0" style="height: calc((36/832)*100dvh);">

                    <div class="history_list_list_item" :class="['selected_item']">
                        <div class="history_list_list_item_title">
                            {{list.find(item => item.id === id)?.title}}
                        </div>
                        <div class="history_list_list_item_date">
                            {{list.find(item => item.id === id)?.date_completed}}
                        </div>
                        <div class="history_list_list_item_count"
                            style="width:calc((226 / 1280) * 100dvw) !important; ">
                            Количество участников: {{list.find(item => item.id === id)?.participant_count}}
                        </div>
                        <img src="/public/images/history/history_delete.svg"
                            @click="selectedInteractives = selectedInteractives.filter(item => item !== id)" />
                    </div>
                    <div class="Line" style="width: calc((1030/1280)*100dvw); margin: 0 auto;" />
                </div>

            </div>
            <div class="history_list_selected_download" v-if="selectedInteractives.length > 0"
                @click="showPopup = true">Выгрузить</div>
            <div class="history_selected_interactives_info" v-if="selectedInteractives.length === 0">
                <img src="/public/images//history/finder_info.svg" />

                <div class="history_selected_interactives_info_h2">
                    Вы не выбрали интерактив
                </div>
            </div>
        </div>
        <div class="history_finder" :class="{ margin_24: !is_empty_list }">
            <div class="history_finder_header">
                Список проведенных интерактивов
            </div>
            <div class="history_finder_finder">
                <img src="/public/images/history/finder.svg" class="input-icon" />

                <input v-model="finder" type="text" placeholder="Поиск интерактива" class="search-input" />
            </div>
        </div>
        <div class="history_empty_list_info" v-if="is_empty_list">
            <img src="/public/images//history/finder_info.svg" />
            <div class="history_empty_list_info_h1">
                У Вас нет интерактивов
            </div>
            <div class="history_empty_list_info_h2">
                Проведите свой первый интерактив и он отобразится здесь
            </div>
        </div>
        <div class="history_list" v-if="!is_empty_list">
            <div class="history_list_header">
                <div class="history_list_header_title">
                    Название
                </div>
                <div class="history_list_header_date">
                    Дата
                </div>
                <div class="history_list_header_count">
                    Количество участников
                </div>
            </div>
            <div class="history_list_list" v-for="(item, index) in list" :key="item.id">
                <div class="Line" v-if="index === 0" />
                <div class="history_list_list_item" >
                    <div class="history_list_list_item_title" >
                        {{ item.title }}
                    </div>
                    <div class="history_list_list_item_date">
                        {{ item.date_completed }}
                    </div>
                    <div class="history_list_list_item_count">
                        {{ item.participant_count }}
                    </div>
                    id:{{ selectedInteractive }}<br/> Несколько:{{ selectMany }}
                    <div class="history_list_list_item_download_one" @click="openPopup(item.id)">Выгрузить</div>
                    <div class="history_list_list_item_download_many"
                        :style="{ visibility: selectedInteractives.includes(item.id) ? 'hidden' : 'visible' }"
                        @click="selectManyOption(item.id)">Выбрать</div>
                </div>
                <div class="Line" />
            </div>
            <div class="history_show_more">Показать еще</div>
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
</template>

<style>
.history {
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    ;
    overflow-x: hidden;
    background-color: white;
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

.history_info {
    display: flex;
    align-items: flex-start;
    margin-left: calc((112 / 1280) * 100dvw);
    margin-top: calc((25 / 832) * 100dvh);
    margin-bottom: calc((20 / 832) * 100dvh);
}

.history_info>img {
    width: calc((24/1280) * 100dvw);
    height: calc((24 / 832) * 100dvh);
}

.history_info>div {

    margin-left: calc((5 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    color: #7D7D7D;
    line-height: clamp(10px, calc(26 / 1280 * 100dvw), 52px);
    ;

}

.history_finder {
    margin-left: calc((112 / 1280) * 100dvw);
}



.history_finder_header {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
}

.history_finder_finder {
    margin-top: calc((15 / 832) * 100dvh);
    position: relative;
    display: flex;
    align-items: center;
}


.selected_list {
    width: calc((1054/1280) * 100dvw) !important;
    border-radius: 8px;
    border: 1.5px solid #853CFF;
}

.search-input {

    width: calc((715/1280) * 100dvw);
    height: calc((39 / 832) * 100dvh);
    line-height: calc((39 / 832) * 100dvh);
    ;
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

.search-input::placeholder {
    line-height: calc((39 / 832) * 100dvh);
    ;
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    color: #A9A9A9;
}

.input-icon {
    position: absolute;
    left: calc((17 / 1280) * 100dvw);
    top: 50%;
    transform: translateY(-50%);

    width: calc((19/1280) * 100dvw);
    height: calc((19/1280) * 100dvw);
    pointer-events: none;
}

.history_empty_list_info {
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((403 / 1280) * 100dvw);
    width: calc((475/1280) * 100dvw);
    display: grid;
    justify-items: center;

}

.history_empty_list_info>img {
    width: calc((54/1280) * 100dvw);
    height: calc((54/1280) * 100dvw);
}

.history_empty_list_info_h1 {
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

.history_empty_list_info_h2 {
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

.history_selected_interactives_header {
    margin-bottom: calc((15 / 832) * 100dvh);
}

.history_selected_interactives {
    width: calc((1056/1280) * 100dvw);
    margin-left: calc((112 / 1280) * 100dvw);
    
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
    overflow-x: hidden;
    min-height: calc((162 / 832) * 100dvh);

}

.history_list_selected_download {
    width: calc((99 / 1280) * 100dvw);
    margin-left: auto;
    margin-right: calc((15 / 1280) * 100dvw);
    ;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
    color: #6AB23D;
    text-align: center;
    vertical-align: middle;
    margin-top: calc((20 / 832) * 100dvh);
    ;

}

.history_selected_interactives_info>img {
    width: calc((54/1280) * 100dvw);
    height: calc((54/832) * 100dvh);
}

.history_selected_interactives_info {
    display: grid;
    justify-items: center;

    width: calc((300/1280) * 100dvw);
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((378 / 1280) * 100dvw);

}

.history_selected_interactives_info_h2 {
    margin-top: calc((10 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    color: #7D7D7D;
    font-weight: 500;
    font-style: Medium;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    text-align: center;
    vertical-align: middle;

}

.history_list {
    width: calc((1056 / 1280) * 100dvw);
    margin-left: calc((112 / 1280) * 100dvw);
    margin-top: calc((20 / 832) * 100dvh);
    padding-bottom: calc((100 / 832) * 100dvh);
    overflow-x: hidden;
}

.history_list_header {
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
    overflow-x: hidden;
}

.history_list_header_title {
    width: calc((89 / 1280) * 100dvw);
    text-align: left;
}

.history_list_header_date {
    margin-left: calc((356 / 1280) * 100dvw);
    width: calc((96 / 1280) * 100dvw);
    text-align: center;
}

.history_list_header_count {
    margin-left: calc((59 / 1280) * 100dvw);
    width: calc((192 / 1280) * 100dvw);
    text-align: center;
}

.history_list_list {

    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.history_list_list_item {
    overflow-x: hidden;
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

.history_list_list_item>img {
    height: calc((18/832) * 100dvh);
    width: calc((14 / 1280) * 100dvw);
    margin-left: auto;
    margin-right: calc((22 / 1280) * 100dvw);
}

.Line {
    background-color: #e9e9e9 !important;
    height: calc((1 / 832) * 100dvh) !important;
}

.history_list_list_item_title {
    margin-left: calc((22 / 1280) * 100dvw);
    width: calc((400 / 1280) * 100dvw);
    text-align: left;
}

.history_list_list_item_date {
    margin-left: calc((16 / 1280) * 100dvw);
    width: calc((154 / 1280) * 100dvw);
    text-align: center;
}

.history_list_list_item_count {
    margin-left: calc((92 / 1280) * 100dvw);
    width: calc((68 / 1280) * 100dvw);
    text-align: center;
}

.history_list_list_item_download_one {
    margin-left: calc((62 / 1280) * 100dvw);
    height: calc((36/832) * 100dvh);
    width: calc((131 / 1280) * 100dvw);
    background-color: #6AB23D;
    color: white;
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: calc((5 / 832) * 100dvh);
}

.history_list_list_item_download_many {
    margin-left: calc((30 / 1280) * 100dvw);
    color: #853CFF;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    cursor: pointer;

}

.history_show_more {
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


.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
}

.popup {
    margin-top: 220px;
    ;
    background: white;
    border-radius: 35px;
    width: 818px;
    height: 400px;
    ;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    position: relative;
}

.popup-header {
    position: relative;
}

.popup-header-text {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 36px;
    letter-spacing: 1px;
    padding-top: 48px;
    margin-left: 146px;
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
    display: flex;
    align-items: center;
    font-size: 18px;

    cursor: pointer;
    position: relative;
}

.popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    position: relative;
    padding-left: 62px;
}

.popup-option input[type="radio"] {
    display: none;
}

.popup-option input[type="radio"]+span::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 35px;
    height: 35px;
    background-image: url("/public/images/history/circle.svg");
    background-size: cover;
    background-position: center;
    cursor: pointer;
}

.popup-option input[type="radio"]:checked+span::after {
    content: "";
    position: absolute;
    top: 9px;
    left: 5px;
    width: 24px;
    height: 18px;
    background-image: url("/public/images/history/Vector_2.svg");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
}

.popup-option input[type="radio"]:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(133, 60, 255, 0.6);
}

.popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 32px;
    letter-spacing: 1px;
    position: relative;
}

.popup-footer {
    margin-top: 44px;
}

.popup-submit {
    margin-left: 292px;
    width: 233px;
    height: 62px;
    background-color: white;
    color: #853cff;
    border: 2px solid #853cff;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 24px;
    border-radius: 5px;
    cursor: pointer;
    vertical-align: middle;
    letter-spacing: 1px;
}

.popup-submit:hover {
    margin-left: 292px;
    width: 233px;
    height: 62px;
    background-color: #853cff;
    color: white;
    border: 2px solid #853cff;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 24px;
    border-radius: 5px;
    cursor: pointer;
    vertical-align: middle;
    letter-spacing: 1px;
}
</style>