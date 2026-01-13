<script setup lang="ts">
import { postEvent } from '@telegram-apps/sdk';
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'
import Header from "~/components/header.vue"
const HISTORY_KEY = 'history_interactives'
const HISTORY_SELECT_MANY_KEY = 'history_select_many'
const HISTORY_SELECT_ONE_KEY = 'history_select_one'
const HISTORY_TO_NUMBER_KEY = 'history_to_number'
const showPopup = ref<boolean>(false);
const selectedInteractives = ref<number[]>([]);
const selectedInteractive = ref<number>(0);
const selectedOption = ref<string | null>("");
const selectMany = ref(false);
const from_number = ref(0)
const to_number = ref(9)
import header_logo from "~/components/header_logo.vue"
import { useQuery, useMutation,useQueryClient  } from '@tanstack/vue-query'
watch(selectedInteractives, (newSelectedInteractives) => {
    saveToDeviceStorage(HISTORY_KEY, newSelectedInteractives);
});

watch(selectMany, (newSelectMany) => {
    saveToDeviceStorage(HISTORY_SELECT_MANY_KEY, newSelectMany)
})
watch(selectedInteractive, (newSelectOne) => {
    saveToDeviceStorage(HISTORY_SELECT_ONE_KEY, newSelectOne)
})
watch(to_number, (new_Numb) => {
    saveToDeviceStorage(HISTORY_TO_NUMBER_KEY, new_Numb)
})

const webApp = ref(null)

