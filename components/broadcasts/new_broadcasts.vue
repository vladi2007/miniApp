<script setup lang="ts">
import { useInteractivities } from '~/composables/api/interactivities/useInteractivitesQuery'
import type { InteractivitiesListFilter } from '~/composables/api/interactivities/interactivities.types'
import { postBroadcast } from '~/composables/api/broadcasts/broadcasts'
import type { AxiosError } from 'axios'

const selectedInteractives = ref<number[]>([])
const searchParams = useUrlSearchParams('history')
const from_number = ref<string>(searchParams.from_number as string || '0')
const to_number = ref<string>(searchParams.to_number as string || '9')
watch(from_number, (newFrom) => {
  searchParams.from_number = newFrom
})
searchParams.from_number = from_number.value

watch(to_number, (newTo) => {
  searchParams.to_number = newTo
})
searchParams.to_number = to_number.value
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const uploadedFileName = ref<string>('')

const sendStatus = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

async function validateBeforeSend() {
  if (count.value === 0) {
    window.alert(`У выбранных интерактивов должен быть хотя бы один участник!`)
    return
  }
  if ((text.value.trim().length < 1 && uploadedFile.value === null)) {
    window.alert(`Прикрепите файл или наберите текст сообщения!`)
    return
  }
  showPopup.value = true
}
async function submitBroadcasts() {
  if (selectedInteractives.value.length === 0) {
    window.alert(`Выберите хотя бы один интерактив!`)
    closePopup()
    return
  }

  sendStatus.value = 'sending'
  try {
    const formData = new FormData()
    if (text.value === null) {
      formData.append('text', '')
    }
    else {
      formData.append('text', text.value)
    }

    formData.append('interactive_id', JSON.stringify(selectedInteractives.value))

    if (uploadedFile.value) {
      formData.append('file', uploadedFile.value)
    }

    const response = await postBroadcast(formData)

    if (response.status) { sendStatus.value = 'success' }

    if (showPopup.value === false) { window.alert(`Ваше сообщение успешно отправлено`); sendStatus.value = 'idle' }
  }
  catch (e) {
    console.log('error')
    sendStatus.value = 'error'
    if ((e as AxiosError).response?.data!.detail! == 'No recipients found') {
      window.alert('Никто из участников выбранных Вами интерактивов не оставил контакты для обратной связи')
    }
    if (showPopup.value === false) { window.alert(`${e}`); sendStatus.value = 'idle' }
  }
}
const filter = ref<InteractivitiesListFilter>('conducted')
const { data: interactivesData, isLoading, refetch } = useInteractivities(filter, to_number, from_number)
async function more_load() {
  to_number.value = String(Number(to_number.value) + 10)
}

function openFileDialog() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
async function handleFileChange(event: any) {
  const file = event.target.files[0]
  if (file) {
    const MAX_SIZE_MB = 50 // лимит 50MB
    const fileSizeMB = file.size / (1024 * 1024) // размер в мегабайтах

    if (fileSizeMB > MAX_SIZE_MB) {
      window.alert(`Файл слишком большой. Максимальный размер: ${MAX_SIZE_MB}MB.`)
      event.target.value = ''
      return
    }
    uploadedFile.value = file
    uploadedFileName.value = file.name

    event.target.value = ''
  }
}

async function removeImage() {
  uploadedFile.value = null
  uploadedFileName.value = ''
}

const finder = ref<string>('')
const is_empty_list = computed(() => {
  if (interactivesData?.value?.interactive_list?.length > 0) {
    return false
  }
  else {
    return true
  }
})
const showPopup = ref<boolean>(false)

function selectManyOption(id: number) {
  const exists = selectedInteractives.value.includes(id)

  if (exists) {
    selectedInteractives.value =
      selectedInteractives.value.filter(item => item !== id)

    return
  }

  if (selectedInteractives.value.length >= 5) {
    return
  }

  selectedInteractives.value.push(id)
}
const text = ref<string>('')

const count = computed(() => {
  return selectedInteractives.value
    .map(id => Number(interactivesData?.value?.interactive_list?.find(item => item.id === id)?.participant_count || 0))
    .reduce((sum, n) => sum + n, 0)
})

