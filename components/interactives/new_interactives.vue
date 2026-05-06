<script setup lang="ts">
import Layout from '../layout.vue'
import { useInteractivities } from '~/composables/api/interactivities/useInteractivitesQuery'
import type { InteractivitiesListFilter } from '~/composables/api/interactivities/interactivities.types'
import { mutateDeleteInteractive, mutateDuplicateInteractive } from '~/composables/api/interactivities/useInteractivitiesMutation'
import { getInteractiveState } from '~/composables/api/interactivities/interactivities'
import { postReport } from '~/composables/api/reports/reports'
import { useAuthStore } from '~/store/auth'

const searchParams = useUrlSearchParams('history')
const from_number = computed({
  get: () => searchParams.from_number || '0',
  set: v => searchParams.from_number = v,
})

const to_number = computed({
  get: () => searchParams.to_number || '9',
  set: v => searchParams.to_number = v,
})

const filter = computed<InteractivitiesListFilter>({
  get: () => {
    const value = searchParams.filter
    if (value != 'all' && value != 'conducted' && value != 'not_conducted') {
      return 'all' as InteractivitiesListFilter
    }
    else return value as InteractivitiesListFilter
  },
  set: v => searchParams.filter = v,
})
const finder = ref<string>('')
const isOpen = ref(false)
const options_code = {
  all: 'Все',
  conducted: 'Проведенные',
  not_conducted: 'Не проведенные',
}
function toggleDropdown() {
  isOpen.value = !isOpen.value
}

