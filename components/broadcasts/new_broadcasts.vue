<script setup lang="ts">
import { useRouter } from 'vue-router';
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorageIndexedDB'
const BROADCASTS_KEY = 'broadcasts_key'
import header_logo from "~/components/header_logo.vue"
import Header from "~/components/header.vue"
const BROADCASTS_TEXT_KEY = 'broadcasts_text_key'
const BROADCASTS_FILE_KEY = 'broadcasts_file_key'
const BROADCASTS_TO_NUMBER_KEY = 'broadcasts_to_number'
const selectedInteractives = ref<number[]>([]);
import { useQueryClient } from '@tanstack/vue-query'
const isReady = ref(false)
const queryClient = useQueryClient()  
const from_number = ref(0)
const to_number = ref(9)
const userId = useState('telegramUser')
const userRole = useState('userRole')
import { useQuery, useMutation,  } from '@tanstack/vue-query'
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const uploadedFileName = ref<string>("")
watch(to_number, async (new_Numb) => {
    localStorage.setItem(BROADCASTS_TO_NUMBER_KEY, String(new_Numb));
});
onMounted(async () => {
   
        //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
        const savedInteractives = await loadFromDeviceStorage(BROADCASTS_KEY);
        if (savedInteractives) {

            selectedInteractives.value = savedInteractives

        }

        const savedText = await loadFromDeviceStorage(BROADCASTS_TEXT_KEY)
        text.value = savedText
        const saved = await loadFromDeviceStorage(BROADCASTS_FILE_KEY)
        if (saved) {
            uploadedFile.value = saved
            uploadedFileName.value = saved.name
        }
         const saved_to = localStorage.getItem(BROADCASTS_TO_NUMBER_KEY);
    if (saved_to) {
        to_number.value = Number(saved_to) || 9;
    }
        isReady.value=true



});

const sendStatus = ref<"idle" | "sending" | "success" | "error">("idle")
async function submitBroadcasts() {

    if (selectedInteractives.value.length === 0) {
        window.Telegram.WebApp.showAlert(`Выберите хотя бы один интерактив!`);
        closePopup();
        return;
    }   

    sendStatus.value = "sending";
    try {
        const formData = new FormData();
        console.log(userId.value)
        console.log(selectedInteractives.value)
        formData.append("telegram_id", userId.value);
        if (text.value===null){
            formData.append("text", "");
        }
        else{
               formData.append("text", text.value);
        }
     
        console.log(text.value)
        formData.append("interactive_id", JSON.stringify(selectedInteractives.value));

        if (uploadedFile.value) {
            formData.append("file", uploadedFile.value);
        }

        const response = await fetch('/api/broadcasts/send', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Ошибка сервера");
        }
        if( response.ok){   sendStatus.value = "success";}
        
        if (showPopup.value ===false){window.Telegram.WebApp.showAlert(`Ваше сообщение успешно отправлено`); sendStatus.value = "idle";}
    } catch (e) {
        console.log("error")
        sendStatus.value = "error";
        if (showPopup.value ===false){window.Telegram.WebApp.showAlert(`${e}`); sendStatus.value = "idle";}
    }

}
const { data: interactivesData, isLoading, refetch } = useQuery({
  queryKey: computed(() => ['broadcasts', userId.value, 'conducted', from_number.value, to_number.value]),
  queryFn: async () => {
    if (!userId.value) return { interactives_list: [], is_end: true }
    const res = await $fetch('/api/reports/preview', {
      query: {
        telegram_id: userId.value,
        filter: "conducted",
        from_number: from_number.value,
        to_number: to_number.value
      }
    })
    
    return res
  },
  enabled: computed(() => Boolean(userId && isReady.value)),
  staleTime: 1000 * 60 * 30,       // 5 минут данные считаются свежими
  cacheTime: 1000 * 60 * 30,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
})
async function more_load() {
    to_number.value = to_number.value + 10
   
}

const router = useRouter()
async function goTo(url: string, active: string) {
    if (active === "broadcasts") return
    router.push(url)
    await clearDeviceStorage(BROADCASTS_FILE_KEY)
    await clearDeviceStorage(BROADCASTS_KEY)
    await clearDeviceStorage(BROADCASTS_TEXT_KEY)
    await localStorage.removeItem(BROADCASTS_TO_NUMBER_KEY)
}

function openPopUp() {
    if (uploadedFileName.value.trim().length > 0 || text.value.trim().length) {
        showPopup.value = true
    }
}
function openFileDialog() {
    if (fileInput.value) {
        fileInput.value.click()
    }
}
async function handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
        const MAX_SIZE_MB = 50; // лимит 50MB
        const fileSizeMB = file.size / (1024 * 1024); // размер в мегабайтах

        if (fileSizeMB > MAX_SIZE_MB) {
            window.Telegram.WebApp.showAlert(`Файл слишком большой. Максимальный размер: ${MAX_SIZE_MB}MB.`);
            event.target.value = "";
            return;
        }
        uploadedFile.value = file;
        uploadedFileName.value = file.name;

        event.target.value = "";
    }
}

