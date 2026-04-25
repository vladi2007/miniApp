<script setup lang="ts">
import { useInteractivities } from '~/composables/api/interactivities/useInteractivitesQuery'
import type { InteractivitiesListFilter } from '~/composables/api/interactivities/interactivities.types'
import { postReport } from '~/composables/api/reports/reports'

const showPopup = ref<boolean>(false)
const selectedInteractives = ref<number[]>([])
const selectedInteractive = ref<number>(0)
const selectedOption = ref<string | null>('')
const selectMany = ref(false)
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
const props = ref()

const filter = ref<InteractivitiesListFilter>('conducted')
const { data: interactivesData, isLoading, refetch } = useInteractivities(filter, to_number, from_number)
async function more_load() {
  to_number.value = String(Number(to_number.value) + 10)
}
const is_end = ref<string>('')
const finder = ref<string>('')
const is_empty_list = computed(() => {
  if (interactivesData?.value && interactivesData?.value.interactive_list.length > 0) {
    return false
  }
  else {
    return true
  }
})
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
  selectedOption.value = null

  showPopup.value = true
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
      window.alert(`Выберите тип отчета!`)
      return
    }
    try {
      const hasSelectedInteractives = selectedInteractives.value.length > 0
      let interactiveIds
      if (hasSelectedInteractives) {
        interactiveIds = selectedInteractives.value.map(id => ({ id }))
      }
      else {
        interactiveIds = [{ id: selectedInteractive.value }]
      }

      const body = {
        interactive_id: interactiveIds,
        report_type: selectedOption.value,
      }

      const response = await postReport(body)
      // need to fownload file
      if (response) {
        if (response?.url) {
          // Создаем ссылку для скачивания
          const link = document.createElement('a')
          link.href = response.url
          link.download = response.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }

      selectedOption.value = ''
    }
    catch (error) {
      window.alert(`Ошибка при выгрузке отчета: ${12}`)
    }
  }
  else {
    window.alert(`Выберите хотя бы один интерактив для формирования отчёта!`)
  }
}
// для скачивания отчёта одного
function openPopup(id: number) {
  if (selectedInteractives.value.length === 0) {
    selectedOption.value = null
    selectedInteractive.value = id
    showPopup.value = true
  }
}

function closePopup() {
  showPopup.value = false
  selectedOption.value = null
  selectedInteractive.value = 0
}

watch(selectedInteractives, (newSelectedInteractives) => {
  console.log(newSelectedInteractives.length)
  selectMany.value = newSelectedInteractives.length > 0
}, { deep: true })

function urlReport(value: string) {
  if (selectedOption.value !== value) { return '/images/interactives/circle_report.svg' }
  else { return '/images/interactives/circle_report_picked.svg' }
}
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
  <Layout :active_nav="'reports'">
    <div class="history_info">
      <img src="/public/images/history/history_info.svg">
      <div>
        Вы можете выгрузить два вида отчетов.<br>
        Доступна функция выгрузки отчетов с нескольких интерактивов.
      </div>
    </div>
    <div v-if="!is_empty_list" class="history_selected_interactives">
      <div class="history_selected_interactives_header">
        Список выбранных интерактивов
      </div>
      <div :class="{ selected_list: selectedInteractives.length > 0 }">
        <div v-for="id in selectedInteractives" v-if="selectedInteractives.length > 0" id="history_list_list" :key="id">
          <div class="history_list_list_item_selected" :class="['selected_item']">
            <div class="history_list_list_item_title">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.title}}
            </div>
            <div class="history_list_list_item_date">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.date_completed}}
            </div>
            <div class="history_list_list_item_count" style="width:calc((226 / 1280) * 100dvw) !important; ">
              Количество участников: {{interactivesData?.interactive_list?.find(item => item.id
                === id)?.participant_count}}
            </div>
            <img src="/public/images/history/history_delete.svg"
              @click="selectedInteractives = selectedInteractives.filter(item => item !== id)">
          </div>

        </div>
      </div>
      <div v-if="selectedInteractives.length > 0" class="history_list_selected_download" @click="showPopup = true">
        Выгрузить
      </div>
      <div v-if="selectedInteractives.length === 0" class="history_selected_interactives_info">
        <img src="/public/images//history/finder_info.svg">

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
        <img src="/public/images/history/finder.svg" class="input-icon">

        <input v-model="finder" type="text" placeholder="Поиск интерактива" class="search-input">
      </div>
    </div>
    <div v-if="interactivesData && is_empty_list" class="history_empty_list_info">
      <img src="/public/images//history/finder_info.svg">
      <div class="history_empty_list_info_h1">
        У Вас нет интерактивов
      </div>
      <div class="history_empty_list_info_h2">
        Проведите свой первый интерактив и он отобразится здесь
      </div>
    </div>
    <div v-if="interactivesData && !is_empty_list" class="history_list">
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
      <div v-for="(item, index) in interactivesData?.interactive_list" :key="item.id" class="history_list_list">

        <div class="history_list_list_item">
          <div class="history_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }"
            @click="toggleTitle(String(item.id))">
            {{ item.title }}
          </div>
          <div class="history_list_list_item_leadername title-clamp" :class="{ expanded: expandedLeaders[item.id] }"
            @click="toggleLeader(String(item.id))">
            {{ item.username }}
          </div>
          <div class="history_list_list_item_date">
            {{ item.date_completed }}
          </div>
          <div class="history_list_list_item_count">
            {{ item.participant_count }}
          </div>
          <div class="history_list_list_item_download_one" @click="openPopup(item.id)">
            Выгрузить
          </div>
          <div class="history_list_list_item_download_many"
            :style="{ visibility: selectedInteractives.includes(item.id) ? 'hidden' : 'visible' }"
            @click="selectManyOption(item.id)">
            Выбрать
          </div>
        </div>
      </div>
      <div v-if="!interactivesData.is_end" class="history_show_more" @click="more_load()">
        Показать еще
      </div>
    </div>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <div class="popup-header">
          <div class="popup-header-text">
            Какой отчет хотите выгрузить
          </div>
          <img src="/images/history/Vector_1.svg" class="popup-close" @click="closePopup">
        </div>
        <div class="popup-body">
          <label class="popup-option" @click="selectedOption = 'forLeader'">
            <img :src="urlReport('forLeader')">
            <span class="popup-option-span">Отчет для ведущего</span>
          </label>
          <label class="popup-option second" @click="selectedOption = 'forAnalise'">
            <img :src="urlReport('forAnalise')">
            <span class="popup-option-span">Отчет для обработки</span>
          </label>
        </div>
        <div class="popup-footer">
          <button class="popup-cancel" @click="showPopup = false">
            Отменить
          </button>
          <button class="popup-submit" @click="submitReport">
            Выгрузить
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style>
@import url("~/assets/css/history/new_history.scss");
@import url("~/assets/css/history/new_history_static.scss");
</style>
