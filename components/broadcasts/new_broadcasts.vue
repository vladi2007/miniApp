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
   
        

        
        
         const saved_to = localStorage.getItem(BROADCASTS_TO_NUMBER_KEY);
    if (saved_to) {
        to_number.value = Number(saved_to) || 9;
    }
        isReady.value=true



});

const sendStatus = ref<"idle" | "sending" | "success" | "error">("idle")

async function validateBeforeSend(){
    if(count.value === 0){
        window.Telegram.WebApp.showAlert(`У выбранных интерактивов должен быть хотя бы один участник!`);
           return;
    }
if ((text.value.trim().length <1  && uploadedFile.value ===null)){
        window.Telegram.WebApp.showAlert(`Прикрепите файл или наберите текст сообщения!`);
        return;
    }
    showPopup.value=true;

}
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

        const response = await $fetch('/api/broadcasts/send', {
            method: 'POST',
            body: formData,
        });

        
        if( response.success){   sendStatus.value = "success";}
        
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
const expandedTitles = reactive<{ [key: string]: boolean }>({});
const expandedLeaders = reactive<{ [key: string]: boolean }>({});

// Функции для переключения раскрытия
function toggleTitle(id: string) {
  expandedTitles[id] = !expandedTitles[id];
}

function toggleLeader(id: string) {
  expandedLeaders[id] = !expandedLeaders[id];
}
const telegramName = useState<string | null>('userName')
</script>

<template>
        <Layout :active_nav="'broadcasts'">
        <div class="broadcasts_input"> <label>Введите текст рассылки<textarea v-model="text" id="description_input"
                    placeholder="Текст" maxlength="200" /></label></div>
        <div class="broadcasts_custom-file-upload" :class="{ 'broadcasts_file-uploaded': uploadedFileName }"
            @click="!uploadedFileName && openFileDialog()">

            <input ref="fileInput" type="file" 
                 hidden 
                @change="handleFileChange" />

            <template v-if="uploadedFileName">
                <span class ="uploadedFileName"> {{ uploadedFileName }} </span>
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

                    <div class="broadcasts_list_list_item_selected" :class="['broadcasts_selected_item']">
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
                        <img src="/public/images/history/history_delete.svg" style="cursor: pointer;"
                            @click="selectedInteractives = selectedInteractives.filter(item => item !== id)" />
                    </div>
                    <div class="broadcasts_Line" style="width: calc((1030/1280)*100dvw); margin: 0 auto;" />
                </div>

            </div>
            <div class="broadcasts_list_selected_download" v-if="selectedInteractives.length > 0"
                @click="validateBeforeSend() ">
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
                <div class="broadcasts_list_header_leadername">
                    Ведущий
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
                    <div class="broadcasts_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }" @click="toggleTitle(item.id)">
                        {{ item.title }}
                    </div>
                    <div class="broadcasts_list_list_item_leadername title-clamp" :class="{ expanded: expandedLeaders[item.id] }" @click="toggleLeader(item.id)">
                        {{ item.username }}
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
        </Layout>

</template>

<style>

@import url("~/assets/css/broadcasts/new_broadcasts.scss");
@import url("~/assets/css/broadcasts/new_broadcasts_static.scss");
</style>