async function removeImage() {

    uploadedFile.value = null;
    uploadedFileName.value = "";
    await clearDeviceStorage(BROADCASTS_FILE_KEY)
}


const finder = ref<string>("")
const is_empty_list = computed(() => {
    if (interactivesData?.value?.interactives_list?.length > 0) {
        return false;
    } else {
        return true;
    }
})
const showPopup = ref<boolean>(false);

function selectManyOption(id: number) {

    if (selectedInteractives.value.length > 4) {
        return
    }
    if (!selectedInteractives.value.includes(id)) {
        selectedInteractives.value.push(id)
    }


}
const text = ref<string>("")
watch(selectedInteractives, async (value) => {
    try {
        const serializable = JSON.parse(JSON.stringify(value));

        await saveToDeviceStorage(BROADCASTS_KEY, serializable);
    } catch (err) {
        console.error("Ошибка сериализации интерактивов", err);
    }
}, { deep: true });
watch(uploadedFile, async (file) => {
    await saveToDeviceStorage(BROADCASTS_FILE_KEY, file);
}, { deep: true });
watch(text, async (newtext) => {
    await saveToDeviceStorage(BROADCASTS_TEXT_KEY, newtext);
}, { deep: true });

const count = computed(() => {
    return selectedInteractives.value
        .map(id => Number(interactivesData?.value.interactives_list?.find(item => item.id === id)?.participant_count || 0))
        .reduce((sum, n) => sum + n, 0)
})


function closePopup() {
    sendStatus.value="idle"
    showPopup.value = false;
   


}
const route = useRoute();
onMounted(() => {
  const selectedId = route.query.selected;
  if (selectedId) {
    selectedInteractives.value = [Number(selectedId)]; // сразу выбираем интерактив
  }
});

const dotCount = ref(1)
let dotInterval: any = null
watch(sendStatus, (value) => {
    if (value === "sending") {
        dotCount.value = 1
        dotInterval = setInterval(() => {
            dotCount.value = dotCount.value % 3 + 1 // 1 → 2 → 3 → 1
        }, 500)
    } else {
        clearInterval(dotInterval)
    }
})
</script>