function closePopup() {
  sendStatus.value = 'idle'
  showPopup.value = false
}
const route = useRoute()
onMounted(() => {
  const selectedId = route.query.selected
  if (selectedId) {
    selectedInteractives.value = [Number(selectedId)] // сразу выбираем интерактив
  }
})

const dotCount = ref(1)
let dotInterval: any = null
watch(sendStatus, (value) => {
  if (value === 'sending') {
    dotCount.value = 1
    dotInterval = setInterval(() => {
      dotCount.value = dotCount.value % 3 + 1 // 1 → 2 → 3 → 1
    }, 500)
  }
  else {
    clearInterval(dotInterval)
  }
})
const expandedTitles = reactive<{ [key: string]: boolean }>({})
const expandedLeaders = reactive<{ [key: string]: boolean }>({})

// Функции для переключения раскрытия
function toggleTitle(id: string) {
  expandedTitles[id] = !expandedTitles[id]
}

function toggleLeader(id: string) {
  expandedLeaders[id] = !expandedLeaders[id]
}

const startY = ref(0)
const currentY = ref(0)
const isMobile = useMediaQuery('(max-width: 767px)')
const isIpad = useMediaQuery('(max-width: 1056px)')
const $style = useCssModule()
const isDragging = ref(false)
function resetTouch() {
  isDragging.value = false
  startY.value = 0
  currentY.value = 0
}
function closeAllPopups() {
  sendStatus.value = 'idle'
  showPopup.value = false

  resetTouch()
}
function onTouchStart(e: TouchEvent) {
  if (!isMobile.value) return

  isDragging.value = true
  startY.value = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  if (!isMobile.value || !isDragging.value) return

  currentY.value = e.touches[0].clientY
  const diff = currentY.value - startY.value

  if (diff > 0) {
    e.preventDefault()

    const sheet = document.querySelector(`.${$style.broadcasts__popup_overlay}`) as HTMLElement
    if (sheet) {
      sheet.style.transform = `translateY(${diff}px)`
      sheet.style.transition = 'none'
    }
  }
}