const auth = useAuthStore()
const userRole = auth.role
async function selectOption(option: string) {
  filter.value = option as 'all' | 'conducted' | 'not_conducted'
  isOpen.value = false
  to_number.value = '9'
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
      ref && ref.contains(event.target as Node),
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

// В onMounted добавь:
onMounted(() => {
  if (!searchParams.from_number) {
    searchParams.from_number = '0'
  }
  if (!searchParams.to_number) {
    searchParams.to_number = '9'
  }
  if (!searchParams.filter) {
    searchParams.filter = 'all'
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
const is_empty_list = computed(() => {
  if (interactivesData.value) {
    if (interactivesData?.value?.interactive_list?.length > 0) {
      return false
    }
    else {
      return true
    }
  }
})

const router = useRouter()
async function goTo(url: string, active: string) {
  if (active === 'interactives') return
  router.push(url)
}
async function checkSettings(id: number) {
  router.push({
    path: `/leader/edit/${id}`, state: {
      is_checkSettings: true,
    },
  })
}
const { data: interactivesData, isLoading, refetch, error } = useInteractivities(filter, to_number as Ref<string>, from_number as Ref<string>)
async function more_load() {
  const scrollY = window.scrollY
  to_number.value = String(Number(to_number.value) + 10)
  await nextTick()
  window.scrollTo(0, scrollY)
}
const showPopup = ref(false)
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
  }
  else {
    openDropdownId.value = id
  }
}

function closePopup() {
  showDeletePopap.value = false
}
const { mutate: deleteMutation } = mutateDeleteInteractive()
function deleteInteractive(id: number, is_conducted: boolean) {
  showMoreMobile.value = false;
  showMoreMobileId.value = 0;
  closePopup()
  deleteMutation({ interactive_id: id })
}

const { mutate: duplicateInteractive } = mutateDuplicateInteractive()
function duplicateAndSaveInteractive(id: number) {
  showPopup.value = false
  duplicateInteractive(id)
}
const show_report_Popup = ref<boolean>(false)
const selectedOption = ref<string | null>('')
const selectedInteractive = ref<number>(0)
async function submitReport() {
  showPopup.value = false

  if (selectedInteractive.value) {
    if (selectedOption.value !== 'forAnalise' && selectedOption.value !== 'forLeader') {
      window.alert(`Выберите тип отчета!`)
      return
    }
    try {
      const interactiveIds = [{ id: selectedInteractive.value }]

      const body = {
        interactive_id: interactiveIds,
        report_type: selectedOption.value,
      }

      const response = await postReport(body)

      if (response) {
        if (response.url) {
          // Создаем ссылку для скачивания
          const link = document.createElement('a')
          link.href = response.url
          link.download = response.name
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
    catch (error) {
      window.alert(`Ошибка при выгрузке отчета: `)
    }
  }
  else {
    window.alert(`Выберите хотя бы один интерактив для формирования отчёта!`)
  }
}

const showDeletePopap = ref(false)
const isRunning = ref(false)
async function deletePopup(id: number) {
  try {
    const data = await getInteractiveState(id)
    isRunning.value = data
  }
  catch (err) {
    console.error('Ошибка удаления', err)
    window.alert('Не удалось получить состояние интерактива!')
  }
  currentInteractiveId.value = String(id)
  showDeletePopap.value = true
}

const info = computed(() => {
  if (filter.value === 'conducted') return 'Проведите свой первый интерактив и он отобразится здесь'
  else return 'Создайте свой первый интерактив и он появится здесь'
})
function goToBroadcast(interactiveId: number) {
  router.push({
    path: '/leader/broadcasts', // путь к странице рассылки
    query: { selected: interactiveId }, // передаём id интерактива
  })
}
const showStart = ref(false)
const currID = ref(0)

const showEdit = ref(false)
function urlReport(value: string) {
  if (selectedOption.value !== value) { return '/images/interactives/circle_report.svg' }
  else {
    if (!isMobile.value) return '/images/interactives/circle_report_picked.svg'
    else return '/images/interactives/circle_report_picked_mobile.svg'
  }
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

const startY = ref(0)
const currentY = ref(0)
const isMobile = useMediaQuery('(max-width: 767px)')
const isIpad = useMediaQuery('(max-width: 1056px)')
const $style = useCssModule()
const isDragging = ref(false)

const showMoreMobile = ref(false)
const showMoreMobileId = ref(0)
const showMoreItem = computed(() => (interactivesData.value!.interactive_list.find((item) => item.id == showMoreMobileId.value)!))
watch(isIpad, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    showMoreMobile.value = false
    showMoreMobileId.value = 0
  }
})
function handleStartClick(item: any) {
  if (!item.is_conducted && item.is_you) return
  showStart.value = true
  currID.value = item.id
  showMoreMobile.value = false
  showMoreMobileId.value = 0
}
function resetTouch() {
  isDragging.value = false
  startY.value = 0
  currentY.value = 0
}
function closeAllPopups() {
  showMoreMobile.value = false
  showDeletePopap.value = false
  showEdit.value = false
  showPopup.value = false
  showStart.value = false
  show_report_Popup.value = false
  openDropdownId.value = null
  showMoreMobileId.value = 0
  currID.value = 0
  currentInteractiveId.value = null
  selectedInteractive.value = 0
  selectedOption.value = ''

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

    const sheet = document.querySelector(`.${$style.interactives__popup_overlay}`) as HTMLElement
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
  const sheet = document.querySelector(`.${$style.interactives__popup_overlay}`) as HTMLElement
  if (sheet) {
    sheet.style.transform = ''
  }

  if (!sheet) return
  // Добавляем плавную анимацию для возврата или закрытия
  sheet.style.transition = 'transform 0.01s ease'
  if (diff > 150) {
    // закрываем
    e.preventDefault()
    if (start == 'start') {
      showStart.value = false
      currID.value = 0
    }
    else if (start === 'more') {
      showMoreMobile.value = false
      showMoreMobileId.value = 0
    }
    else {
      closeAllPopups()
    }

    sheet.style.transform = ''
  } else {
    // возвращаем назад
    sheet.style.transform = 'translateY(0)'
  }
}
watch(
  [showPopup, showStart, showEdit, showDeletePopap, show_report_Popup, showMoreMobile],
  ([popup, start, edit, del, report, more]) => {
    if (!popup && !start && !edit && !del && !report && !more) {
      resetTouch()
    }
  }
)
</script>

<template>
  <Layout :active_nav="'interactives'">
    <div :class="$style.interactives">
      <div :class="$style.interactives__finder">
        <div :class="$style.interactives__finder_finder">
          <img src="/public/images/history/finder.svg" :class="$style.interactives__finder_finder_icon">

          <input v-model="finder" type="text" placeholder="Поиск интерактива"
            :class="$style.interactives__finder_finder_input">
        </div>
        <div @click="goTo('/leader/create_interactive', '')" :class="$style.interactives__create">
          <img src="/public/images/interactives/create.svg" />
          <span>
            Создать интерактив
          </span>

        </div>
      </div>
      <div ref="dropdownRef" :class="$style.interactives__filter">
        <div @click="toggleDropdown" :class="$style.interactives__filter_dropdown">
          <div :class="$style.interactives__filter_selected">
            Фильтр
          </div>
          <div :class="$style.interactives__filter_arrow">
            <img v-if="isOpen" src="/public/images/interactives/open.svg">
            <img v-if="!isOpen" src="/public/images/interactives/close.svg">
          </div>
        </div>

        <div v-if="isOpen" :class="$style.interactives__filter_options" style="z-index: 10001;">
          <div :class="$style.interactives__filter_list">
            <div v-for="(label, value) in options_code" :key="value"
              :class="[$style.interactives__filter_option, filter === value ? $style.interactives__filter_option_active : $style.interactives__filter_option]"
              @click.stop="selectOption(value)">
              <img v-if="filter === value" src="/public/images/interactives/picked.svg">
              <img v-else src="/public/images/interactives/Ellipse.svg">
              <div :class="$style.interactives__filter_option_text">
                {{ label }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isLoading && is_empty_list" :class="$style.interactives__info">
        <img src="/public/images//history/finder_info.svg" :class="$style.interactives__info_img">
        <div :class="$style.interactives__info_header">
          У Вас нет интерактивов
        </div>
        {{ }}
        <div :class="$style.interactives__info_text">
          {{ info }}
        </div>
      </div>
      <div v-if="!isLoading && !is_empty_list" :class="$style.interactives__list">
        <div :class="$style.interactives__list_header">
          <div :class="$style.interactives__list_header_name">
            Название
          </div>
          <div :class="$style.interactives__list_header_leader">
            Ведущий
          </div>
          <div :class="$style.interactives__list_header_date">
            Дата
          </div>
          <div :class="$style.interactives__list_header_status">
            Статус
          </div>
          <div :class="$style.interactives__list_header_count">
            Количество участников
          </div>
        </div>
        <div v-for="(item, index) in interactivesData?.interactive_list" :key="item.id"
          :class="$style.interactives__list_grid">
          <div :class="$style.interactives__list_item">
            <div class="interactives_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }"
              @click="toggleTitle(String(item.id))">
              {{ item.title }}
            </div>
            <div class="interactives_list_list_item_leadername title-clamp" @click="toggleLeader(String(item.id))"
              :class="{ expanded: expandedLeaders[item.id] }">
              {{ item.username }}
            </div>
            <div :class="$style.interactives__list_item_date">
              {{ item.date_completed }}
            </div>
            <div :class="$style.interactives__list_item_status">
              {{ item.is_conducted ? "Проведен" : "Не проведен" }}
            </div>
            <div :class="$style.interactives__list_item_count">
              {{ item.is_conducted ? item.participant_count : '' }}
            </div>
            <div
              :class="[$style.interactives__list_item_start, item.is_conducted || !item.is_you ? $style.interactives__list_item_start_ended : $style.interactives__list_item_start,]"
              @click="handleStartClick">
              <img v-if="!item.is_conducted && item.is_you" src="/public/images/interactives/start_mobile.svg">
              <img v-else src="/public/images/interactives/start_end_mobile.svg">
              <div>
                Запустить
              </div>

            </div>
            <img src="/public/images/interactives/more_mobile.svg" :class="$style.interactives__list_item_more"
              @click="showMoreMobile = true; showMoreMobileId = item.id">


            <div :class="$style.interactives__list_item_buttons">
              <div title="Дублировать интерактив" @click="Popup(String(item.id))" style="background-color: #853CFF;"
                id="dublicate">
                <img src="/images/interactives/dublicate_2.svg">
              </div>
              <div v-if="!item.is_you || item.is_conducted" title="Просмотреть настройки интерактива"
                @click="checkSettings(item.id)" style="background-color: #6AB23D;;margin-left: 10px;" id="leader_board">
                <img src="/images/interactives/check.svg">
              </div>
              <div v-if="item.is_conducted" title="Показать лидерборд"
                @click="goTo(`/leader/interactive_leader_board/${item.id}`, '')"
                style="background-color: #6AB23D;;margin-left: 10px;" id="leader_board">
                <img src="/images/interactives/leader_board.svg">
              </div>

              <div v-if="!item.is_conducted && item.is_you" title="Редактировать интерактив"
                @click="showEdit = true; currID = item.id" style="background-color: #F0436C;margin-left: 10px;"
                id="edit">
                <img src="/images/interactives/edit_2.svg">
              </div>
              <div v-if="!item.is_conducted && item.is_you" title="Запустить интерактив"
                @click="showStart = true; currID = item.id" style="background-color: #6AB23D;;margin-left: 10px;"
                id="leader_board">
                <img src="/images/interactives/start_2.svg">
              </div>
              <div v-if="!item.is_conducted && (item.is_you || userRole === 'admin' || userRole === 'organizer')"
                title="Удалить интерактив" style="width: 14px;height: 18px;margin-left: auto;"
                @click="deletePopup(item.id)" id="delete">
                <img id="delete" src="/images/interactives/vector.png" style="width: 14px;height: 18px;">
              </div>
              <div v-if="item.is_conducted" :ref="el => setDropdownRef(el, index)" style="margin-left: auto; position: relative;width: 14px;height: 36px;display: flex;
                align-items: center;justify-content: center">
                <div title="Еще" @click="toggleItemDropdown(String(item.id))" style=" display: flex;
                align-items: center;justify-content: center; cursor: pointer;" id="delete">
                  <img id="more_options" src="/images/interactives/more.svg">
                </div>
                <div v-if="openDropdownId == String(item.id)" style=" z-index: 10001 !important;"
                  :class="$style.interactives__list_item_buttons_more">
                  <div @click="show_report_Popup = true; selectedInteractive = item.id; openDropdownId = null;">
                    <img id="first_option_img" src="/public/images/interactives/download.svg">
                    <span>Выгрузить отчет</span>
                  </div>
                  <div @click="goToBroadcast(item.id)">
                    <img id="second_option_img" src="/public/images/interactives/send.svg">
                    <span>Отправить рассылку</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!interactivesData!.is_end" :class="$style.interactives__list_show" @click="more_load()">
          Показать еще
        </div>

      </div>

      <div v-if="showMoreMobile && useMediaQuery('(max-width: 1056px)').value" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay, $style.interactives__popup_more]" @click.stop
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'more')">
          <div :class="$style.interactives__popup_line"></div>

          <div :class="$style.interactives__popup_block" v-if="!showMoreItem!.is_conducted">
            <div :class="$style.interactives__popup_func" v-if="!showMoreItem!.is_conducted && showMoreItem!.is_you"
              @click="showEdit = true; currID = showMoreItem.id">
              <img src="/public/images/interactives/more_edit.svg" style="width: 16px; height: 17px; margin-left: 4px;">
              <div style="margin-left: 10px;">
                Редактировать
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
            <div :class="$style.interactives__popup_func"
              @click="showPopup = true; currentInteractiveId = String(showMoreItem.id)">
              <img src="/public/images/interactives/more_dubl.svg">
              <div>
                Дублировать
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
            <div :class="$style.interactives__popup_func" v-if="!showMoreItem!.is_you"
              @click="checkSettings(showMoreItem.id)">
              <img src="/public/images/interactives/more_check.svg">
              <div>
                Просмотр
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">
            </div>
            <div :class="$style.interactives__popup_func"
              v-if="!showMoreItem!.is_conducted && (showMoreItem!.is_you || userRole === 'admin' || userRole === 'organizer')"
              @click="deletePopup(showMoreItem.id)">
              <img src="/public/images/interactives/more_delete.svg"
                style="width: 14px; height: 18px; margin-left: 5px;">
              <div style="margin-left: 11px;">
                Удалить
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>

          </div>
          <div :class="$style.interactives__popup_block" v-if="showMoreItem.is_conducted">
            <div :class="$style.interactives__popup_func"
              @click="showPopup = true; currentInteractiveId = String(showMoreItem.id)">
              <img src="/public/images/interactives/more_dubl.svg">
              <div>
                Дублировать
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
            <div :class="$style.interactives__popup_func" @click="checkSettings(showMoreItem.id)">
              <img src="/public/images/interactives/more_check.svg">
              <div>
                Просмотр
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
            <div :class="$style.interactives__popup_func" v-if="showMoreItem!.is_conducted"
              @click="goTo(`/leader/interactive_leader_board/${showMoreItem.id}`, '')">
              <img src="/public/images/interactives/more_board.svg">
              <div>
                Показать лидерборд
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>

          </div>

          <div :class="[$style.interactives__popup_block, $style.interactives__popup_block_conducted]"
            v-if="showMoreItem!.is_conducted">

            <div :class="$style.interactives__popup_func"
              @click="show_report_Popup = true; selectedInteractive = showMoreItem.id; openDropdownId = null">
              <img src="/public/images/interactives/more_report.svg">
              <div>
                Выгрузить отчёт
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
            <div :class="$style.interactives__popup_func" @click="goToBroadcast(showMoreItem.id)">
              <img src="/public/images/interactives/more_broad.svg">
              <div>
                Отправить рассылку
              </div>
              <img src="/public/images/interactives/more_popup_arrow.svg">

            </div>
          </div>
        </div>
      </div>

      <div v-if="showPopup" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay, $style.interactives__popup_overlay_dubl]" @click.stop
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.interactives__popup_line"></div>
          <div :class="$style.interactives__popup_text">
            Вы уверены, что хотите продублировать выбранный интерактив?
          </div>
          <div :class="[$style.interactives__popup_buttons, $style.interactives__popup_buttons_report]">
            <button @click="showPopup = false; currentInteractiveId = null"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_second, $style.interactives__popup_btn_first_start]">
              Отменить
            </button>


            <button @click="dublicate_interactive(String(currentInteractiveId))"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_third, $style.interactives__popup_btn_third_start]">
              Дублировать и редактировать
            </button>
            <button @click="duplicateAndSaveInteractive(Number(currentInteractiveId!))"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_first, $style.interactives__popup_btn_second_start]">
              Дублировать
            </button>
          </div>
        </div>
      </div>
      <div v-if="showStart" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay]" @click.stop @touchstart="onTouchStart"
          @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'start')">
          <div :class="$style.interactives__popup_line"></div>
          <div :class="$style.interactives__popup_text">
            Вы уверены, что хотите запустить интерактив?
          </div>
          <div :class="$style.interactives__popup_text_">
            По окончании интерактива Вы сможете выгрузить отчет.
          </div>
          <div :class="[$style.interactives__popup_buttons, $style.interactives__popup_buttons_delete]">
            <button @click="showStart = false; currID = 0"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_first, $style.interactives__popup_btn_first_start]">
              Отменить
            </button>
            <button style="" @click="start_interactive(String(currID)); currID = 0"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_second, $style.interactives__popup_btn_second_start]">
              Запустить
            </button>
          </div>
        </div>
      </div>
      <div v-if="showEdit" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay, $style.interactives__popup_overlay_edit]" @click.stop
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.interactives__popup_line"></div>
          <div :class="$style.interactives__popup_text">
            Вы уверены, что хотите отредактировать интерактив?
          </div>
          <div
            :class="[$style.interactives__popup_buttons, $style.interactives__popup_buttons_delete, $style.interactives__popup_buttons_edit]">
            <button @click="showEdit = false; currID = 0"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_first, $style.interactives__popup_btn_first_start]">
              Отменить
            </button>
            <button
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_second, $style.interactives__popup_btn_second_start]"
              @click="edit_interactive(String(currID)); currID = 0">
              Редактировать
            </button>
          </div>
        </div>
      </div>
      <div v-if="showDeletePopap" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay]" @click.stop @touchstart="onTouchStart"
          @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.interactives__popup_line"></div>
          <img src="/public/images/interactives/delete_close.svg" @click="closePopup()">

          <div :class="$style.interactives__popup_text">
            {{ isRunning
              ? 'Интерактив запущен! Все данные интерактива будут удалены!'
              : 'Вы уверены, что хотите удалить интерактив?' }}
          </div>
          <div :class="$style.interactives__popup_text_">
            Это действие отменить будет невозможно. <br />Вопросы и данные интерактива не будут сохранены.
          </div>
          <div :class="[$style.interactives__popup_buttons, $style.interactives__popup_buttons_delete]">
            <button @click="closePopup()"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_first, $style.interactives__popup_btn_first_delete]">
              Отменить
            </button>
            <button
              @click="deleteInteractive(Number(currentInteractiveId), (interactivesData?.interactive_list?.find((v) => v.id == Number(currentInteractiveId)))!.is_conducted)"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_second, $style.interactives__popup_btn_second_delete]">
              {{ isRunning ? 'Закончить и удалить интерактив' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="show_report_Popup === true" :class="$style.interactives__popup">
        <div :class="[$style.interactives__popup_overlay]" @click.stop @touchstart="onTouchStart"
          @touchmove="onTouchMove" @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.interactives__popup_line"></div>
          <img src="/images/history/Vector_1.svg"
            @click="show_report_Popup = false; selectedInteractive = 0; selectedOption = ''">
          <div :class="[$style.interactives__popup_text, $style.interactives__popup_text_report]">
            Выгрузить отчет
          </div>
          <div :class="[$style.interactives__popup_report]">
            <div @click="selectedOption = 'forLeader'" :class="[$style.interactives__popup_option]">
              <img :src="urlReport('forLeader')">
              <span>Отчет для ведущего</span>
            </div>
            <div @click="selectedOption = 'forAnalise'" :class="[$style.interactives__popup_option]">
              <img :src="urlReport('forAnalise')">
              <span>Отчет для обработки</span>
            </div>
          </div>
          <div :class="[$style.interactives__popup_buttons, $style.interactives__popup_buttons_delete]">
            <button @click="show_report_Popup = false; selectedInteractive = 0; selectedOption = ''"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_second, $style.interactives__popup_btn_first_delete]">
              Отменить
            </button>
            <button @click="submitReport"
              :class="[$style.interactives__popup_btn, $style.interactives__popup_btn_third, $style.interactives__popup_btn_third_start]">
              Выгрузить
            </button>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>
<style>
#delete:hover {
  filter: brightness(11%);
}