const props = ref()
const isReady = ref(false)
const queryClient = useQueryClient() 
onMounted(async () => { 
        const savedInteractives = loadFromDeviceStorage(HISTORY_KEY);
        if (Array.isArray(savedInteractives)) {

            selectedInteractives.value = savedInteractives

        }

        const savedSelectMany = loadFromDeviceStorage(HISTORY_SELECT_MANY_KEY);
        if (savedSelectMany && selectedInteractives.value.length > 0) {
            selectMany.value = savedSelectMany;
        }
        const saved_to = loadFromDeviceStorage(HISTORY_TO_NUMBER_KEY)
        to_number.value = saved_to || 9
        const savedSelectOne = loadFromDeviceStorage(HISTORY_SELECT_ONE_KEY)


        isReady.value=true



});
const userId = useState('telegramUser')
const userRole = useState('userRole')
const { data: interactivesData, isLoading, refetch } = useQuery({
  queryKey: computed(() => ['history', userId.value, 'conducted', from_number.value, to_number.value]),
  queryFn: async () => {
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
  refetchOnMount: false,
})
async function more_load() {
    to_number.value = to_number.value + 10
   
}
const is_end = ref<string>("")
const finder = ref<string>("")
const is_empty_list = computed(() => {
    if (interactivesData?.value?.interactives_list?.length > 0) {
        return false;
    } else {
        return true;
    }
})
console.log(props)
const list = ref<any>([
])
watch(props, (newProps) => {
    if (newProps?.data?.value?.interactives_list) {
        list.value = newProps.data.interactives_list
    }
    is_end.value = newProps.data.is_end
    console.log(list)
})

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
async function submitReport() {
    showPopup.value = false
    if (selectedInteractives.value.length > 0 || selectedInteractive) {
        if (selectedOption.value !== 'forAnalise' && selectedOption.value !== 'forLeader') {
            window.Telegram.WebApp.showAlert(`Выберите тип отчета!`);
            return;
        }
        try {
            const hasSelectedInteractives = selectedInteractives.value.length > 0;
            let interactiveIds;
            if (hasSelectedInteractives) {
                interactiveIds = selectedInteractives.value.map(id => ({ id }));
            } else {
                interactiveIds = [{ id: selectedInteractive.value }];
            }

            const body = {
                telegram_id: userId.value,
                interactive_id: interactiveIds,
                report_type: selectedOption.value
            };

            const response = await $fetch('/api/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response) {
                postEvent('web_app_request_file_download', {
                    url: response.data,
                    file_name: response.name
                })
            } else {
                throw new Error(response.error || 'Не удалось получить ссылку на файл')
            }
            
            selectedOption.value=""
        } catch (error) {
            window.Telegram.WebApp.showAlert(`Ошибка при выгрузке отчета: ${error.message}`);
        }
    }
    else {
        window.Telegram.WebApp.showAlert(`Выберите хотя бы один интерактив для формирования отчёта!`);
    }
    if (window.Telegram?.WebApp?.expand) {
        setTimeout(() => {
            Telegram.WebApp.requestFullscreen()
        }, 0);
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




watch(selectedInteractives, (newSelectedInteractives) => {
    console.log(newSelectedInteractives.length)
    selectMany.value = newSelectedInteractives.length > 0
}, { deep: true })


const router = useRouter()
async function goTo(url: string, active:string) {
    if (active ==="reports") return
    await clearDeviceStorage(HISTORY_KEY)
    await clearDeviceStorage(HISTORY_SELECT_MANY_KEY)
    await clearDeviceStorage(HISTORY_SELECT_ONE_KEY);
    await clearDeviceStorage(HISTORY_TO_NUMBER_KEY);
    router.push(url)
}

function urlReport(value:string){
    if (selectedOption.value!==value) {return "/images/interactives/circle_report.svg"}
    else {return "/images/interactives/circle_report_picked.svg"}
}
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
    <Layout :active_nav="'reports'">
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
            <div :class="{ selected_list: selectedInteractives.length > 0 }" >


                <div class="history_list_list" v-for="id in selectedInteractives" :key="id"
                    v-if="selectedInteractives.length > 0" style="height: calc((36/832)*100dvh);" id="history_list_list">

                    <div class="history_list_list_item_selected" :class="['selected_item']">
                        <div class="history_list_list_item_title">
                            {{interactivesData?.interactives_list?.find(item => item.id === id)?.title}}
                        </div>
                        <div class="history_list_list_item_date">
                            {{interactivesData?.interactives_list?.find(item => item.id === id)?.date_completed}}
                        </div>
                        <div class="history_list_list_item_count"
                            style="width:calc((226 / 1280) * 100dvw) !important; ">
                            Количество участников: {{interactivesData?.interactives_list?.find(item => item.id === id)?.participant_count}}
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
        <div class="history_empty_list_info" v-if="interactivesData && is_empty_list">
            <img src="/public/images//history/finder_info.svg" />
            <div class="history_empty_list_info_h1">
                У Вас нет интерактивов
            </div>
            <div class="history_empty_list_info_h2">
                Проведите свой первый интерактив и он отобразится здесь
            </div>
        </div>
        <div class="history_list" v-if="interactivesData && !is_empty_list">
            <div class="history_list_header">
                <div class="history_list_header_title">
                    Название
                </div>
                <div class="history_list_header_leadername">
                    Ведущий
                </div>
                <div class="history_list_header_date">
                    Дата
                </div>
                <div class="history_list_header_count">
                    Количество участников
                </div>
            </div>
            <div class="history_list_list" v-for="(item, index) in interactivesData.interactives_list" :key="item.id">
                <div class="Line" v-if="index === 0" />
                <div class="history_list_list_item">
                    <div class="history_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }" @click="toggleTitle(item.id)">
                        {{ item.title }}
                    </div>
                    <div class="history_list_list_item_leadername title-clamp" :class="{ expanded: expandedLeaders[item.id] }" @click="toggleLeader(item.id)">
                        {{ item.username }}
                    </div>
                    <div class="history_list_list_item_date">
                        {{ item.date_completed }}
                    </div>
                    <div class="history_list_list_item_count">
                        {{ item.participant_count }}
                    </div>
                    <div class="history_list_list_item_download_one" @click="openPopup(item.id)">Выгрузить</div>
                    <div class="history_list_list_item_download_many"
                        :style="{ visibility: selectedInteractives.includes(item.id) ? 'hidden' : 'visible' }"
                        @click="selectManyOption(item.id)">Выбрать</div>
                </div>
                <div class="Line" />
            </div>
            <div class="history_show_more" v-if="!interactivesData.is_end" @click="more_load()">Показать еще</div>
        </div>
        
    

    <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
            <div class="popup-header">
                <div class="popup-header-text">Какой отчет хотите выгрузить</div>
                <img src="/images/history/Vector_1.svg" class="popup-close" @click="closePopup" />
            </div>
            <div class="popup-body">
                <label class="popup-option" @click="selectedOption='forLeader'">
                    <img :src="urlReport('forLeader')" />
                    <span class="popup-option-span">Отчет для ведущего</span>
                </label>
                <label class="popup-option second" @click="selectedOption='forAnalise'">
                    <img :src="urlReport('forAnalise')"/>
                    <span class="popup-option-span">Отчет для обработки</span>
                </label>
            </div>
            <div class="popup-footer">
                 <button @click="showPopup=false" class="popup-cancel">Отменить</button>
                <button @click="submitReport" class="popup-submit">Выгрузить</button>
            </div>
        </div>
    </div>
    </Layout>
</template>

<style>



@import url("~/assets/css/history/new_history.scss");
@import url("~/assets/css/history/new_history_static.scss");
</style>