<template>
    <div class="broadcasts">
          <header_logo/>
          <div class="broadcasts_margins">
        <Header :goTo="goTo" :active="'broadcasts'" />

        <div class="broadcasts_input"> <label>Введите текст рассылки<textarea v-model="text" id="description_input"
                    placeholder="Текст" maxlength="200" /></label></div>
        <div class="broadcasts_custom-file-upload" :class="{ 'broadcasts_file-uploaded': uploadedFileName }"
            @click="!uploadedFileName && openFileDialog()">

            <input ref="fileInput" type="file" 
                 hidden 
                @change="handleFileChange" />

            <template v-if="uploadedFileName">
                <span> {{ uploadedFileName }} </span>
                <img src="/public/images/interactive_editor/delete.svg" @click.stop="removeImage"
                    class="broadcasts_remove-icon" />
            </template>

            <template v-else>
                <span style="color: #1D1D1D;">Прикрепить файл</span>
                <span style="margin-left: auto; color:#A9A9A9;">Не выбрано</span>
            </template>
        </div>
        <div class="broadcasts_selected_interactives" v-if="!is_empty_list">
            <div class="broadcasts_selected_interactives_header"
                style="display: flex; align-items: center; justify-content: space-between; ">
                <div>Выбрать участников интерактива
                </div>
                <div v-if="selectedInteractives.length > 0" id="count_address">Количество получателей: <span style="color: #6AB23D;">{{
                        count }}
                        чел.</span></div>
            </div>
            <div :class="{ broadcasts_selected_list: selectedInteractives.length > 0 }"
                 id="selected_list">

                <div class="broadcasts_list_list" v-for="id in selectedInteractives" :key="id"
                    v-if="selectedInteractives.length > 0" style="height: calc((36/832)*100dvh);">

                    <div class="broadcasts_list_list_item" :class="['broadcasts_selected_item']">
                        <div class="broadcasts_list_list_item_title">
                            {{interactivesData?.interactives_list?.find(item => item.id === id)?.title}}
                        </div>
                        <div class="broadcasts_list_list_item_date">
                            {{interactivesData?.interactives_list?.find(item => item.id === id)?.date_completed}}
                        </div>
                        <div class="broadcasts_list_list_item_count"
                            style="width:calc((226 / 1280) * 100dvw) !important; ">
                            Количество участников: {{interactivesData?.interactives_list?.find(item => item.id === id)?.participant_count}}
                        </div>
                        <img src="/public/images/history/history_delete.svg"
                            @click="selectedInteractives = selectedInteractives.filter(item => item !== id)" />
                    </div>
                    <div class="broadcasts_Line" style="width: calc((1030/1280)*100dvw); margin: 0 auto;" />
                </div>

            </div>
            <div class="broadcasts_list_selected_download" v-if="selectedInteractives.length > 0"
                @click="showPopup = true ">
                Отправить рассылку</div>
            <div class="broadcasts_selected_interactives_info" v-if="selectedInteractives.length === 0">
                <img src="/public/images//history/finder_info.svg" />

                <div class="broadcasts_selected_interactives_info_h2">
                    Вы не выбрали интерактив
                </div>
            </div>
        </div>
        <div class="broadcasts_finder" :class="{ margin_24: !is_empty_list }">
            <div class="broadcasts_finder_header">
                Список проведенных интерактивов
            </div>
            <div class="broadcasts_finder_finder">
                <img src="/public/images/history/finder.svg" class="broadcasts_input-icon" />

                <input v-model="finder" type="text" placeholder="Поиск интерактива" class="broadcasts_search-input" />
            </div>
        </div>
        <div class="broadcasts_empty_list_info" v-if="interactivesData && is_empty_list">
            <img src="/public/images//history/finder_info.svg" />
            <div class="broadcasts_empty_list_info_h1">
                У Вас нет интерактивов
            </div>
            <div class="broadcasts_empty_list_info_h2">
                Проведите свой первый интерактив и он отобразится здесь
            </div>
        </div>
        <div class="broadcasts_list" v-if="interactivesData && !is_empty_list" >
            <div class="broadcasts_list_header">
                <div class="broadcasts_list_header_title">
                    Название
                </div>
                <div class="broadcasts_list_header_date">
                    Дата
                </div>
                <div class="broadcasts_list_header_count">
                    Количество участников
                </div>
            </div>
            <div class="broadcasts_list_list" v-for="(item, index) in interactivesData.interactives_list" :key="item.id">
                <div class="broadcasts_Line" v-if="index === 0" />
                <div class="broadcasts_list_list_item">
                    <div class="broadcasts_list_list_item_title">
                        {{ item.title }}
                    </div>
                    <div class="broadcasts_list_list_item_date">
                        {{ item.date_completed }}
                    </div>
                    <div class="broadcasts_list_list_item_count">
                        {{ item.participant_count }}
                    </div>
                    <div class="broadcasts_list_list_item_download_many"
                        :style="{ visibility: selectedInteractives.includes(item.id) ? 'hidden' : 'visible' }"
                        @click="selectManyOption(item.id)">Выбрать</div>
                </div>
                <div class="broadcasts_Line" />
            </div>
            <div class="broadcasts_show_more" v-if="!interactivesData.is_end" @click="more_load()">Показать еще</div>
        </div>
</div>
    </div>

    <div v-if="showPopup " class="broadcasts_popup-overlay">
        <div class="broadcasts_popup">
            <div class="broadcasts_popup-header">
                <div class="broadcasts_popup-header-text">Подтвердите отправку рассылки</div>
                <img src="/images/history/Vector_1.svg" class="broadcasts_popup-close" @click="closePopup()" />
            </div>
            <div class="broadcasts_popup-body" :class="{margins:sendStatus !== 'idle'}">
                <div style="color: #7D7D7D; line-height: calc((16*1.2/832)*100dvh);">
                    От лица “Название телеграмм бота” будет отправлена в личный чат с участником следующая информация
                </div>
                <div class="margin10" style="  white-space: normal; 
    overflow-wrap: break-word; margin-top: calc((10 / 832) * 100dvh); line-height:calc((16*1.2/832)*100dvh);">
                    Сообщение: {{ text }}
                </div>
                <div class="margin10" style="margin-top: calc((10 / 832) * 100dvh);line-height: calc((16*1.2/832)*100dvh);">
                    Файлы: {{ uploadedFileName }}
                </div>
                <div class="margin10" style="margin-top: calc((10 / 832) * 100dvh);line-height: calc((16*1.2/832)*100dvh);">
                    Количество получателей: {{ count }}
                </div>
                <div class="margin10" style="margin-top: calc((10 / 832) * 100dvh);color: #7D7D7D;line-height: calc((16*1.2/832)*100dvh);">
                    Используйте рассылку по назначению. 
                    Злоупотребление ею приведет к блокировке бота со стороны Telegram.
                </div>
            </div>
            <div class="broadcasts_popup-footer" v-if="sendStatus === 'idle'">
                <div class="broadcasts_popup_back" @click=" closePopup()">
                    Отменить
                </div>
                <div class="broadcasts_popup_send" @click=" submitBroadcasts()">
                    <div>Отправить</div>
                </div>
            </div>
            <div class="broadcasts_popup-footer_sending" v-if="sendStatus === 'sending'"><div class="broadcasts_popup_status_text">
                    Идет рассылка получателям {{ ".".repeat(dotCount) }}</div>
            </div>

            <div class="broadcasts_popup-footer_success" v-if="sendStatus === 'success'">
                <img src ="/public/images/broadcasts/Group.svg"></img>
                <div class="broadcasts_popup_status_text">
                    Рассылка успешно отправлена участникам!
                </div>
            </div>

            <div class="broadcasts_popup-footer_error" v-if="sendStatus === 'error'">
                <img src ="/public/images/broadcasts/Vector (2).svg"></img>
                <div class="broadcasts_popup_status_text">
                    Произошла ошибка. Повторите отправку.
                </div>
            </div>
        </div>
    </div>