function onTouchEnd(e: TouchEvent, start: string) {
  if (!isMobile.value || !isDragging.value) return
  isDragging.value = false

  const diff = currentY.value - startY.value
  const sheet = document.querySelector(`.${$style.broadcasts__popup_overlay}`) as HTMLElement
  if (sheet) {
    sheet.style.transform = ''
  }

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    closeAllPopups()

    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch(
  [showPopup],
  ([popup]) => {
    if (!popup) {
      resetTouch()
    }
  }
)
</script>

<template>
  <Layout :active_nav="'broadcasts'">
    <div :class="$style.broadcasts">
      <div :class="$style.broadcasts__text">
        <label>Введите текст рассылки<textarea id="description_input" v-model="text" placeholder="Текст"
            maxlength="200" /></label>
      </div>
      <div
        :class="[uploadedFileName ? $style.broadcasts__file_uploaded : $style.broadcasts__file, $style.broadcasts__file]"
        @click="!uploadedFileName && openFileDialog()">
        <input ref="fileInput" type="file" hidden @change="handleFileChange">

        <template v-if="uploadedFileName">
          <span :class="$style.broadcasts__file_name"> {{ uploadedFileName }} </span>
          <img :class="$style.broadcasts__file_delete" src="/public/images/interactive_editor/delete.svg"
            @click.stop="removeImage">
        </template>

        <template v-else>
          <span style="color: #1D1D1D;">Прикрепить файл</span>
          <span style="margin-left: auto; color:#A9A9A9;">Не выбрано</span>
        </template>
      </div>
      <div v-if="!is_empty_list" :class="$style.broadcasts__selected">
        <div :class="$style.broadcasts__selected_header">
          <div>
            Выбрать участников интерактива
          </div>
          <div v-if="selectedInteractives.length > 0" id="count_address" style="color: #6AB23D;">
            {{
              count }}
            чел.
          </div>
        </div>
        <div v-if="selectedInteractives.length > 0" :class="$style.broadcasts__selected_list" id="selected_list">
          <div :class="$style.broadcasts__selected_item" v-for="id in selectedInteractives"
            v-if="selectedInteractives.length > 0" :key="id">
            <div :class="$style.broadcasts__selected_title">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.title}}
            </div>
            <div :class="$style.broadcasts__selected_date">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.date_completed}}
            </div>
            <div :class="$style.broadcasts__selected_count">
              Количество участников: {{interactivesData?.interactive_list?.find(item => item.id
                === id)?.participant_count
              }}
            </div>
            <img src="/public/images/history/history_delete.svg"
              @click="selectedInteractives = selectedInteractives.filter(item => item !== id)">
          </div>
        </div>
        <div :class="$style.broadcasts__selected_download" v-if="selectedInteractives.length > 0"
          @click="validateBeforeSend()">
          Отправить рассылку
        </div>
        <div :class="$style.broadcasts__selected_info" v-if="selectedInteractives.length === 0">
          <img src="/public/images//history/finder_info.svg">

          <div class="broadcasts_selected_interactives_info_h2">
            Вы не выбрали интерактив
          </div>
        </div>
      </div>
      <div :class="$style.broadcasts__finder">
        <div :class="$style.broadcasts__finder_header">
          Список проведенных интерактивов
        </div>
        <div :class="$style.broadcasts__finder_finder">
          <img src="/public/images/history/finder.svg">

          <input v-model="finder" type="text" placeholder="Поиск интерактива">
        </div>
      </div>
      <div :class="$style.broadcasts__interactives_info" v-if="interactivesData && is_empty_list">
        <img :class="$style.broadcasts__interactives_info_img" src="/public/images//history/finder_info.svg">
        <div :class="$style.broadcasts__interactives_info_text">
          У Вас нет интерактивов
        </div>
        <div :class="$style.broadcasts__interactives_info_text_">
          Проведите свой первый интерактив и он отобразится здесь
        </div>
      </div>
      <div :class="$style.broadcasts__interactives" v-if="interactivesData && !is_empty_list">
        <div :class="$style.broadcasts__interactives_header">
          <div :class="$style.broadcasts__interactives_title">
            Название
          </div>
          <div :class="$style.broadcasts__interactives_leader">
            Ведущий
          </div>
          <div :class="$style.broadcasts__interactives_date">
            Дата
          </div>
          <div :class="$style.broadcasts__interactives_count">
            Количество участников
          </div>
        </div>
        <div :class="$style.broadcasts__interactives_list">
          <div :class="$style.broadcasts__interactives_item" v-for="(item, index) in interactivesData.interactive_list"
            :key="item.id">
            <div class="broadcasts_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }"
              @click="toggleTitle(item.id)">
              {{ item.title }}
            </div>
            <div class="broadcasts_list_list_item_leadername title-clamp"
              :class="{ expanded: expandedLeaders[item.id] }" @click="toggleLeader(item.id)">
              {{ item.username }}
            </div>
            <div :class="$style.broadcasts__interactives_item_date">
              {{ item.date_completed }}
            </div>
            <div :class="$style.broadcasts__interactives_item_count">
              {{ item.participant_count }}
            </div>
            <div v-if="!selectedInteractives.includes(item.id)" :class="$style.broadcasts__interactives_item_download"
              @click="selectManyOption(item.id)">
              Выбрать
            </div>
            <div :class="$style.broadcasts__interactives_item_select_mobile" @click="selectManyOption(item.id)">
              <img v-if="!selectedInteractives.includes(item.id)" src="/public/images/history/select.svg">
              <img v-if="selectedInteractives.includes(item.id)" src="/public/images/history/selected.svg">
            </div>
          </div>
        </div>

        <div :class="$style.broadcasts__interactives_more" v-if="!interactivesData.is_end" @click="more_load()">
          Показать еще
        </div>
      </div>

      <div v-if="showPopup" :class="$style.broadcasts__popup">
        <div :class="[$style.broadcasts__popup_overlay, $style.broadcasts__popup_overlay_broad]" @click.stop
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.broadcasts__popup_line"></div>
          <div :class="$style.broadcasts__popup_text">
            Подтвердите отправку рассылки
          </div>
          <img src="/images/history/Vector_1.svg" @click="closePopup()">
          <div :class="$style.broadcasts__popup_text_">
            От лица “Название телеграмм бота” будет отправлена в личный чат с участником следующая информация
          </div>
          <div :class="$style.broadcasts__popup_body">

            <div :class="$style.broadcasts__popup_message">
              Сообщение: {{ text }}
            </div>
            <div :class="$style.broadcasts__popup_files">
              Файлы: {{ uploadedFileName }}
            </div>
            <div :class="$style.broadcasts__popup_count">
              Количество получателей: {{ count }}
            </div>

          </div>
          <div :class="[$style.broadcasts__popup_buttons, $style.broadcasts__popup_buttons_delete]"
            v-if="sendStatus === 'idle'">
            <div
              :class="[$style.broadcasts__popup_btn, $style.broadcasts__popup_btn_first, $style.broadcasts__popup_btn_first_start]"
              @click=" closePopup()">
              Отменить
            </div>
            <div
              :class="[$style.broadcasts__popup_btn, $style.broadcasts__popup_btn_second, $style.broadcasts__popup_btn_second_start]"
              @click=" submitBroadcasts()">
              Отправить
            </div>
          </div>
          <div :class="$style.broadcasts__popup_send" v-if="sendStatus === 'sending'">
            <div>
              Идет рассылка получателям {{ ".".repeat(dotCount) }}
            </div>
          </div>

          <div :class="$style.broadcasts__popup_success" v-if="sendStatus === 'success'">
            <img src="/public/images/broadcasts/Group.svg"></img>
            <div>
              Рассылка успешно отправлена участникам!
            </div>
          </div>

          <div :class="$style.broadcasts__popup_fail" v-if="sendStatus === 'error'">
            <img src="/public/images/broadcasts/Vector (2).svg"></img>
            <div>
              Произошла ошибка. Повторите отправку.
            </div>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>
