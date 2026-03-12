<script setup lang="ts">
// первичные данные об интерактивах
const props = defineProps<{
  header: string
  interactives_list: {
    title: string
    question_count: string
    target_audience: string
    id: string
    date_completed: string
  }[]
  status: string
}
>()

// закрытие поп апа с подтверждением дублирования
function closePopup() {
  showPopup.value = false
  showDeletePopap.value = false
}
// для маршрутизации
const route = useRouter()

// флаг для разделения завершенных интерактивов от не завершенных
const isEnd = computed(() => props.status === 'end')

// функция старта интерактива и переход на ождиание
function start_interactive(id: string) {
  route.push(`/leader/${id}`)
}
// вызов попапа с подтверждением дублирования
function Popup(id: string) {
  currentInteractiveId.value = id
  showPopup.value = true
}

// переход на редактирование, если пользователь хочет продублированный интерактив сразу изменить
function dublicate_interactive(id: string) {
  showPopup.value = false
  route.push(`/leader/duplicate/${id}`)
}

// переход на редактирование интерактива
function edit_interactive(id: string) {
  route.push(`/leader/edit/${id}`)
}
// флаг для поп апа  с подтверждением дублирования
const showPopup = ref(false)

// данные о пользователе
const webApp = ref(null)
const initDataUnsafe = ref(null)
const userId = ref(null)
onMounted(async () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    webApp.value = window.Telegram.WebApp
    initDataUnsafe.value = window.Telegram.WebApp.initDataUnsafe

    userId.value = initDataUnsafe.value?.user?.id
  }
})

// запрос на дублирование интерактива
async function duplicateAndSaveInteractive(id: string) {
  showPopup.value = false
  try {
    const data = await $fetch(`/api/get_interactive`, {
      method: 'GET',
      query: {
        telegram_id: userId.value,
        id: id,
      },
    })
    const plain = JSON.parse(JSON.stringify(data))
    const payload = {
      title: plain.title ?? '',
      description: plain.description ?? '',
      target_audience: plain.target_audience ?? '',
      location: plain.location ?? '',
      responsible_full_name: plain.responsible_full_name ?? '',
      answer_duration: plain.answer_duration ?? 10,
      discussion_duration: plain.discussion_duration ?? 5,
      countdown_duration: plain.countdown_duration ?? 5,
      questions: await Promise.all(
        (plain.questions ?? []).map(async (q: any, index: number) => {
          const imageUrl = q.image || ''

          return {
            question: {
              type: q.type || 'one',
              image: imageUrl,
              score: q.score || 1,
              position: index + 1,
              text: q.text || '',
              answers:
                q.answers?.map((a: any) => ({
                  text: a.text || '',
                  is_correct: a.is_correct || false,
                })) ?? [],
            },
          }
        }),
      ),
    }
    const formData = new FormData()

    formData.append('telegram_id', String(userId?.value || 0))
    formData.append('interactive', JSON.stringify(plain))
    const response = await $fetch('/api/create_interactive', {
      method: 'POST',
      query: {
        telegram_id: userId?.value || 0,
      },
      body: formData,
    })
    window.location.reload()
  }
  catch (err) {
    console.error('Ошибка дублирования:', err)
    window.Telegram.WebApp.showAlert('Не удалось продублировать интерактив.')
  }
}

const currentInteractiveId = ref<string | null>(null)

const showDeletePopap = ref(false)

const isRunning = ref(false)

