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
  showPopup.value = false
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

    const sheet = document.querySelector(`.${$style.reports__popup_overlay}`) as HTMLElement
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
  const sheet = document.querySelector(`.${$style.reports__popup_overlay}`) as HTMLElement
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
  <Layout :active_nav="'reports'">
    <div :class="$style.reports">
      <div :class="$style.reports__info">
        <img src="/public/images/history/history_info.svg">
        <div>
          Вы можете выгрузить два вида отчетов.<br>
          Доступна выгрузка отчетов с нескольких интерактивов.
        </div>
      </div>
      <div v-if="!is_empty_list" :class="$style.reports__selected">
        <div :class="$style.reports__selected_header">
          Список выбранных интерактивов
        </div>
        <div v-if="selectedInteractives.length > 0" :class="$style.reports__selected_list">
          <div :class="$style.reports__selected_item" v-for="id in selectedInteractives"
            v-if="selectedInteractives.length > 0" :key="id">
            <div :class="$style.reports__selected_title">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.title}}
            </div>
            <div :class="$style.reports__selected_date">
              {{interactivesData?.interactive_list?.find(item => item.id === id)?.date_completed}}
            </div>
            <div :class="$style.reports__selected_count">
              Количество участников: {{interactivesData?.interactive_list?.find(item => item.id
                === id)?.participant_count}}
            </div>
            <img @click="selectManyOption(id)" src="/public/images/history/history_delete.svg">

          </div>
        </div>
        <div :class="$style.reports__selected_download" v-if="selectedInteractives.length > 0"
          @click="showPopup = true">
          Выгрузить
        </div>
        <div :class="$style.reports__selected_info" v-if="selectedInteractives.length === 0">
          <img src="/public/images//history/finder_info.svg">

          <div>
            Вы не выбрали интерактив
          </div>
        </div>
      </div>
      <div :class="$style.reports__finder">
        <div :class="$style.reports__finder_header">
          Список проведенных интерактивов
        </div>
        <div :class="$style.reports__finder_finder">
          <img src="/public/images/history/finder.svg">

          <input v-model="finder" type="text" placeholder="Поиск интерактива">
        </div>
      </div>
      <div :class="$style.reports__interactives_info" v-if="interactivesData && is_empty_list">
        <img :class="$style.reports__interactives_info_img" src="/public/images//history/finder_info.svg">
        <div :class="$style.reports__interactives_info_text">
          У Вас нет интерактивов
        </div>
        <div :class="$style.reports__interactives_info_text_">
          Проведите свой первый интерактив и он отобразится здесь
        </div>
      </div>
      <div :class="$style.reports__interactives" v-if="interactivesData && !is_empty_list">
        <div :class="$style.reports__interactives_header">
          <div :class="$style.reports__interactives_title">
            Название
          </div>
          <div :class="$style.reports__interactives_leader">
            Ведущий
          </div>
          <div :class="$style.reports__interactives_date">
            Дата
          </div>
          <div :class="$style.reports__interactives_count">
            Количество участников
          </div>
        </div>
        <div :class="$style.reports__interactives_list">

          <div :class="$style.reports__interactives_item" v-for="(item, index) in interactivesData?.interactive_list"
            :key="item.id">
            <div class="reports_list_list_item_title title-clamp" :class="{ expanded: expandedTitles[item.id] }"
              @click="toggleTitle(String(item.id))">
              {{ item.title }}
            </div>
            <div class="reports_list_list_item_leadername title-clamp" :class="{ expanded: expandedLeaders[item.id] }"
              @click="toggleLeader(String(item.id))">
              {{ item.username }}
            </div>
            <div :class="$style.reports__interactives_item_date">
              {{ item.date_completed }}
            </div>
            <div :class="$style.reports__interactives_item_count">
              {{ item.participant_count }}
            </div>
            <div :class="$style.reports__interactives_item_download" @click="openPopup(item.id)">
              Выгрузить
            </div>
            <div v-if="!selectedInteractives.includes(item.id)" :class="$style.reports__interactives_item_select"
              @click="selectManyOption(item.id)">
              Выбрать
            </div>
            <div :class="$style.reports__interactives_item_select_mobile" @click="selectManyOption(item.id)">
              <img v-if="!selectedInteractives.includes(item.id)" src="/public/images/history/select.svg">
              <img v-if="selectedInteractives.includes(item.id)" src="/public/images/history/selected.svg">
            </div>
          </div>
        </div>
        <div :class="$style.reports__interactives_more" v-if="!interactivesData.is_end" @click="more_load()">
          Показать еще
        </div>
      </div>

      <div v-if="showPopup" :class="$style.reports__popup">
        <div :class="[$style.reports__popup_overlay]" @click.stop @touchstart="onTouchStart" @touchmove="onTouchMove"
          @touchend="(e) => onTouchEnd(e, 'popup')">
          <div :class="$style.reports__popup_line"></div>
          <div :class="[$style.reports__popup_text, $style.reports__popup_text_report]">
            Выгрузить отчёт
          </div>
          <img src="/images/history/Vector_1.svg" @click="closePopup">
          <div :class="[$style.reports__popup_report]">
            <label :class="[$style.reports__popup_option]" @click="selectedOption = 'forLeader'">
              <img :src="urlReport('forLeader')">
              <span>Отчет для ведущего</span>
            </label>
            <label :class="[$style.reports__popup_option]" @click="selectedOption = 'forAnalise'">
              <img :src="urlReport('forAnalise')">
              <span>Отчет для обработки</span>
            </label>
          </div>
          <div :class="[$style.reports__popup_buttons, $style.reports__popup_buttons_delete]">
            <button
              :class="[$style.reports__popup_btn, $style.reports__popup_btn_second, $style.reports__popup_btn_first_delete]"
              @click="showPopup = false">
              Отменить
            </button>
            <button
              :class="[$style.reports__popup_btn, $style.reports__popup_btn_third, $style.reports__popup_btn_third_start]"
              @click="submitReport">
              Выгрузить
            </button>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>
<style>
.reports_list_list_item_title,
.reports_list_list_item_leadername {
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

.reports_list_list_item_leadername.expanded,
.reports_list_list_item_title.expanded {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.title-clamp.expanded::after {
  display: none;
  /* только у текущего элемента с expanded */
}

.reports_list_list_item_title {
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

.reports_list_list_item_leadername {
  display: none;
}

@media (min-width:1056px) {
  .reports_list_list_item_title {
    width: 253px;
    text-align: left;
    background-color: white;
  }

  .reports_list_list_item_leadername {
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

.reports {
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

  &__info {
    display: flex;
    gap: 3px;
    height: 28px;

    @media (min-width:1056px) {
      gap: 5px;
      height: 52px;
    }

    &>img {
      width: 17px;
      height: 17px;

      @media (min-width:1056px) {
        width: 24px;
        height: 24px;
      }
    }

    &>div {
      font-size: 12px;
      height: 28px;
      font-weight: 500;
      display: flex;
      align-items: center;
      line-height: 12px;
      color: #7D7D7D;

      @media (min-width:1056px) {
        font-size: 16px;
        height: 52px;
        font-weight: 500;
        display: flex;
        align-items: center;
        line-height: 26px;
      }
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
      border-radius: 5px;

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
        margin-top: 20px;
        margin-right: 15px;
        font-size: 20px;
        width: 99px;
        height: 24px;
        background-color: white;
        color: #6AB23D;
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

        @media (min-width:1056px) {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #6AB23D;
          height: 36px;
          width: 131px;
          margin-left: 62px;
          color: white;
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
