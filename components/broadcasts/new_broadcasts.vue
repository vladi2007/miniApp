<script setup lang="ts">
import { useInteractivities } from '~/composables/api/interactivities/useInteractivitesQuery'
import type { InteractivitiesListFilter } from '~/composables/api/interactivities/interactivities.types'
import { postBroadcast } from '~/composables/api/broadcasts/broadcasts'

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
  if (selectedInteractives.value.length > 4) {
    return
  }
  if (!selectedInteractives.value.includes(id)) {
    selectedInteractives.value.push(id)
  }
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
</script>

<template>
  <Layout :active_nav="'broadcasts'">
    <div class="broadcasts_input">
      <label>Введите текст рассылки<textarea
        id="description_input"
        v-model="text"
        placeholder="Текст"
        maxlength="200"
      /></label>
    </div>
    <div
      class="broadcasts_custom-file-upload"
      :class="{ 'broadcasts_file-uploaded': uploadedFileName }"
      @click="!uploadedFileName && openFileDialog()"
    >
      <input
        ref="fileInput"
        type="file"
        hidden
        @change="handleFileChange"
      >

      <template v-if="uploadedFileName">
        <span class="uploadedFileName"> {{ uploadedFileName }} </span>
        <img
          src="/public/images/interactive_editor/delete.svg"
          class="broadcasts_remove-icon"
          @click.stop="removeImage"
        >
      </template>

      <template v-else>
        <span style="color: #1D1D1D;">Прикрепить файл</span>
        <span style="margin-left: auto; color:#A9A9A9;">Не выбрано</span>
      </template>
    </div>
    <div
      v-if="!is_empty_list"
      class="broadcasts_selected_interactives"
    >
      <div
        class="broadcasts_selected_interactives_header"
        style="display: flex; align-items: center; justify-content: space-between; "
      >
        <div>
          Выбрать участников интерактива
        </div>
        <div
          v-if="selectedInteractives.length > 0"
          id="count_address"
        >
          Количество получателей: <span style="color: #6AB23D;">{{
            count }}
            чел.</span>
        </div>
      </div>
      <div
        id="selected_list"
        :class="{ broadcasts_selected_list: selectedInteractives.length > 0 }"
      >
        <div
          v-for="id in selectedInteractives"
          v-if="selectedInteractives.length > 0"
          :key="id"
          class="broadcasts_list_list"
          style="height: calc((36/832)*100dvh);"
        >
          <div
            class="broadcasts_list_list_item_selected"
            :class="['broadcasts_selected_item']"
          >
            <div class="broadcasts_list_list_item_title">
              {{ interactivesData?.interactive_list?.find(item => item.id === id)?.title }}
            </div>
            <div class="broadcasts_list_list_item_date">
              {{ interactivesData?.interactive_list?.find(item => item.id === id)?.date_completed }}
            </div>
            <div
              class="broadcasts_list_list_item_count"
              style="width:calc((226 / 1280) * 100dvw) !important; "
            >
              Количество участников: {{ interactivesData?.interactive_list?.find(item => item.id
                === id)?.participant_count
              }}
            </div>
            <img
              src="/public/images/history/history_delete.svg"
              style="cursor: pointer;"
              @click="selectedInteractives = selectedInteractives.filter(item => item !== id)"
            >
          </div>
          <div
            class="broadcasts_Line"
            style="width: calc((1030/1280)*100dvw); margin: 0 auto;"
          />
        </div>
      </div>
      <div
        v-if="selectedInteractives.length > 0"
        class="broadcasts_list_selected_download"
        @click="validateBeforeSend()"
      >
        Отправить рассылку
      </div>
      <div
        v-if="selectedInteractives.length === 0"
        class="broadcasts_selected_interactives_info"
      >
        <img src="/public/images//history/finder_info.svg">

        <div class="broadcasts_selected_interactives_info_h2">
          Вы не выбрали интерактив
        </div>
      </div>
    </div>
    <div
      class="broadcasts_finder"
      :class="{ margin_24: !is_empty_list }"
    >
      <div class="broadcasts_finder_header">
        Список проведенных интерактивов
      </div>
      <div class="broadcasts_finder_finder">
        <img
          src="/public/images/history/finder.svg"
          class="broadcasts_input-icon"
        >

        <input
          v-model="finder"
          type="text"
          placeholder="Поиск интерактива"
          class="broadcasts_search-input"
        >
      </div>
    </div>
    <div
      v-if="interactivesData && is_empty_list"
      class="broadcasts_empty_list_info"
    >
      <img src="/public/images//history/finder_info.svg">
      <div class="broadcasts_empty_list_info_h1">
        У Вас нет интерактивов
      </div>
      <div class="broadcasts_empty_list_info_h2">
        Проведите свой первый интерактив и он отобразится здесь
      </div>
    </div>
    <div
      v-if="interactivesData && !is_empty_list"
      class="broadcasts_list"
    >
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
      <div
        v-for="(item, index) in interactivesData.interactive_list"
        :key="item.id"
        class="broadcasts_list_list"
      >
        <div
          v-if="index === 0"
          class="broadcasts_Line"
        />
        <div class="broadcasts_list_list_item">
          <div
            class="broadcasts_list_list_item_title title-clamp"
            :class="{ expanded: expandedTitles[item.id] }"
            @click="toggleTitle(item.id)"
          >
            {{ item.title }}
          </div>
          <div
            class="broadcasts_list_list_item_leadername title-clamp"
            :class="{ expanded: expandedLeaders[item.id] }"
            @click="toggleLeader(item.id)"
          >
            {{ item.username }}
          </div>
          <div class="broadcasts_list_list_item_date">
            {{ item.date_completed }}
          </div>
          <div class="broadcasts_list_list_item_count">
            {{ item.participant_count }}
          </div>
          <div
            class="broadcasts_list_list_item_download_many"
            :style="{ visibility: selectedInteractives.includes(item.id) ? 'hidden' : 'visible' }"
            @click="selectManyOption(item.id)"
          >
            Выбрать
          </div>
        </div>
        <div class="broadcasts_Line" />
      </div>
      <div
        v-if="!interactivesData.is_end"
        class="broadcasts_show_more"
        @click="more_load()"
      >
        Показать еще
      </div>
    </div>

    <div
      v-if="showPopup"
      class="broadcasts_popup-overlay"
    >
      <div class="broadcasts_popup">
        <div class="broadcasts_popup-header">
          <div class="broadcasts_popup-header-text">
            Подтвердите отправку рассылки
          </div>
          <img
            src="/images/history/Vector_1.svg"
            class="broadcasts_popup-close"
            @click="closePopup()"
          >
        </div>
        <div
          class="broadcasts_popup-body"
          :class="{ margins: sendStatus !== 'idle' }"
        >
          <div style="color: #7D7D7D; line-height: calc((16*1.2/832)*100dvh);">
            От лица “Название телеграмм бота” будет отправлена в личный чат с участником следующая информация
          </div>
          <div
            class="margin10"
            style="  white-space: normal;
    overflow-wrap: break-word; margin-top: calc((10 / 832) * 100dvh); line-height:calc((16*1.2/832)*100dvh);"
          >
            Сообщение: {{ text }}
          </div>
          <div
            class="margin10"
            style="margin-top: calc((10 / 832) * 100dvh);line-height: calc((16*1.2/832)*100dvh);"
          >
            Файлы: {{ uploadedFileName }}
          </div>
          <div
            class="margin10"
            style="margin-top: calc((10 / 832) * 100dvh);line-height: calc((16*1.2/832)*100dvh);"
          >
            Количество получателей: {{ count }}
          </div>
          <div
            class="margin10"
            style="margin-top: calc((10 / 832) * 100dvh);color: #7D7D7D;line-height: calc((16*1.2/832)*100dvh);"
          >
            Используйте рассылку по назначению.
            Злоупотребление ею приведет к блокировке бота со стороны Telegram.
          </div>
        </div>
        <div
          v-if="sendStatus === 'idle'"
          class="broadcasts_popup-footer"
        >
          <div
            class="broadcasts_popup_back"
            @click=" closePopup()"
          >
            Отменить
          </div>
          <div
            class="broadcasts_popup_send"
            @click=" submitBroadcasts()"
          >
            <div>Отправить</div>
          </div>
        </div>
        <div
          v-if="sendStatus === 'sending'"
          class="broadcasts_popup-footer_sending"
        >
          <div class="broadcasts_popup_status_text">
            Идет рассылка получателям {{ ".".repeat(dotCount) }}
          </div>
        </div>

        <div
          v-if="sendStatus === 'success'"
          class="broadcasts_popup-footer_success"
        >
          <img src="/public/images/broadcasts/Group.svg"></img>
          <div class="broadcasts_popup_status_text">
            Рассылка успешно отправлена участникам!
          </div>
        </div>

        <div
          v-if="sendStatus === 'error'"
          class="broadcasts_popup-footer_error"
        >
          <img src="/public/images/broadcasts/Vector (2).svg"></img>
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