async function deletePopup(id: string) {
  try {
    const data = await $fetch(`/api/get_state_interactive`, {
      method: 'GET',
      query: {

        id: Number(id),
      },
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
const localInteractives = ref([...props.interactives_list])

async function deleteInteractive(id: string) {
  showDeletePopap.value = false
  const response = await $fetch(`/api/delete_interactive`, {
    method: 'DELETE',
    query: {
      telegram_id: userId.value,
      id: id,
    },

  })
  if (response) {
    window.Telegram.WebApp.showAlert('Интерактив успешно удалён')
    localInteractives.value = localInteractives.value.filter(item => item.id !== id)
    showDeletePopap.value = false
  }
}
</script>

<template>
  <div class="interactive_list">
    <div class="interactive_list_header">
      {{ props.header }}
    </div>
    <div class="interactive_list_content">
      <div
        v-if="isEnd"
        class="date"
      >
        Дата проведения
      </div>
      <div
        v-for="interactive in localInteractives"
        v-if="localInteractives.length > 0"
        class="interactive_list_content_list"
        :class="{ margin: !isEnd }"
      >
        <div class="interactive_description">
          <div class="interactive_title">
            {{ interactive.title }}
          </div>

          <div class="interactive_question_count">
            Количество вопросов: {{ interactive.question_count }}
          </div>
          <div class="interactive_target_audience">
            Целевая аудитория: {{ interactive.target_audience }}
          </div>
          <div class="interactive_buttons">
            <div
              class="interactive_dublicate"
              :class="{ hidden: isEnd }"
              title="Дублировать интерактив"
              @click="Popup(interactive.id)"
            >
              <img
                id="dublicate"
                src="/images/interactives/dublicate.svg"
              >
            </div>
            <div
              v-if="!isEnd"
              class="interactive_delete"
              title="Удалить интерактив"
              @click="deletePopup(interactive.id)"
            >
              <img
                id="delete"
                src="/images/interactives/vector.png"
              >
            </div>
            <div
              v-if="!isEnd"
              class="interactive_edit"
              title="Редактировать интерактив"
              @click="edit_interactive(String(interactive.id))"
            >
              <img
                id="edit"
                src="/images/interactives/edit.svg"
              >
            </div>
            <div
              v-if="!isEnd"
              class="interactive_start"
              title="Запустить интерактив"
              @click="start_interactive(String(interactive.id))"
            >
              <img
                id="start"
                src="/images/interactives/start.svg"
              >
            </div>
          </div>

          <div
            v-if="isEnd"
            class="interactive_date"
          >
            {{ interactive.date_completed }}
          </div>
        </div>
      </div>
      <div
        v-if="localInteractives.length === 0 && isEnd"
        class="interactive_list_content_warn"
      >
        Вы не провели ни один интерактив!
      </div>
      <div
        v-if="localInteractives.length === 0 && !isEnd"
        class="interactive_list_content_warn"
      >
        Вы не создали ни один интерактив!
      </div>
    </div>
    <div
      v-if="showPopup"
      class="interactives_popup-overlay"
    >
      <div class="interactives_popup">
        <div class="interactives_popup-header">
          <div class="interactives_popup-header-text">
            Вы точно хотите продублировать выбранный интерактив?
          </div>
          <img
            src="/images/history/Vector_1.svg"
            class="interactives_popup-close"
            @click="closePopup"
          >
        </div>
        <div class="interactives_popup-body">
          <button
            class="interactives_popup-button"
            @click="duplicateAndSaveInteractive(String(currentInteractiveId))"
          >
            Да
          </button>
          <button
            class="interactives_popup-button"
            @click="closePopup()"
          >
            Нет
          </button>
          <button
            class="interactives_popup-button"
            @click="dublicate_interactive(String(currentInteractiveId))"
          >
            Да, и
            хочу его сразу отредактировать
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDeletePopap"
      class="interactives_delete_popup-overlay"
    >
      <div class="interactives_delete_popup">
        <div class="interactives_delete_popup-header">
          <div class="interactives_delete_popup-header-text">
            {{ isRunning
              ? 'Интерактив запущен! Все данные интерактива будут удалены!'
              : 'Вы действительно хотите удалить?' }}
          </div>
        </div>
        <div class="interactives_delete_popup-body">
          <button
            class="interactives_delete_popup-button"
            @click="deleteInteractive(String(currentInteractiveId))"
          >
            {{ isRunning ? 'Закончить и удалить интерактив' : 'Удалить' }}
          </button>
          <button
            class="interactives_delete_popup-button"
            @click="closePopup()"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/interactives/interactives_list.scss");
</style>
