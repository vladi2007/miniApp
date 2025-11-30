<script setup lang="ts">
import { postEvent } from '@telegram-apps/sdk';
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'
import header_logo from "~/components/header_logo.vue"
import Header from "~/components/header.vue"
const finder = ref<string>("")
const isOpen = ref(false)
const selectedText = ref("all")
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const options = ["Все", "Проведенные", "Не проведенные"]
const options_code = {
    "all": "Все",
    "conducted": "Проведенные",
    "not_conducted": "Не проведенные"
}
function toggleDropdown() {
    isOpen.value = !isOpen.value
}

const queryClient = useQueryClient() 

const userId = useState('telegramUser')
const userRole = useState('userRole')
async function selectOption(option: string) {
    selectedText.value = option
    isOpen.value = false
    to_number.value = 9
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

const route = useRoute();
// Добавляем и удаляем обработчик событий
onMounted(async () => {
 const fromUrl = route.query.from as string | undefined;
 if (fromUrl){
    console.log(fromUrl?.startsWith('/leader/'))
  if (fromUrl?.startsWith('/leader/')) {
    await queryClient.invalidateQueries({
      predicate: (query) => {
        return (
          query.queryKey[0] === 'interactives' &&
          query.queryKey[1] === userId.value
        );
      },
    });

   await queryClient.invalidateQueries({
      predicate: (query) => {
        return (
          query.queryKey[0] === 'broadcasts' &&
          query.queryKey[1] === userId.value
        );
      },
    });

    await queryClient.invalidateQueries({
      predicate: (query) => {
        return (
          query.queryKey[0] === 'history' &&
          query.queryKey[1] === userId.value
        );
      },
    });

  }
 }
    
        const saved_to = loadFromDeviceStorage(INTERACTIVES_TO_NUMBER_KEY)
        to_number.value = saved_to || 9
        const saved_filter = loadFromDeviceStorage(INTERACTIVES_FILTER_KEY)
        selectedText.value = saved_filter || "all"
          isReady.value = true



});
// В onMounted добавь:
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
const is_empty_list = computed(() => {
    if (interactivesData){
        if (interactivesData?.value?.interactives_list?.length > 0) {
        return false;
    } else {
        return true;
    }
    }
    
})
const webApp = ref(null)

const isReady = ref(false)
const from_number = ref<Number>(0)
const to_number = ref<Number>(9)
const INTERACTIVES_TO_NUMBER_KEY = 'interactives_to_number'
const INTERACTIVES_FILTER_KEY = 'interactives_filter'
watch(to_number, (new_Numb) => {
    saveToDeviceStorage(INTERACTIVES_TO_NUMBER_KEY, new_Numb)
})
watch(selectedText, (newText) => {
    saveToDeviceStorage(INTERACTIVES_FILTER_KEY, newText)
})


const router = useRouter()
async function goTo(url: string, active: string) {
    if (active === "interactives") return
    router.push(url)
    await clearDeviceStorage(INTERACTIVES_TO_NUMBER_KEY)
    await clearDeviceStorage(INTERACTIVES_FILTER_KEY)
}
const is_ready=ref<boolean>()
const { data: interactivesData, isLoading, refetch } = useQuery({
    
  queryKey: computed(() => ['interactives', userId.value, selectedText.value, from_number.value, to_number.value]),
  queryFn: async () => {
    if (!userId) return { interactives_list: [], is_end: true }
    const res = await $fetch('/api/reports/preview', {
      query: {
        telegram_id: userId.value,
        filter: selectedText.value,
        from_number: from_number.value,
        to_number: to_number.value
      }
    })
    is_ready.value=true
    console.log(userId.value)
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


function closePopup() {
    showPopup.value = false;

}
const deleteMutation =useMutation({
    mutationFn: async (id:string) =>{
         const response = await $fetch(`/api/delete_interactive`, {
    method: 'DELETE',
    query: {
      telegram_id: userId.value,
      id: id
    },

  })
  showDeletePopap.value=false
  return true;
  
    },


    onSuccess: async () => {
    // 4. После успешного дублирования — рефетчим список интерактивов
    await queryClient.invalidateQueries(['interactives', userId.value])
  },
})
 function deleteInteractive(id: string) {
  deleteMutation.mutate(id)

}

const duplicateInteractiveMutation = useMutation({
  mutationFn: async (id: string) => {
    // 1. Получаем интерактив
    const data = await $fetch(`/api/get_interactive`, {
      method: 'GET',
      query: { telegram_id: userId.value, id }
    })

    const plain = JSON.parse(JSON.stringify(data))

    // 2. Подготавливаем payload
    
    const formData = new FormData();


    formData.append("telegram_id", String(userId?.value || 0));
    formData.append("interactive", JSON.stringify(plain));
    // 3. Создаем интерактив
    await $fetch("/api/create_interactive", {
      method: "POST",
      query: { telegram_id: userId?.value || 0 },
      body: formData
    })

    return true
  },
  onSuccess: async () => {
    // 4. После успешного дублирования — рефетчим список интерактивов
    await queryClient.invalidateQueries(['interactives', userId.value])
  },
  onError: (err: any) => {
    console.error('Ошибка дублирования:', err)
    window.Telegram.WebApp.showAlert('Не удалось продублировать интерактив.')
  }
})
function duplicateAndSaveInteractive(id: string) {
  showPopup.value = false
  duplicateInteractiveMutation.mutate(id)
}
const show_report_Popup = ref<boolean>(false)
const selectedOption = ref<string | null>("");
const selectedInteractive = ref<number>(0);
async function submitReport() {
    showPopup.value = false

    if (selectedInteractive) {
        if (selectedOption.value !== 'forAnalise' && selectedOption.value !== 'forLeader') {
            window.Telegram.WebApp.showAlert(`Выберите тип отчета!`);
            return;
        }
        try {
            const interactiveIds = [{ id: selectedInteractive.value }];

            const body = {
                telegram_id: userId.value,
                interactive_id: interactiveIds,
                report_type: selectedOption.value
            };

            const response = await fetch('/api/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка сервера');
            }

            const data = await response.json()

            if (data.url) {

                postEvent('web_app_request_file_download', {
                    url: `https://voshod07.ru${data.url}`,
                    file_name: data.userFileName
                })
            } else {
                throw new Error(data.error || 'Не удалось получить ссылку на файл')
            }
            selectedOption.value = ""
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


const showDeletePopap = ref(false)
const isRunning = ref(false)
async function deletePopup(id: string) {
    try {
        const data = await $fetch(`/api/get_state_interactive`, {
            method: 'GET',
            query: {

                id: Number(id)
            }
        })
        isRunning.value = data.data
    }
    catch (err) {
        console.error('Ошибка удаления', err)
        window.Telegram.WebApp.showAlert('Не удалось получить состояние интерактива!')
    }
    currentInteractiveId.value = id
    showDeletePopap.value = true
}

const info =computed(()=>{
    if (selectedText.value === 'conducted') return "Проведите свой первый интерактив и он отобразится здесь"
    else return "Создайте свой первый интерактив и он появится здесь"
})
function goToBroadcast(interactiveId) {
  router.push({
    path: '/leader/broadcasts',     // путь к странице рассылки
    query: { selected: interactiveId } // передаём id интерактива
  });
}
</script>
<template>
    <div class="interactives">
        <header_logo/>
        <div class ="interactives_margins" >

        
              
         <Header :goTo="goTo" :active="'interactives'" />
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
                    <div class="interactives_custom-dropdown-option" v-for="(label, value) in options_code" :key="value"
                        @click.stop="selectOption(value)">
                        <img class="interactives_custom-dropdown-circle" src="/public/images/interactives/picked.svg"
                            v-if="selectedText === value" />
                        <img class="interactives_custom-dropdown-circle" src="/public/images/interactives/Ellipse.svg"
                            v-else />
                        <div class="interactives_custom-dropdown-text">{{ label }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="interactives_empty_list_info" v-if="interactivesData &&  is_empty_list ">
            <img src="/public/images//history/finder_info.svg" />
            <div class="interactives_empty_list_info_h1">
                У Вас нет интерактивов
            </div>
            <div class="interactives_empty_list_info_h2">
                {{info}}
            </div>
        </div>
        <div class="interactives_list" v-if="interactivesData && !is_empty_list ">
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
            <div class="interactives_list_list" v-for="(item, index) in interactivesData.interactives_list" :key="item.id">
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
                        <div class="interactives_leader_board" v-if="item.is_conducted" title="Показать лидерборд"  @click="goTo(`/leader/interactive_leader_board/${item.id}`, '')">
                            <img src="/images/interactives/leader_board.svg"
                                 id="leader_board" />
                        </div>
                        <div class="interactives_dublicate" title="Дублировать интерактив" @click="Popup(item.id)">
                            <img src="/images/interactives/dublicate_2.svg"
                              id="dublicate"/>
                        </div>

                        <div class="interactives_edit" title="Редактировать интерактив" v-if="!item.is_conducted"
                            @click="edit_interactive(item.id)">
                            <img src="/images/interactives/edit_2.svg"
                              id="edit" />
                        </div>
                        <div class="interactives_start" title="Запустить интерактив" v-if="!item.is_conducted"
                            @click="start_interactive(item.id)">
                            <img src="/images/interactives/start_2.svg"
                               />
                        </div>
                        <div class="interactive_delete" v-if="!item.is_conducted" title="Удалить интерактив"
                            @click="deletePopup(item.id)">
                            <img src="/images/interactives/vector.png" id="delete" />
                        </div>
                        <div class="interactives_list_list_item_actions" :ref="el => setDropdownRef(el, index)">
                            <div class="interactives_more_options" v-if="item.is_conducted"
                                @click="toggleItemDropdown(item.id)" title="Еще">
                                <img src="/images/interactives/more.svg"
                                  id="more_options" />
                            </div>
                            <div class="interactives_item-dropdown-options" v-if="openDropdownId === item.id"
                                style=" z-index: 10001 !important;">
                                <div class="interactives_item-dropdown-option" id="first_option"
                                    @click="show_report_Popup = true; selectedInteractive = item.id; openDropdownId = null;"
                                    style="  margin-top: calc((22/832)*100dvh);">
                                    <img src="/public/images/interactives/download.svg" id="first_option_img"
                                        class="interactives_item-dropdown-icon"
                                        style="     height: calc((24/832) * 100dvh) ;width: calc((24 / 1280) * 100dvw) ; margin-left: calc((24/1280)*100dvw);" />
                                    <span style="margin-left: calc((9/1280)*100dvw);">Выгрузить отчет</span>
                                </div>
                                <div class="interactives_item-dropdown-option" id="second_option" @click="goToBroadcast(item.id)"
                                    style="  margin-top: calc((14/832)*100dvh);">
                                    <img src="/public/images/interactives/send.svg" id="second_option_img"
                                        class="interactives_item-dropdown-icon"
                                        style="     height: calc((24/832) * 100dvh) ;width: calc((24 / 1280) * 100dvw) ; margin-left: calc((24/1280)*100dvw);" />
                                    <span style="margin-left: calc((9/1280)*100dvw);">Отправить рассылку</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="interactives_Line" />
            </div>
            <div class="interactives_show_more" v-if="!interactivesData.is_end" @click="more_load()">Показать еще</div>
        </div>
    </div>
        <div v-if="showPopup" class="interactives_popup-overlay">
            <div class="interactives_popup">
                <div class="interactives_popup-header">
                    <div class="interactives_popup-header-text">Вы точно хотите продублировать выбранный интерактив?
                    </div>
                    <img src="/images/history/Vector_1.svg" class="interactives_popup-close" @click="closePopup" />
                </div>
                <div class="interactives_popup-body">

                    <button class="interactives_popup-button"
                        @click="duplicateAndSaveInteractive(String(currentInteractiveId))">Да</button>
                    <button class="interactives_popup-button" @click="closePopup()">Нет</button>
                    <button class="interactives_popup-button"
                        @click="dublicate_interactive(String(currentInteractiveId))">Да, и
                        хочу его сразу отредактировать</button>
                </div>
            </div>
        </div>
        <div v-if="showDeletePopap" class="interactives_delete_popup-overlay">
      <div class="interactives_delete_popup">
        <div class="interactives_delete_popup-header">
          <div class="interactives_delete_popup-header-text">
            {{ isRunning
              ? 'Интерактив запущен! Все данные интерактива будут удалены!'
              : 'Вы действительно хотите удалить?' }}
          </div>
        </div>
        <div class="interactives_delete_popup-body">
          <button class="interactives_delete_popup-button" @click="deleteInteractive(String(currentInteractiveId))">
            {{ isRunning ? 'Закончить и удалить интерактив' : 'Удалить' }}
          </button>
          <button class="interactives_delete_popup-button" @click="closePopup()">Отмена</button>
        </div>
      </div>
    </div>
    </div>


    <div v-if="show_report_Popup === true" class="popup-overlay">
        <div class="popup">
            <div class="popup-header">
                <div class="popup-header-text">Какой отчет хотите выгрузить</div>
                <img src="/images/history/Vector_1.svg" class="popup-close"
                    @click="show_report_Popup = false; selectedInteractive = 0; selectedOption = ''" />
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
@media (max-height:1078px), (max-width:1918px){
    .interactives_margins{width: calc((1056 / 1280) * 100dvw);
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin-left: calc((112 / 1280) * 100dvw);
    }
.interactives_list_list_item_actions {
    position: relative;
}

.interactives {
    width: 100dvw;
    height: 100dvh;
    
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

.nav>div {
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
    margin-top: calc((25 / 832) * 100dvh);
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
    width: calc((765/1280) * 100dvw);
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
    padding-left: calc((50 / 1280) * 100dvw) !important;
   box-sizing: border-box;
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

.interactives_create {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6AB23D;
    border-radius: calc((5/832) * 100dvh);
    width: calc((261/1280) * 100dvw) ;
    height: calc((39 / 832) * 100dvh) ;
    /* padding-top:   calc((8 / 832) * 100dvh);
    padding-left:  calc((35/1280) * 100dvw) ;;;
    padding-bottom:   calc((8 / 832) * 100dvh);
    padding-right:  calc((35/1280) * 100dvw) ;;; */
       white-space: nowrap ;
   
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    text-align: center;
    vertical-align: middle;
    color: white;
    margin-left: calc((30/1280)*100dvw);
}

.interactives_input-group_type {
    position: relative;
    z-index: 1000;
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
    margin-left: calc((290 / 1280) * 100dvw);
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
    margin-top: calc((20 / 832) * 100dvh);
    padding-bottom: calc((100 / 832) * 100dvh);
}

.interactives_list_header {
    display: flex;
    margin-left: calc((22 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
    letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
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
    width: calc((137 / 1280) * 100dvw);
    text-align: center; 
}

.interactives_list_list_item_status {
    margin-left: calc((30 / 1280) * 100dvw) !important;
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
    display: flex;position: relative; 
    align-items: center;
    width: calc((152 / 1280) * 100dvw);;
    margin-left: calc((77 / 1280) * 100dvw);
}


#leader_board, #dublicate{
      width: calc((24/1280) * 100dvw) !important;
    height: calc((24/832) * 100dvh) !important;
}
#edit{
    width: calc((16/1280) * 100dvw) !important;
    height: calc((17/832) * 100dvh) !important;
}
.interactives_start > img{
        width: calc((12/1280) * 100dvw) !important;
    height: calc((17/832) * 100dvh) !important;
}
.interactives_leader_board {
    background-color: #6AB23D;
    margin-right: calc((10 / 1280) * 100dvw);
}

.interactives_dublicate {
    background-color: #853CFF;
}


.interactives_edit {
    background-color: #F0436C;
    margin-left: calc((10 / 1280) * 100dvw);
}


.interactives_start {
    background-color: #6AB23D;
    margin-left: calc((10 / 1280) * 100dvw);
}

.interactive_delete {
    width: calc((14/1280) * 100dvw) !important;
    height: calc((18/832) * 100dvh) !important;
    cursor: pointer;
    margin-left: calc((10 / 1280) * 100dvw);
}
.interactive_delete > img{
    width: calc((14/1280) * 100dvw) !important;
    height: calc((18/832) * 100dvh) !important;
}

.interactives_dublicate,
.interactives_edit,
.interactives_start,
.interactives_leader_board {
    width: calc((36/1280) * 100dvw);
    height: calc((36/832) * 100dvh);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc((5/832)*100dvh);
    cursor: pointer;
}

/* Стили для троеточия и dropdown */
.interactives_dots {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((30 / 1280) * 100dvw);
    height: calc((30 / 832) * 100dvh);
    margin: 0 auto;
}

.interactives_dots img {
    width: calc((30 / 1280) * 100dvw);
    height: calc((30 / 832) * 100dvh);
    margin: 0 auto;
    margin-left: calc((46 / 1280) * 100dvw);
    background-color: #6AB23D;
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
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;
   white-space: nowrap;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
    letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
    vertical-align: middle;
    width: calc((271/1280) * 100dvw);
}

.interactives_item-dropdown-option:hover {
    background-color: #DFDFDF;
    border-radius: calc((7/832)*100dvh);
}



.interactives_more_options {
    margin-left: calc((57 / 1280) * 100dvw);
    display: flex;
    align-items: center;
    justify-content: center;

  
    cursor: pointer;
    z-index: 0 !important;
}

.interactives_more_options>img {
    z-index: 0 !important;
    width: calc((9.75/1280) * 100dvw) !important;
    height: calc((18.75/1280) * 100dvw) !important;
}



.interactives_popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);

    z-index: 11999;

    display: flex;
    justify-content: center;
    align-items: center;
}

.interactives_popup {
    background: white;
    border-radius: 35px;
    width: 818px;
    height: 438px;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    position: relative;
}

.interactives_popup-close {
    position: absolute;
    top: 25px;
    right: 25px;
    cursor: pointer;
    font-size: 30px;
    color: #aaa;
}

.interactives_popup-header-text {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 36px;
    letter-spacing: 1px;
    padding-top: 48px;
    width: 718px;
    margin: 0 auto;
    height: 20px;
}

.interactives_popup-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 24px;
}

.interactives_popup-button {
    width: 320px;
    height: 62px;
    border-radius: 5px;
    font-family: "Lato", sans-serif;
    font-size: 24px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
}

.interactives_popup-button:nth-child(2) {
    background-color: #f0436c;
    color: white;
}

.interactives_popup-button:nth-child(2):hover {
    background-color: #de7d94;
}

.interactives_popup-button:nth-child(3) {
    background-color: #853cff;
    color: white;
}

.interactives_popup-button:nth-child(3):hover {
    background-color: #aa77ff;
}

.interactives_popup-button:nth-child(1) {
    background-color: #6ab23d;
    color: white;
}

.interactives_popup-button:nth-child(1):hover {
    background-color: #9ac57e;
}




.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup {
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


.interactives_delete_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  z-index: 22222999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.interactives_delete_popup {
  background: white;
  border-radius: 35px;
  width: 818px;
height: 372px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  position: relative;
}
.interactives_delete_popup-close {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
  font-size: 30px;
  color: #aaa;
}
.interactives_delete_popup-header-text {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 36px;
text-align: center;
  line-height: 37px;
  width: 638px;
  margin: 0 auto;
  padding-top:48px;;
  min-height: 64px;letter-spacing: 0px;
}
.interactives_delete_popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 44px;;
  gap: 24px;
}
.interactives_delete_popup-button {
  width: 638px;
  height: 62px;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  font-size: 32px;
  font-weight: 400;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
 
}
.interactives_delete_popup-button:nth-child(1) {
  background-color: #6ab23d;
  color: white;
}
.interactives_delete_popup-button:nth-child(1):hover {
  background-color: #559130;
}
.interactives_delete_popup-button:nth-child(2) {
  background-color: white;
  color: #6AB23D;
  border: 2px solid #6AB23D;
  border-color: #6AB23D;
}
.interactives_delete_popup-button:nth-child(2):hover {
  background-color:  #9AC57E;
  color: white;
}
}
@media (min-width:1918px) and (min-height:1078px){


     .interactives_margins{width: 1056px; 
        box-sizing: border-box;
    padding: 0;
    margin: 0;
       margin:0 auto 0 auto;
    }
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




.interactives_finder {
    width: 1056px;
    margin-top: 61px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.interactives_finder_header {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    letter-spacing: 0.16px;
    vertical-align: middle;
    color: #1D1D1D;
}

.interactives_finder_finder {
    position: relative;
    display: flex;
    align-items: center;
}

.interactives_search-input {
    width: 765px;
    height: 39px;
    line-height:39px;
    color: #1D1D1D !important;
    border: 1.5px solid #E0E0E0;
    border-radius:8px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-left:50px;
       box-sizing: border-box;
}

.interactives_search-input::placeholder {
    line-height: 39px;
    display: flex;
    align-items: center;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #A9A9A9;
}

.interactives_input-icon {
    position: absolute;
    left: 17px;
    top: 50%;
    transform: translateY(-50%);
    width:19px;
    height: 19px;
    pointer-events: none;
}

.interactives_create {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6AB23D;
    border-radius:5px;white-space: nowrap ;
     width: 261px;
    height:39px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: 20px;
    letter-spacing: 0.2px;
    text-align: center;
    vertical-align: middle;
    color: white;
    margin-left: 30px;;
}

.interactives_input-group_type {
    position: relative;
    z-index: 1000;
    height: 47px;
    width: 47px !important;
}

.interactives_input-group_type select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 47px;
    border-radius: 14px;;
    box-sizing: border-box;
    font-size: 16px;;
}

.interactives_input-group_row {
    display: flex;
    width: 159px;
    height: 47px;;
    align-items: center;
    border-radius:14px;;
    background-color: #F3F3F3;
}

/* Кастомный выпадающий список */
.interactives_custom-dropdown {
    margin-top: 20px;;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width:159px;;
    height:48px;;
    border-radius: 14px;;
    background-color: #F3F3F3;
    box-sizing: border-box;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px !important;;
    z-index: 999;
    letter-spacing: 0.1px;
    vertical-align: middle;
    box-sizing: border-box;
    padding-left: 22px;;
    padding-right: 22px;;
}

.interactives_custom-arrow {
    width: 16px;;
    height: 9px;
    display: flex;
}

/* Стили для списка - ИЗМЕНЕНИЯ ЗДЕСЬ */
.interactives_custom-dropdown-options {
    box-shadow: 0px 1px 13.8px 0px #00000040;
    border-radius: 8px;;
    width: 256px !important;
    height: 143px;;
    margin-top: 10px;;
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
    margin-top: 25px;;
    margin-left: 30px;;
    z-index: 10000;
    /* Увеличиваем z-index */
}

.interactives_custom-dropdown-options_header {
    font-family: "Lato", sans-serif;
    font-weight: 600;
    font-size: 16px;;
    line-height: 120%;
    letter-spacing: 0.1px;
    vertical-align: middle;
    margin-top: 7px;;
    margin-left: 41px;;
}

.interactives_custom-dropdown-selected {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size:20px;;
    letter-spacing: 0.2px;;
    vertical-align: middle;
}

.interactives_custom-dropdown-option {
    display: flex;
    align-items: center;
    margin-top: 5px;
    height: 26px;;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
   font-size:20px;;
    letter-spacing: 0.2px;;
    vertical-align: middle;
}

.interactives_custom-dropdown-circle {
    width:18px;
    height: 18px;
    display: flex;
    cursor: pointer;
    justify-content: center;
}

.interactives_custom-dropdown-circle>img {
    width: 16px;
    height:16px;
}

.interactives_custom-dropdown-text {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
   font-size:20px;;
    letter-spacing: 0.2px;;
    vertical-align: middle;
    margin-left:12px;;
    display: flex;
    align-items: center;
}

.interactives_input-group_score {
    display: flex;
    align-items: center;
    margin-left: 58px;;
}

textarea:focus,
input:focus {
    border-color: none !important;
    box-shadow: none !important;
    outline: none !important;
}

.interactives_input-group_score>input {
    margin-left: 10px;;
    width: 73px;;
    height: 42px;;
    border: 1.5px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 12px 12px;;
    font-size: 16px;;
}

.interactives_input-group_score>div {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size:16px;;
    width: 55px;;
    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;
}

.interactives_empty_list_info {
    margin-top: 34px;;
    margin-left:290px;;
    width: 475px;;
    display: grid;
    justify-items: center;
}

.interactives_empty_list_info>img {
    width: 54px;
    height: 54px;
}

.interactives_empty_list_info_h1 {
    margin-top: 10px;
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-style: Bold;
 font-size:20px;;
    letter-spacing: 0.2px;;
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;
}

.interactives_empty_list_info_h2 {
    margin-top: 5px;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Bold;
 font-size:14px;;
    letter-spacing: 0.14px;;
    vertical-align: middle;
    text-align: center;
    vertical-align: middle;
    color: #7D7D7D;
}

.interactives_list {
    width: 1056px;
    margin-top:20px;;
    padding-bottom: 100px;;
}

.interactives_list_header {
    display: flex;
    margin-left: 22px;;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    letter-spacing: 0.16px;;
    text-align: center;
    vertical-align: middle;
    color: #A9A9A9;
    margin-bottom: 15px;;
}

.interactives_list_header_title {
    width: 89px;
    text-align: left;
}

.interactives_list_header_date {
    margin-left: 306px;
    width: 96px;;
    text-align: center;
}

.interactives_list_header_status {
    margin-left: 64px;;
    width: 102px;;
    text-align: center;
}

.interactives_list_header_count {
    margin-left: 20px;;
    width: 192px;;
    text-align: center;
}

.interactives_list_list {
    display: flex;
    flex-direction: column;
}

.interactives_list_list_item {
    display: flex;
    align-items: center;
    height: 46.13px;;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
   font-size: 16px;
    letter-spacing: 0.16px;;
    text-align: center;
    vertical-align: middle;
}

.interactives_list_list_item>img {
    height: 18px;
    width: 14px;
    margin-left: auto;
    margin-right: 22px;
}

.interactives_Line {
    background-color: #e9e9e9 !important;
    height: 1px !important;
}

.interactives_list_list_item_title {
    margin-left: 22px;;
    width: 375px;
    text-align: left;
}

.interactives_list_list_item_date {
    margin-left: 0px;
    width: 137px;;
    text-align: center;
}

.interactives_list_list_item_status {
    margin-left: 30px;;
    width: 128px;;
    text-align: center;
}

.interactives_list_list_item_count {
    margin-left:69px;;
    width: 68px;;
    text-align: center;
}

.interactives_show_more {
    width: 141px;;
    margin-left: 457px;;
    margin-top: 15px;;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
 font-size: 16px;
    letter-spacing: 0.16px;;
    text-align: center;
    vertical-align: middle;
    color: #853CFF;
    cursor: pointer;
}

.interactives_buttons {
    display: flex;
    align-items: center;
    width: 152px !important;
    margin-left: 77px;
}

#leader_board {
    height: 24px !important;
    width: 24px !important;
}


#leader_board, #dublicate{
     height:24px !important;
    width: 24px !important;
}
#edit{
    height:16px !important;
    width: 17px !important;
}
.interactives_leader_board {
    background-color: #6AB23D;
    margin-right:10px;;
}

.interactives_dublicate {
    background-color: #853CFF;
}


.interactives_edit {
    background-color: #F0436C;
    margin-left: 10px;
}


.interactives_start {
    background-color: #6AB23D;
    margin-left: 10px;
}

.interactive_delete {
    width: 14px !important;
    height: 18px !important;
    cursor: pointer;
    margin-left: 10px;
}
.interactive_delete > img{
    width: 14px !important;
    height: 18px !important;
}


.interactives_dublicate,
.interactives_edit,
.interactives_start,
.interactives_leader_board {
    width: 36px !important;
    height: 36px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;;
    cursor: pointer;
}

/* Стили для троеточия и dropdown */
.interactives_dots {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
   
    background-color: #7D7D7D;
}

.interactives_dots img {
    width: 30px;
    height: 30px;

    background-color: #6AB23D;
}

.interactives_item-dropdown-options {
    position: absolute;
    top: calc(100% + 7px);
    box-shadow: 0px 1px 13.8px 0px #00000025;
    width: 283px !important;
    height: 106px !important;
    border-radius: 8px;
    right: -6px;
    background: white;
    z-index: 665455;

}

.interactives_item-dropdown-option {
    margin: 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: "Lato", sans-serif;
    color: #1D1D1D;

    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size:20px;
    letter-spacing:0.2px;
    vertical-align: middle;
    width: 271px;
}
#first_option{height: 24px;;
    margin-top:22px !important;
}
#first_option_img{
    width: 24px !important;height: 24px !important;;
    margin-left: 24px !important;;
}
#first_option> span{
    margin-left: 9px !important;
}
#second_option{height: 24px;;
    margin-top:14px !important;
}
#second_option_img{ margin-left: 24px !important;;
    width: 24px !important;height: 24px !important;;
}
#second_option> span{
    margin-left: 9px !important;
}
.interactives_item-dropdown-option:hover {
    background-color: #DFDFDF;
    border-radius: 7px;
}