<style>
.broadcasts_list_list_item_title,
.broadcasts_list_list_item_leadername {
  position: relative;
  /* для ::after */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  white-space: nowrap;
}





.title-clamp::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 31px;
  height: 36px;
  pointer-events: none;
  background: linear-gradient(85.63deg, rgba(255, 255, 255, 0.4) 26.36%, #FFFFFF 89.3%);


}

.broadcasts_list_list_item_leadername.expanded,
.broadcasts_list_list_item_title.expanded {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.title-clamp.expanded::after {
  display: none;
  /* только у текущего элемента с expanded */
}

.broadcasts_list_list_item_title {
  grid-area: title;
  width: 100%;
  background-color: #F7F7F7;
  border-radius: 5px;
  padding: 0 5px;
  height: 36px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.broadcasts_list_list_item_leadername {
  display: none;
}

@media (min-width:1056px) {
  .broadcasts_list_list_item_title {
    width: 253px;
    text-align: left;
    background-color: white;
  }

  .broadcasts_list_list_item_leadername {
    margin-left: 12px;
    padding: 0;
    width: 137px;
    text-align: center;
    display: flex;
    justify-content: center;
  }

}
</style>
<style module lang="scss">
* {
  font-family: 'Lato', sans-serif;
  line-height: 100%;
  letter-spacing: 1%;
  vertical-align: middle;

}

.broadcasts {
  padding: 0 22px;
  margin-top: 10px;
  width: 100%;

  @media (min-width:768px) {
    padding: 0;
    width: calc(100% - 44px);
    max-width: 1056px;
    margin: 0 auto;
    margin-top: 10px;
  }

  @media (min-width:1056px) {
    padding: 0;
    margin-top: 25px;
  }

  &__text {
    @media (min-width:1056px) {
      width: 483px;
    }

    label {
      display: flex;
      flex-direction: column;
      color: #1D1D1D;
      font-size: 14px;
      gap: 5px;

      @media (min-width:1056px) {
        color: #1D1D1D;
        font-size: 16px;
        font-weight: 500;
        gap: 10px;
      }
    }

    textarea {
      width: 100%;
      min-height: 54px;
      box-sizing: border-box;
      padding: 10px 10px;
      font-size: 14px;
      color: #1d1d1d;
      resize: none;
      border: none;
      outline: none;
      border-radius: 8px;
      border: 1px solid #E0E0E0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      vertical-align: middle;

      @media (min-width:1056px) {
        color: #1D1D1D;
        font-size: 16px;
        font-weight: 500;
        padding: 12px 12px;
      }

    }

    textarea::placeholder {
      font-size: 14px;
      width: 100%;
      height: 54px;

      vertical-align: middle;

      @media (min-width:1056px) {
        color: #A9A9A9;
        font-size: 16px;
        font-weight: 400;
      }
    }
  }

  &__file {
    margin-top: 10px;
    ;
    width: 100%;
    height: 36px;
    font-size: 14px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    background-color: white;
    color: #1D1D1D;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px 5px 10px 5px;
    margin-bottom: 20px;

    @media (min-width:1056px) {
      margin-top: 15px;
      width: 483px;
      height: 42px;
      padding: 12px 12px;
      color: #1D1D1D;
      font-size: 16px;
      font-weight: 500;
    }

    &_name {
      width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #6AB23D;
    }

    &_delete {
      width: 14px;
      height: 18px;
      margin-left: auto;
      cursor: pointer;
      margin-right: 5px;
    }

    &_uploaded {
      border-color: #6AB23D !important;
      color: #6AB23D;
    }
  }

  &__selected {
    margin-top: 20px;
    min-height: 133px;

    @media (min-width:1056px) {
      margin-top: 20px;
      min-height: 158px;
    }

    &_header {
      color: #1D1D1D;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 5px;

      @media (min-width:1056px) {
        font-size: 16px;
      }
    }

    &_info {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;


      &>img {
        width: 40px;
        height: 40px;

        @media (min-width:1056px) {
          width: 54px;
          height: 54px;
        }
      }

      &>div {
        font-size: 14px;
        color: #7D7D7D;
        margin-bottom: 29px;

        @media (min-width:1056px) {
          margin-bottom: 24px;
          font-size: 16px;
        }
      }
    }

    &_list {
      margin-top: 5px;
      border: 1px solid #853CFF;
      border-radius: 8px;

      @media (min-width:1056px) {
        margin-top: 15px;
      }
    }

    &_item {
      display: grid;
      align-items: center;
      grid-template-areas:
        "date delete"
        "title title";
      box-sizing: border-box;
      grid-template-columns: 1fr auto;
      padding: 5px 6px 9px 5px;
      gap: 5px;
      height: 57px !important;
      position: relative;

      @media (min-width:1056px) {
        padding: 10px 22px 10px 22px;
        display: flex;
        flex-direction: row;
        height: 36px !important;
        gap: 0px;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 10px; // отступ слева
        right: 10px; // отступ справа
        height: 1px;
        background-color: #1D1D1D1D;

        @media (min-width:1056px) {
          content: '';
          position: absolute;
          bottom: 0;
          left: 13px; // отступ слева
          right: 13px; // отступ справа
          height: 1px;
          background-color: #1D1D1D1D;
        }
      }

      &:last-child::after {
        display: none;
      }

      &>img {
        width: 14px;
        height: 18px;
        margin-right: 0px;

        @media (min-width:1056px) {
          margin-left: auto;
        }
      }
    }

    &_title {
      grid-area: title;
      width: 100%;
      height: 17px;
      display: flex;
      align-items: center;
      font-size: 14px;

      @media (min-width:1056px) {
        font-size: 16px;
        width: 370px;
      }
    }

    &_leader {}

    &_date {
      box-sizing: border-box;
      grid-area: date;
      color: #A9A9A9;
      font-size: 14px;
      font-weight: 400;
      grid-area: date;
      height: 17px;
      display: flex;
      align-items: center;
      margin-top: 4px;

      @media (min-width:1056px) {
        margin: 0;
        width: 154px;
        text-align: center;
        margin-left: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1D1D1D;
        font-size: 16px;
      }
    }

    &_count {
      display: none;

      @media (min-width:1056px) {
        display: block;
        margin: 0;
        width: 226px;
        text-align: center;
        margin-left: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #1D1D1D;
        font-size: 16px;
      }
    }

    &_download {
      margin-top: 5px;

      color: #FFFFFF;
      font-size: 14px;
      width: 169px;
      height: 29px;
      background-color: #6AB23D;
      border-radius: 8px;
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      @media (min-width:1056px) {
        padding: 0;
        margin-top: 15px;
        margin-right: 0px;
        font-size: 20px;
        width: 214px;
        height: 36px;
        background-color: #6AB23D;
        color: white;
        margin-bottom: 20px;
      }
    }

  }

  &__finder {


    &_header {
      font-weight: 400;
      color: #1D1D1D;
      font-size: 14px;
      margin-left: 5px;

      @media (min-width:1056px) {
        font-weight: 500;
        color: #1D1D1D;
        font-size: 16px;
        margin-left: 0px;
      }
    }

    &_finder {
      position: relative;
      display: flex;
      align-items: center;
      height: 29px;
      width: 100%;
      margin-top: 5px;

      @media (min-width:1056px) {
        height: 39px;
        width: 765px;
        margin-top: 15px;
        font-weight: 500;
        color: #1D1D1D;
        font-size: 16px;
        margin-left: 0px;
      }

      &>img {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        pointer-events: none;

        @media (min-width:1056px) {
          width: 19px;
          height: 19px;
          left: 17px;
        }
      }

      &>input {
        width: 100%;
        height: 29px;
        line-height: 29px;
        color: #1D1D1D !important;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        font-weight: 400;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        box-sizing: border-box;

        @media (min-width:1056px) {
          width: 100%;
          height: 39px;
          line-height: 39px;
          padding-left: 50px;
          font-weight: 500;
          font-size: 16px;
        }

        &::placeholder {
          line-height: 29px;
          display: flex;
          align-items: center;
          font-weight: 400;
          font-size: 14px;
          color: #A9A9A9;

          @media (min-width:1056px) {
            line-height: 39px;
            font-weight: 500;
            font-size: 16px;
          }

        }
      }
    }
  }

  &__interactives {
    padding-bottom: 92px;

    &_info {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #7D7D7D;

      @media (min-width:1056px) {
        margin-top: 34px;
      }

      &_img {
        width: 40px;
        height: 40px;

        @media (min-width:1056px) {
          width: 54px;
          height: 54px;
        }
      }

      &_text {
        margin-top: 10px;
        font-size: 14px;

        @media (min-width:1056px) {
          font-size: 20px;
          font-weight: 700;
        }

        &_ {
          font-size: 12px;
          margin-top: 5px;

          @media (min-width:1056px) {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

    }

    &_header {
      display: none;

      @media (min-width:1056px) {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #1D1D1D1D;
        padding: 0 22px;
        ;
        margin-top: 5px;
        color: #A9A9A9;
        font-size: 16px;
        font-weight: 400;
        height: 46px;
      }
    }

    &_title {
      width: 89px;
    }

    &_leader {
      width: 96px;
      text-align: center;
      margin-left: 197px;
    }

    &_date {
      width: 96px;
      text-align: center;
      margin-left: 73px;
      font-size: 16px;
      font-weight: 400;
    }

    &_count {
      width: 192px;
      text-align: center;
      margin-left: 46px;
      font-size: 16px;
      font-weight: 400;
    }

    &_list {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 16.5px;

      @media (min-width:1056px) {
        margin: 0;
        gap: 0px;
      }
    }

    &_item {
      display: grid;
      align-items: center;
      grid-template-areas:
        "date select"
        "title title"
        "download download";
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 5px;


      * {
        @media (min-width:1056px) {
          color: #1D1D1D;
          font-size: 16px;
          font-weight: 400;
        }
      }

      @media (min-width:1056px) {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0px;
        height: 46px;
        border-bottom: 1px solid #1D1D1D1D;
        padding-left: 22px;
      }

      &_title {
        grid-area: title;
        width: 100%;
        background-color: #F7F7F7;
        border-radius: 5px;
        padding: 0 5px;
        height: 36px;
        display: flex;
        align-items: center;
        font-size: 14px;

        @media (min-width:1056px) {
          width: 253px;
        }
      }

      &_leader {
        display: none;

        @media (min-width:1056px) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 137px;
          margin-left: 12px;
        }
      }

      &_date {
        box-sizing: border-box;
        grid-area: date;
        color: #A9A9A9;
        font-size: 14px;
        font-weight: 400;
        grid-area: date;
        height: 17px; // Высота первой строки
        display: flex;
        align-items: center;
        padding: 0 5px;

        @media (min-width:1056px) {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 154px;
          margin-left: 24px;
          color: #1D1D1D;
          font-size: 16px;
          font-weight: 400;
        }
      }

      &_count {
        display: none;

        @media (min-width:1056px) {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 68px;
          margin-left: 82px;
          color: #1D1D1D;
          font-size: 16px;
          font-weight: 400;
        }
      }

      &_download {

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-left: auto;
        grid-area: download;
        width: 168px;
        height: 29px;
        background-color: #E0F9C7;
        border-radius: 8px;
        color: #6AB23D;
        display: none;

        @media (min-width:1056px) {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          height: 24px;
          width: 81px;
          margin-left: auto;
          margin-right: 22px;
          color: #853CFF;
          font-size: 20px;
          font-weight: 500;

        }
      }

      &_select {
        display: none;

        @media (min-width:1056px) {
          display: flex;
          font-size: 20px;
          font-weight: 500;
          color: #853CFF;
          margin-left: auto;
        }

        &_mobile {
          grid-area: select;
          height: 16px;
          width: 16px;
          display: flex;
          align-items: center;
          justify-content: center;

          @media (min-width:1056px) {
            display: none;

          }

          &>img {
            height: 16px;
            width: 16px;
          }
        }
      }
    }

    &_more {
      margin-top: 15px;
      color: #853CFF;
      text-align: center;
    }
  }

  &__popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #00000052;

    z-index: 22222999;

    display: flex;
    justify-content: center;

    &_more {
      height: 317px !important;
    }

    &_overlay {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      background: white;
      height: 458px;
      margin: 0px;
      width: 100%;
      margin-top: auto;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      touch-action: pan-y; // Разрешаем только вертикальный скролл
      transition: transform 1s ease;

      @media (min-width:1056px) {
        height: 233px;
        margin-top: 273px;
        width: 524px;
        border-radius: 18px;
      }

      &_broad {
        @media (min-width:1056px) {
          height: 306px;
          margin-top: 273px;
          width: 524px;
          border-radius: 18px;
        }
      }

      &>img {
        display: none;

        @media (min-width:1056px) {
          position: absolute;
          display: block;
          top: 16px;
          right: 16px;
          width: 20px;
          height: 20px;
        }
      }

      &_dubl {
        @media (min-width:1056px) {
          height: 270px !important;
        }

      }

      &_edit {
        @media (min-width:1056px) {
          height: 173px !important;
        }

      }

    }

    &_line {
      background-color: #A9A9A9;
      border-radius: 5px;
      height: 5px;
      width: 72px;
      margin: 0 auto;
      margin-top: 20px;

      @media (min-width:1056px) {
        display: none;

      }
    }

    &_text {
      color: #1D1D1D;
      font-size: 14px;
      font-weight: 500;
      margin-top: 40px;
      padding: 0 22px;
      text-align: center;

      @media (min-width:1056px) {
        font-size: 20px;
        font-weight: 700;
        margin-top: 24px;
      }

      &_report {
        text-align: center;
      }

      &_ {
        font-size: 14px;
        padding: 0 22px;
        margin-top: 10px;
        color: #7D7D7D;
        line-height: 120%;
        font-weight: 400;
        letter-spacing: 1%;

        @media (min-width:1056px) {
          font-size: 16px;
          margin-top: 19px;
        }
      }
    }

    &_body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: #1D1D1D;
      font-size: 14px;
      padding: 0 22px;
      margin-top: 10px;
    }

    &_message {}

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 32px;

      @media (min-width:1056px) {
        position: absolute;
        right: 0;
        position: absolute;
        bottom: 20px;
        display: flex;
        flex-direction: row;
      }

      &_delete {
        @media (min-width:1056px) {
          margin-top: 56px;
        }
      }

      &_report {
        margin-top: 121px;

        @media (min-width:1056px) {
          margin: 0;
          position: absolute;
          bottom: 20px;
          display: flex;
          flex-direction: column-reverse;
          gap: 10px;
          right: 62px;

        }

        &>button {

          @media (min-width:1056px) {
            width: 360px;


          }
        }
      }

      &_edit {
        @media (min-width:1056px) {
          margin-top: 25px;
        }
      }

    }

    &_btn {
      height: 44px;
      border-radius: 8px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (min-width:1056px) {
        height: 41px;
        font-size: 20px;
        cursor: pointer;
      }

      &_first {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_delete {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;


          @media (min-width:1056px) {
            background-color: white;
            border: 1px solid white;
            color: #7D7D7D;
          }

          &:hover {
            @media (min-width:1056px) {
              border: 1px solid #1D1D1D;
              color: #1D1D1D;
            }
          }
        }

        &_start {
          background-color: white;
          border: 1px solid #853CFF;
          color: #853CFF;

          &:hover {
            @media (min-width:1056px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

        &_report {
          background-color: white;
          border: 1px solid #7D7D7D;
          color: #7D7D7D;

          &:hover {
            @media (min-width:1056px) {
              background-color: #AA77FF;
              color: white;
            }
          }
        }

      }

      &_second {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_delete {
          background-color: #F0436C;
          color: white;
          border: 1px solid #F0436C;

          @media (min-width:1056px) {
            background-color: white;
            border: 1px solid #F0436C;
            color: #F0436C;
          }

          &:hover {
            @media (min-width:1056px) {
              border: 1px solid #F0436C;
              background-color: #F0436C;
              color: white;
            }
          }
        }

        &_start {
          background-color: #6AB23D;
          color: white;
          border: 1px solid #6AB23D;

          &:hover {
            @media (min-width:1056px) {
              background-color: #559130;
            }
          }
        }
      }

      &_third {
        @media (min-width:1056px) {
          width: 138px;
        }

        &_start {
          background-color: #853CFF;
          color: white;
          border: 1px solid #853CFF;

          &:hover {

            @media (min-width:1056px) {
              background-color: #AA77FF;
            }
          }
        }
      }
    }

    &_block {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 0px;
      font-size: 14px;
      font-weight: 400;
      color: #1D1D1D;

      &_conducted {
        margin-top: 11px;
        padding-top: 11px;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 22px; // Отступ слева
          right: 22px; // Отступ справа
          height: 1px;
          background-color: #1D1D1D1D;
        }
      }
    }

    &_func {
      height: 39px;
      display: flex;
      align-items: center;
      padding: 0px 22px 0px 18px;

      &:hover {
        background-color: #E0E0E0;
      }

      img:first-child {
        width: 24px;
        height: 24px;
      }

      img:last-child {
        margin-left: auto; // Прижимает стрелку к правому краю
      }

      &>div {
        margin-left: 6px;
      }
    }



    &_div {
      height: 1px;
      margin-top: 11px;
      padding: 0 22px;
    }

    &_report {
      margin-top: 19px;
      padding: 0 22px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      font-size: 14px;

    }

    &_option {
      display: flex;
      align-items: center;
      gap: 5px;

      &>img {
        width: 17px;
        height: 17px;
      }
    }

    &_send {
      margin-top: 30px;
      color: #853CFF;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    &_success {
      margin-top: 30px;
      color: #6AB23D;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      flex-direction: column;

      &>img {
        width: 26px;
        height: 20px;
      }
    }

    &_fail {
      margin-top: 30px;
      color: #F0436C;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      flex-direction: column;

      &>img {
        width: 27px;
        height: 25px;
      }
    }
  }
}
</style>