</template>

<style>
@media (max-height:1078px), (max-width:1918px){
    .broadcasts_popup_status_text{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .margins{
        margin-bottom: 0px !important;;
    }
    .broadcasts_popup-footer_sending, .broadcasts_popup-footer_success, .broadcasts_popup-footer_error {font-family: "Lato", sans-serif;
font-weight: 400;
font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc((484 / 1280) * 100dvw);
           line-height: calc((19.2/832)*100dvh);
    }
    .broadcasts_popup-footer_sending {    margin-top: calc((10/832) * 100dvh); height: calc((19 / 832) * 100dvh); margin-bottom: calc((50/832) * 100dvh) ;
 display: flex; 
      align-items: center;justify-content: center;margin-left: calc((20/1280)*100dvw);
    }
    .broadcasts_popup-footer_success{  margin-top: calc((15/832) * 100dvh);height: calc((39 / 832) * 100dvh);margin-bottom: calc((25/832) * 100dvh) !important;; display: grid; 
     justify-content: center;margin-left: calc((20/1280)*100dvw);}
        .broadcasts_popup-footer_error{ margin-top: calc((10/832) * 100dvh);height: calc((44 / 832) * 100dvh);margin-bottom: calc((25/832) * 100dvh) !important;; display: grid; 
   justify-content: center;margin-left: calc((20/1280)*100dvw);}
    .broadcasts_popup-footer_sending > div{
        color: #853CFF;
    }
    .broadcasts_popup-footer_success > div{
        color: #6AB23D;
    }
    .broadcasts_popup-footer_error > div{
        color: #F0436C;
    }
    .broadcasts_popup-footer_success > img{ margin: 0 auto;;
          width: calc((20/1280) * 100dvw);
    height: calc((25 / 832) * 100dvh);
    }
    .broadcasts_popup-footer_error > img{margin: 0 auto;;
          width: calc((27/1280) * 100dvw);
    height: calc((25 / 832) * 100dvh);
    }
.broadcasts {
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    ;
    overflow-x: hidden;
    background-color: white;
}


.broadcasts_margins{
     width: calc((1056 / 1280) * 100dvw);
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin-left: calc((112 / 1280) * 100dvw);
}
.broadcasts_header {
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

.broadcasts_input {
    width: calc((483/1280) * 100dvw);
    margin-top: calc((25/832) * 100dvh);
}

.broadcasts_input label {
    display: flex;
    flex-direction: column;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;

    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    ;
    vertical-align: middle;

}

.broadcasts_input textarea::placeholder {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    width: calc((483/1280) * 100dvw);
    height: calc((97 / 832) * 100dvh);

    vertical-align: middle;

}

.broadcasts_input textarea {
    width: calc((483/1280) * 100dvw);
    height: calc((97 / 832) * 100dvh);
    box-sizing: border-box;
    padding: calc((12 / 1280) * 100dvw) calc((12 / 832) * 100dvh);
    margin-top: calc((10/832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);

    color: #1d1d1d;

    resize: none;
    /* Убираем лишнее */
    border: none;
    outline: none;
    border-radius: 8px;
    ;
    border: 1.5px solid #E0E0E0;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    vertical-align: middle;

    /* IE и Edge */
}


.broadcasts_custom-file-upload {
    width: calc((483 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);
    border: 1.5px solid #E0E0E0;
    border-radius: 8px;
    background-color: white;
    color: #1D1D1D;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: calc((15 / 832) * 100dvh);
    margin-bottom: calc((15 / 832) * 100dvh);
}





.broadcasts_file-status {
    margin-top: calc((5 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 24px);
    color: #7D7D7D;
}

.broadcasts_file-uploaded {
    border-color: #6AB23D !important;
    /* Зелёный */
    color: #1D1D1D;
    color: #6AB23D;
    margin-bottom: calc((15 / 832) * 100dvh);
}

.broadcasts_remove-icon {
    width: calc((14 / 1280) * 100dvw);
    height: calc((18 / 832) * 100dvh);
    margin-left: auto;
    cursor: pointer;
}


.broadcasts_finder {
}



.broadcasts_finder_header {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
}

.broadcasts_finder_finder {
    margin-top: calc((15 / 832) * 100dvh);
    position: relative;
    display: flex;
    align-items: center;
}


.broadcasts_selected_list {
    width: calc((1054/1280) * 100dvw) !important;
    border-radius: 8px;
    border: 1.5px solid #853CFF;
}

.broadcasts_search-input {

    width: calc((765/1280) * 100dvw);
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
    padding-left: calc((50 / 1280) * 100dvw); box-sizing: border-box;
}

.broadcasts_search-input::placeholder {
    line-height: calc((39 / 832) * 100dvh);
    ;
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    color: #A9A9A9;
}

.broadcasts_input-icon {
    position: absolute;
    left: calc((17 / 1280) * 100dvw);
    top: 50%;
    transform: translateY(-50%);

    width: calc((19/1280) * 100dvw);
    height: calc((19/1280) * 100dvw);
    pointer-events: none;
}

.broadcasts_empty_list_info {
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((290 / 1280) * 100dvw);
    width: calc((475/1280) * 100dvw);
    display: grid;
    justify-items: center;

}

.broadcasts_empty_list_info>img {
    width: calc((54/1280) * 100dvw);
    height: calc((54/1280) * 100dvw);
}

.broadcasts_empty_list_info_h1 {
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

.broadcasts_empty_list_info_h2 {
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

.broadcasts_selected_interactives_info>img {
    width: calc((54/1280) * 100dvw);
    height: calc((54/832) * 100dvh);
}

.broadcasts_selected_interactives_info {
    display: grid;
    justify-items: center;
    width: calc((300/1280) * 100dvw);
    margin-top: calc((34 / 832) * 100dvh);
    margin-left: calc((378 / 1280) * 100dvw);

}

.broadcasts_selected_interactives_info_h2 {
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
.broadcasts_selected_interactives_header{
    width: calc((1056/1280)*100dvw) !important;
}
.broadcasts_selected_interactives_header>div {
    margin-bottom: calc((15 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
    overflow-x: hidden;
}

.broadcasts_selected_interactives {
    
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Medium;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
    vertical-align: middle;
    color: #1D1D1D;
    overflow-x: hidden;
    min-height: calc((162 / 832) * 100dvh);
}

.broadcasts_list {
    width: calc((1056 / 1280) * 100dvw);
    margin-top: calc((20 / 832) * 100dvh);
    padding-bottom: calc((100 / 832) * 100dvh);
    overflow-x: hidden;
}

.broadcasts_list_header {
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

.broadcasts_list_header_title {
    width: calc((89 / 1280) * 100dvw);
    text-align: left;
}

.broadcasts_list_header_date {
    margin-left: calc((356 / 1280) * 100dvw);
    width: calc((96 / 1280) * 100dvw);
    text-align: center;
}

.broadcasts_list_header_count {
    margin-left: calc((59 / 1280) * 100dvw);
    width: calc((192 / 1280) * 100dvw);
    text-align: center;

}

.broadcasts_list_list {

    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.broadcasts_list_list_item {
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

.broadcasts_list_list_item>img {
    height: calc((18/832) * 100dvh);
    width: calc((14 / 1280) * 100dvw);
    margin-left: auto;
    margin-right: calc((22 / 1280) * 100dvw);
}

.broadcasts_Line {
    background-color: #e9e9e9 !important;
    height: calc((1 / 832) * 100dvh) !important;
}

.broadcasts_list_list_item_title {
    margin-left: calc((22 / 1280) * 100dvw);
    width: calc((400 / 1280) * 100dvw);
    text-align: left;
}

.broadcasts_list_list_item_date {
    margin-left: calc((16 / 1280) * 100dvw);
    width: calc((154 / 1280) * 100dvw);
    text-align: center;
}

.broadcasts_list_list_item_count {
    margin-left: calc((92 / 1280) * 100dvw);
    width: calc((68 / 1280) * 100dvw);
    text-align: center;
}



.broadcasts_list_list_item_download_many {
    margin-left: calc((201 / 1280) * 100dvw);
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

.broadcasts_show_more {
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

.broadcasts_list_selected_download {
    height: calc((36 / 832) * 100dvh) !important;
    width: calc((214 / 1280) * 100dvw);
    margin-left: calc(842/1280*100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
    color: white;
    background-color: #6AB23D;
    text-align: center;
    vertical-align: middle;
    margin-top: calc((20 / 832) * 100dvh);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc((8/832)*100dvh);
}


.broadcasts_popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.32);
    z-index: 999;
    display: flex;
    justify-content: center;
}

.broadcasts_popup {
    margin: auto auto;
    ;box-sizing: border-box;
    background: white;
    border-radius: calc((18 / 832) * 100dvh);
    min-height: calc((344 / 832) * 100dvh);
    width: calc((524 / 1280) * 100dvw);
    ;
    position: relative;

    gap: 0px;
}

.broadcasts_popup-header {}

.broadcasts_popup-header-text {
    margin-top: calc((24 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.40px);
    text-align: center;

}

.broadcasts_popup-close {
    min-height: calc((16 / 832) * 100dvh) !important;
    width: calc((16 / 1280) * 100dvw);
    position: absolute;
    top: calc((24 / 832) * 100dvh) !important;
    right: calc((24 / 1280) * 100dvw);
    cursor: pointer;
    color: #aaa;
    cursor: pointer;
}

.broadcasts_popup-body {box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: calc((484 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);

    margin: 0 auto;
    margin-top: calc((19 / 832) * 100dvh);
}
.broadcasts_popup-body > div{
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
}
.broadcasts_popup-option {
    margin-left: 51px;
    display: flex;
    align-items: center;
    font-size: 18px;

    cursor: pointer;
    position: relative;
}

.broadcasts_popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    position: relative;
    padding-left: 62px;
}

.broadcasts_popup-option input[type="radio"] {
    display: none;
}

.broadcasts_popup-option input[type="radio"]+span::before {
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

.broadcasts_popup-option input[type="radio"]:checked+span::after {
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

.broadcasts_popup-option input[type="radio"]:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(133, 60, 255, 0.6);
}

.broadcasts_popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 32px;
    letter-spacing: 1px;
    position: relative;
}

.broadcasts_popup-footer {
    font-family: "Lato", sans-serif;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: calc((239 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.40px);
    text-align: center;
    vertical-align: middle;    width: calc((261 / 1280) * 100dvw) !important;
    margin-top: calc((18/832)*100dvh);
        margin-bottom: calc((20/832)*100dvh);  height: calc((41/832)*100dvh); 
}

.broadcasts_popup_back {

    color: #853CFF;
}

.broadcasts_popup_send {
    cursor: pointer;
    display: flex;
    font-family: "Lato", sans-serif;
    align-items: center;
    justify-content: center;
    width: calc((138 / 1280) * 100dvw) !important;
    height: calc((41/832)*100dvh);
    color: #6AB23D;
    margin-left: calc((40 / 1280) *100dvw);
    border: calc((2/832)*100dvh) solid #6AB23D;
    border-radius: calc((8/832)*100dvh);

}

.broadcasts_popup-submit {
    font-family: "Lato", sans-serif;
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

.broadcasts_popup-submit:hover {
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
}
@media (min-width:1918px) and (min-height:1078px){
    .broadcasts_popup_status_text{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .margins{
        margin-bottom: 0px !important;;
    }
    .broadcasts_popup-footer_sending, .broadcasts_popup-footer_success, .broadcasts_popup-footer_error {font-family: "Lato", sans-serif;
font-weight: 400;
font-size: 16px;
    letter-spacing: 0.16px;
        width: 484px;
           line-height: 19.2px;
    }
    .broadcasts_popup-footer_sending {    margin-top: 10px; height: 19px;; margin-bottom:50px ;
 display: flex; 
      align-items: center;justify-content: center;margin-left: 20px;;
    }
    .broadcasts_popup-footer_success{  margin-top: 15px;height: 39px;;margin-bottom:25px !important;; display: grid; 
     justify-content: center;margin-left:20px;}
        .broadcasts_popup-footer_error{ margin-top:10px;height: 44px;margin-bottom: 25px !important;; display: grid; 
   justify-content: center;margin-left: 20px;}
    .broadcasts_popup-footer_sending > div{
        color: #853CFF;
    }
    .broadcasts_popup-footer_success > div{
        color: #6AB23D;
    }
    .broadcasts_popup-footer_error > div{
        color: #F0436C;
    }
    .broadcasts_popup-footer_success > img{ margin: 0 auto;;
          width: 20px;
    height: 25px;;
    }
    .broadcasts_popup-footer_error > img{margin: 0 auto;;
          width: 27px;;
    height: 25px;;
    }
    .broadcasts {
    width: 100dvw;
    height: 100dvh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    ;
    overflow-x: hidden;
    background-color: white;
}

.broadcasts_margins{
    width: 1056px;
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin:0 auto 0 auto;
}

.broadcasts_input {
    width: 483px;
    margin-top: 61px;
}

.broadcasts_input label {
    display: flex;
    flex-direction: column;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    vertical-align: middle;

}

.broadcasts_input textarea::placeholder {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    width: 483px;
    height: 97px;

    vertical-align: middle;

}

.broadcasts_input textarea {
    font-size: 16px;
    width: 483px;
    height: 97px;
    box-sizing: border-box;
    padding: 12px 12px;
    margin-top: 10px;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: normal;

    color: #1d1d1d;

    resize: none;
    /* Убираем лишнее */
    border: none;
    outline: none;
    border-radius: 8px;
    ;
    border: 1.5px solid #E0E0E0;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;

    vertical-align: middle;

    /* IE и Edge */
}


.broadcasts_custom-file-upload {
    width: 483px;
    height: 42px;
    padding: 12px 12px;
    font-family: "Lato", sans-serif;
    font-size: 16px;
    border: 1.5px solid #E0E0E0;
    border-radius: 8px;
    background-color: white;
    color: #1D1D1D;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 15px;
}





.broadcasts_file-status {
    margin-top: 5px;
    font-family: "Lato", sans-serif;
    font-size:16px;
    color: #7D7D7D;
}

.broadcasts_file-uploaded {
    border-color: #6AB23D !important;
    /* Зелёный */
    color: #1D1D1D;
    color: #6AB23D;
    margin-bottom: 15px;
}

.broadcasts_remove-icon {
    width: 14px;
    height: 18px;
    margin-left: auto;
    cursor: pointer;
}


.broadcasts_finder {
}



.broadcasts_finder_header {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    letter-spacing: 0.16px;
    vertical-align: middle;
    color: #1D1D1D;
}

.broadcasts_finder_finder {
    margin-top: 15px;
    position: relative;
    display: flex;
    align-items: center;
}


.broadcasts_selected_list {
    width: 1056px !important;
    border-radius: 8px;
    border: 1.5px solid #853CFF;
}

.broadcasts_search-input {

    width: 765px;
    height: 39px;
    line-height: 39px;
    ;
    color: #1D1D1D !important;
    border: 1.5px solid #E0E0E0;
    border-radius:8px;

    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 16px;

    display: flex;
    align-items: center;
    padding-left: 50px;; box-sizing: border-box;
}

.broadcasts_search-input::placeholder {
    line-height: 34px;
    ;
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size:16px;
    color: #A9A9A9;
}

.broadcasts_input-icon {
    position: absolute;
    left: 17px;
    top: 50%;
    transform: translateY(-50%);

    width: 19px;
    height: 19px;
    pointer-events: none;
}

.broadcasts_empty_list_info {
    margin-top: 34px;
    margin-left: 290px;
    width: 475px;
    display: grid;
    justify-items: center;
}

.broadcasts_empty_list_info>img {
    width: 54px;
    height: 54px;
}

.broadcasts_empty_list_info_h1 {
    margin-top: 10px;
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
    font-size: 20px;
    letter-spacing: 0.2px;
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;
}

.broadcasts_empty_list_info_h2 {
    margin-top: 5px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Bold;
    font-size: 14px;;
    letter-spacing: 0.14px;;
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;



}

.broadcasts_selected_interactives_info>img {
    width: 54px;
    height: 54px;;
}

.broadcasts_selected_interactives_info {
    display: grid;
    justify-items: center;
    margin-left: 378px;;
    width: 300px;
    margin-top: 34px;
}

.broadcasts_selected_interactives_info_h2 {
    margin-top: 10px;
    font-family: "Lato", sans-serif;
    color: #7D7D7D;
    font-weight: 500;
    font-style: Medium;
    font-style: Medium;
    font-size: 16px;
    letter-spacing:0.16px;
    text-align: center;
    vertical-align: middle;

}
.broadcasts_selected_interactives_header{
    width: 1056px !important;
}
.broadcasts_selected_interactives_header>div {
    margin-bottom: 10px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    letter-spacing:0.16px;
    vertical-align: middle;
    color: #1D1D1D;
    overflow-x: hidden;
}

.broadcasts_selected_interactives {

    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Medium;
    font-size: 16px;
    letter-spacing: 0.16px;;
    vertical-align: middle;
    color: #1D1D1D;
    overflow-x: hidden;
    min-height: 162px;
}

.broadcasts_list {
    width: 1056px;
    margin-top: 20px;;
    padding-bottom: 100px;;
    overflow-x: hidden;
}

.broadcasts_list_header {
    display: flex;
    margin-left: 22px;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;;
    letter-spacing: 0.16px;
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;
    margin-bottom: 15px;
    overflow-x: hidden;
}

.broadcasts_list_header_title {
    width: 89px;
    text-align: left;
}

.broadcasts_list_header_date {
    margin-left:356px;
    width: 96px;
    text-align: center;
}

.broadcasts_list_header_count {
    margin-left: 59px;
    width: 192px;
    text-align: center;

}

.broadcasts_list_list {

    display: flex;
    flex-direction: column;
    overflow-x: hidden;
}

.broadcasts_list_list_item {
    overflow-x: hidden;
    display: flex;
    align-items: center;
    height: 46.13px;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    letter-spacing:0.16px;
    text-align: center;
    vertical-align: middle;
}

.broadcasts_list_list_item>img {
    height: 18px;
    width: 14px;
    margin-left: auto;
    margin-right: 22px;
}

.broadcasts_Line {
    background-color: #e9e9e9 !important;
    height: 1px !important;
}

.broadcasts_list_list_item_title {
    margin-left:22px;
    width: 400px;
    text-align: left;
}

.broadcasts_list_list_item_date {
    margin-left: 16px;
    width: 154px;
    text-align: center;
}

.broadcasts_list_list_item_count {
    margin-left:92px;
    width: 68px;
    text-align: center;
}



.broadcasts_list_list_item_download_many {
    margin-left: 201px;
    color: #853CFF;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;;
    letter-spacing: 0.2px;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;

}
#selected_list{width: 1056px !important;
}

#selected_list > div{
    height: 36.15px !important;
}
.broadcasts_show_more {
    width: 141px;

    margin-left: 457px;
    margin-top: 15px;;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    letter-spacing: 0.16px;
    text-align: center;
    vertical-align: middle;
    color: #853CFF;
    cursor: pointer;
}

.broadcasts_list_selected_download {
    height: 36px !important;
    width: 214px;
    margin-left: 842px;;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;
    letter-spacing: 0.2px;
    vertical-align: middle;
    color: white;
    background-color: #6AB23D;
    text-align: center;
    vertical-align: middle;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}


.broadcasts_popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.32);
    z-index: 999;
    display: flex;
    justify-content: center;
}

.broadcasts_popup {
    margin: auto auto;
    ;
    background: white;
    border-radius: 18px;
    min-height: 344px;
    width: 524px
    ;
    position: relative;

    gap: 0px;
}

.broadcasts_popup-header {}

.broadcasts_popup-header-text {
    margin-top: 24px;
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
    font-size: 20px;
    letter-spacing: 0.2px;
    text-align: center;

}

.broadcasts_popup-close {
    height: 16px !important;
    width: 16px;
    position: absolute;
    top: 24px !important;
    right: 24px;
    cursor: pointer;
    color: #aaa;
    cursor: pointer;
}

.broadcasts_popup-body {
    display: flex;
    flex-direction: column;
    width: 484px;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    vertical-align: middle;
    margin: 0 auto;
    margin-top:19px !important;
}
.broadcasts_popup-body > div{
    line-height: 19.2px !important;
}
.broadcasts_popup-option {
    margin-left: 51px;
    display: flex;
    align-items: center;
    font-size: 18px;

    cursor: pointer;
    position: relative;
}

.broadcasts_popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    position: relative;
    padding-left: 62px;
}

.broadcasts_popup-option input[type="radio"] {
    display: none;
}

.broadcasts_popup-option input[type="radio"]+span::before {
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

.broadcasts_popup-option input[type="radio"]:checked+span::after {
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

.broadcasts_popup-option input[type="radio"]:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(133, 60, 255, 0.6);
}

.broadcasts_popup-option span {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: 32px;
    letter-spacing: 1px;
    position: relative;
}



.broadcasts_popup-footer {
    font-family: "Lato", sans-serif;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 239px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px !important;
    letter-spacing: 0.2px !important;
    text-align: center;
    vertical-align: middle;
     margin-top: 18px;;
        margin-bottom: 20px;;  height: 41px;; 
}

.broadcasts_popup_back {

    color: #853CFF;
}

.broadcasts_popup_send {
    cursor: pointer;
    display: flex;
    font-family: "Lato", sans-serif;
    align-items: center;
    justify-content: center;
    width: 138px !important;
    height: 41px;
    color: #6AB23D;
    margin-left: 20px;
    border:2px solid #6AB23D;
    border-radius: 8px;

}

.broadcasts_popup-submit {
    font-family: "Lato", sans-serif;
    width: 138px;
    height: 41px;
    background-color: white;
    color: #853cff;
    border: 2px solid #853cff;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 20px;
    border-radius: 5px;
    cursor: pointer;
    vertical-align: middle;
    letter-spacing: 1px;
}

.broadcasts_popup-submit:hover {
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
.margin10{
    margin-top:10px !important;
}
}

</style>