.interactives_more_options {
   
    display: flex;
    align-items: center;
    justify-content: center;
  
    cursor: pointer;
    z-index: 0 !important;
}

#more_options { 
    z-index: 0 !important;
  width:3.75px;;
    height: 18.75px;;
    margin-left: 61.12px;;
}



.interactives_popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);

    z-index: 11999;

    display: flex;
    justify-content: center;
    align-items: center;
}

.interactives_popup {
    background: white;
    border-radius: 35px;
    width: 818px;
    height: 438px;

    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

    position: relative;
}

.interactives_popup-close {
    position: absolute;
    top: 25px;
    right: 25px;
    cursor: pointer;
    font-size: 30px;
    color: #aaa;
}

.interactives_popup-header-text {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 36px;
    letter-spacing: 1px;
    padding-top: 48px;
    width: 718px;
    margin: 0 auto;
    height: 20px;
}

.interactives_popup-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 24px;
}

.interactives_popup-button {
    width: 320px;
    height: 62px;
    border-radius: 5px;
    font-family: "Lato", sans-serif;
    font-size: 24px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: 0.3s ease;
}

.interactives_popup-button:nth-child(2) {
    background-color: #f0436c;
    color: white;
}

.interactives_popup-button:nth-child(2):hover {
    background-color: #de7d94;
}