#dublicate:hover {
  background-color: #AA77FF !important;
}

#leader_board:hover {
  background-color: #9AC57E !important;
}

#edit:hover {
  background-color: #DE7D94 !important;
}

.interactives_list_list_item_title,
.interactives_list_list_item_leadername {
  position: relative;
  /* для ::after */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;
  white-space: nowrap;
}

.interactives_Line {
  background-color: #e9e9e9 !important;
  height: 1px !important;
}

.interactives_list_list_item_title {


  grid-area: title;
  width: 100%;
  background-color: #F7F7F7;
  border-radius: 5px;
  padding: 0 5px;
  height: 36px;
  display: flex;
  align-items: center;
}

.interactives_list_list_item_leadername {

  display: none;
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

.interactives_list_list_item_leadername.expanded,
.interactives_list_list_item_title.expanded {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.title-clamp.expanded::after {
  display: none;
  /* только у текущего элемента с expanded */
}



@media (min-width:1056px) {
  .interactives_list_list_item_title {
    margin-left: 22px;
    width: 222px;
    text-align: left;
    height: 36px;
    background-color: white;
  }

  .interactives_list_list_item_leadername {

    padding: 0;
    margin-left: 27px;
    width: 150px;
    text-align: center;
    display: flex;
    justify-content: center;
    background-color: white;
  }

}
</style>
<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

// Класс для развернутого состояния
.title-expanded {
  -webkit-line-clamp: unset !important;
  line-clamp: unset !important;
  white-space: normal !important;
  max-height: none !important;

  &::after {
    display: none !important;
  }
}

.interactives {
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
    margin-top: 25px;
  }

  &__finder {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;

    @media (min-width:1056px) {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 30px;
    }

    &_finder {
      position: relative;
      display: flex;
      align-items: center;
      height: 29px;
      width: 100%;

      @media (min-width:1056px) {
        width: 765px;
        height: 39px;
      }

      &_icon {
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

      &_input {
        width: 100%;
        height: 29px;
        line-height: 29px;
        color: #1D1D1D !important;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-left: 30px;
        box-sizing: border-box;

        @media (min-width:1056px) {
          font-size: 16px;
          height: 39px;
          padding-left: 50px;
        }

        &::placeholder {
          line-height: 29px;
          display: flex;
          align-items: center;
          font-family: "Lato", sans-serif;
          font-weight: 500;
          font-size: 14px;
          color: #A9A9A9;

          @media (min-width:1056px) {
            font-size: 16px;
          }
        }


      }
    }
  }

  &__create {
    height: 29px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #E0F9C7;
    color: #6AB23D;
    font-size: 14px;

    @media (min-width:1056px) {
      font-size: 20px;
      width: 261px;
      height: 39px;
      background-color: #6AB23D;
      color: white;
      cursor: pointer;

      &:hover {
        background-color: white;
        color: #6AB23D;
        border: 1px solid #6AB23D;
      }
    }

    &>img {
      width: 13px;
      height: 13px;

      @media (min-width:1056px) {
        display: none;
      }
    }
  }

  &__filter {

    margin-top: 10px;
    position: relative;

    @media (min-width:1056px) {
      margin-top: 20px;
    }

    &_dropdown {
      font-size: 14px;
      width: 97px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background-color: #F3F3F3;
      border-radius: 20px;
      position: relative;

      @media (min-width:1056px) {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        width: 121px;
        font-size: 16px;
      }
    }

    &_arrow {
      &>img {
        width: 13px;
        height: 7px;

        @media (min-width:1056px) {
          width: 16px;
          height: 9px;
        }
      }
    }

    &_options {
      position: absolute;
      height: 95px;
      width: 157px;
      background-color: #FFFFFF;
      box-shadow: 0px 1px 13.8px 0px #00000040;
      border-radius: 8px;
      top: calc(100% + 10px);
      padding: 6px;

      @media (min-width:1056px) {
        padding: 16px;
        height: 103px;
        width: 179px;

      }
    }

    &_list {
      display: flex;
      flex-direction: column;
      gap: 4px;

      @media (min-width:1056px) {
        gap: 8px;
      }
    }

    &_option {
      display: flex;
      height: 25px;
      display: flex;
      align-items: center;
      padding: 4px;

      @media (min-width:1056px) {
        font-size: 16px;
        padding: 0;
        height: 19px;
        display: flex;
        align-items: center;
        gap: 5px;
        white-space: nowrap;
      }

      &>img {
        display: none;

        @media (min-width:1056px) {
          display: block;
          width: 17px;
          height: 17px;
        }
      }

      &_active {

        background-color: #E0E0E0;
        border-radius: 7px;

        @media (min-width:1056px) {
          background-color: white;
        }
      }
    }
  }

  &__info {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

    &_header {
      color: #7D7D7D;
      margin-top: 10px;
      ;
      font-size: 14px;
      font-weight: 500;

      @media (min-width:1056px) {
        font-weight: 700;
        font-size: 20px;
      }
    }

    &_text {
      color: #7D7D7D;
      font-size: 12px;
      font-weight: 400;
      margin-top: 5px;

      @media (min-width:1056px) {
        font-size: 14px;
      }
    }
  }

  &__list {
    margin-top: 19.25px;
    padding-bottom: 92px;
    font-size: 16px;

    &_header {
      display: none;

      @media (min-width:1056px) {
        margin-top: 35px;
        height: 46px;
        display: flex;
        align-items: center;
        color: #A9A9A9;
        padding-left: 22px;
        border-bottom: 1px solid #1D1D1D1D;
      }

      &_name {

        @media (min-width:1056px) {
          width: 222px;
          text-align: left;
        }
      }

      &_leader {
        @media (min-width:1056px) {
          width: 150px;
          text-align: center;
          margin-left: 27px;
        }
      }

      &_date {
        @media (min-width:1056px) {
          width: 111px;
          text-align: center;
          margin-left: 13px;
        }
      }

      &_status {
        @media (min-width:1056px) {
          width: 128px;
          text-align: center;
          margin-left: 17px;
        }
      }

      &_count {
        @media (min-width:1056px) {
          width: 192px;
          text-align: center;
          margin-left: 7px;
        }
      }
    }

    &_grid {
      display: flex;
      flex-direction: column;
      margin-bottom: 15.63px;

      @media (min-width:1056px) {
        display: flex;
        flex-direction: column;
        margin: 0;
      }

    }

    &_item {
      display: grid;
      align-items: center;
      grid-template-areas:
        "date more"
        "title title"
        "start start";
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 5px;
      font-size: 14px;

      @media (min-width:1056px) {
        font-size: 16px;
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0px;
        height: 46px;
        border-bottom: 1px solid #1D1D1D1D;

        &>div {
          white-space: nowrap;
        }
      }

      &_leadername {
        display: none;

        @media (min-width:1056px) {
          display: block;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          position: relative;



        }
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



        @media (min-width:1056px) {
          // Стили для обрезки текста на мобильных
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
          position: relative;
          background-color: white;
          ;
          display: block;
          width: 222px;
        }





        .expanded {
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      }

      &_date {
        box-sizing: border-box;
        grid-area: date;
        color: #A9A9A9;
        font-size: 14px;
        font-weight: 400;
        grid-area: date;
        height: 18.75px; // Высота первой строки
        display: flex;
        align-items: center;
        padding: 0 5px;

        @media (min-width:1056px) {
          padding: 0;
          color: #1D1D1D;
          width: 111px;
          font-size: 16px;
          margin-left: 13px;
        }
      }


      &_more {
        grid-area: more;
        height: 18.75px;

        width: 3.75px;
        width: 3.75;
        margin-right: 8px;

        @media (min-width:1056px) {
          display: none;
        }

      }

      &_count {
        display: none;

        @media (min-width:1056px) {
          display: block;
          width: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 103px;
        }
      }

      &_status {
        display: none;

        @media (min-width:1056px) {
          display: block;
          width: 102px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 30px;
        }
      }

      &_buttons {
        display: none;

        @media (min-width:1056px) {
          display: flex;
          align-items: center;
          width: 150px;
          margin-left: auto;
        }

        &>div {
          @media (min-width:1056px) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 5px;
            cursor: pointer;
          }
        }

        &_more {
          @media (min-width:1056px) {
            position: absolute;
            top: calc(100% + 13px);
            right: -27px;
            border-radius: 14px;
            height: 106px;
            width: 283px;
            padding: 17px 6px;
            box-shadow: 0px 1px 13.8px 0px #00000040;
            display: flex;
            flex-direction: column;
            gap: 4px;
            background-color: white;
          }

          &>div {
            height: 34px;
            padding: 5px 13px 5px 24px;
            display: flex;
            align-items: center;
            gap: 9px;
            font-size: 20px;

            &:hover {
              background-color: #DFDFDF;
              border-radius: 7px;
            }

          }
        }
      }

      &_start {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-left: auto;
        grid-area: start;
        width: 168px;
        height: 29px;
        background-color: #E0F9C7;
        border-radius: 8px;
        color: #6AB23D;

        @media (min-width:1056px) {
          display: none;
        }

        &_ended {
          background-color: #DFDFDF;
          color: #7D7D7D;
        }

        &>img {
          width: 12px;
          height: 14px;
        }
      }


    }



    &_show {
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

    &_buttons {
      padding: 0 22px;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      margin-top: 148px;

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
  }


}
</style>