.interactives_popup-button:nth-child(3) {
    background-color: #853cff;
    color: white;
}

.interactives_popup-button:nth-child(3):hover {
    background-color: #aa77ff;
}

.interactives_popup-button:nth-child(1) {
    background-color: #6ab23d;
    color: white;
}

.interactives_popup-button:nth-child(1):hover {
    background-color: #9ac57e;
}




.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup {
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


.interactives_delete_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);

  z-index: 22222999;

  display: flex;
  justify-content: center;
  align-items: center;
}

.interactives_delete_popup {
  background: white;
  border-radius: 35px;
  width: 818px;
height: 372px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  position: relative;
}
.interactives_delete_popup-close {
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
  font-size: 30px;
  color: #aaa;
}
.interactives_delete_popup-header-text {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 36px;
text-align: center;
  line-height: 37px;
  width: 638px;
  margin: 0 auto;
  padding-top:48px;;
  min-height: 64px;letter-spacing: 0px;
}
.interactives_delete_popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 44px;;
  gap: 24px;
}
.interactives_delete_popup-button {
  width: 638px;
  height: 62px;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  font-size: 32px;
  font-weight: 400;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
 
}
.interactives_delete_popup-button:nth-child(1) {
  background-color: #6ab23d;
  color: white;
}
.interactives_delete_popup-button:nth-child(1):hover {
  background-color: #559130;
}
.interactives_delete_popup-button:nth-child(2) {
  background-color: white;
  color: #6AB23D;
  border: 2px solid #6AB23D;
  border-color: #6AB23D;
}
.interactives_delete_popup-button:nth-child(2):hover {
  background-color:  #9AC57E;
  color: white;
}
}
</style>