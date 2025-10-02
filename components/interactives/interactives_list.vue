<script setup lang="ts">

// первичные данные об интерактивах
const props = defineProps<{
  header: string,
  interactives_list: {
    title: string,
    question_count: string,
    target_audience: string,
    id: string,
    date_completed: string
  }[]
  status: string
}
>()

// закрытие поп апа с подтверждением дублирования
function closePopup() {
  showPopup.value = false;
  showDeletePopap.value = false;

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
  route.push(`/leader/dublicate/${id}`)
}

// переход на редактирование интерактива
function edit_interactive(id: string) {
  route.push(`/leader/edit/${id}`)
}
// флаг для поп апа  с подтверждением дублирования
const showPopup = ref(false);

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
  try {


    const data = await $fetch(`/api/get_interactive`, {
      method: 'GET',
      query: {
        telegram_id: userId.value,
        id: id
      }
    })

    const payload = {
      title: data.title,
      description: data.description,
      target_audience: data.target_audience,
      location: data.location,
      responsible_full_name: data.responsible_full_name,
      answer_duration: data.answer_duration,
      discussion_duration: data.discussion_duration,
      countdown_duration: data.countdown_duration,
      questions: data.questions.map((q: any, index: number) => ({
        text: q.text,
        position: index + 1,
        answers: q.answers.map((a: any) => ({
          text: a.text,
          is_correct: a.is_correct
        }))
      }))
    }

    const response = await $fetch<CreateInteractiveResponse>(`/api/create_interactive`, {
      method: 'POST',
      query: {
        telegram_id: userId.value,
      },
      body: payload
    })

    window.location.reload()
  } catch (err) {
    console.error('Ошибка дублирования:', err)
    window.Telegram.WebApp.showAlert('Не удалось продублировать интерактив.')
  }
}


const currentInteractiveId = ref<string | null>(null)

const showDeletePopap = ref(false)

function deletePopup(id: string) {
  currentInteractiveId.value = id
  showDeletePopap.value = true
}
const localInteractives = ref([...props.interactives_list])

async function deleteInteractive(id: string) {
  const response = await $fetch(`/api/delete_interactive`, {
    method: 'DELETE',
    query: {
      telegram_id: userId.value,
      id: id
    },

  })
  if (response) {
    window.Telegram.WebApp.showAlert('Интерактив успешно удалён')
      localInteractives.value = localInteractives.value.filter(item => item.id !== id)
     showDeletePopap.value = false;
  }

}
</script>

<template>
  <div class="interactive_list">
    <div class="interactive_list_header">
      {{ props.header }}
    </div>
    <div class="interactive_list_content" >
      <div class="date" v-if="isEnd">Дата проведения</div>
      <div class="interactive_list_content_list" v-for="interactive in localInteractives"
        :class="{ margin: !isEnd }" v-if="localInteractives.length > 0">
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
            <div class="interactive_dublicate" :class="{ hidden: isEnd }" title="Дублировать интерактив"
              @click="Popup(interactive.id)">
              <img src="/images/interactives/dublicate.svg" id="dublicate" />
            </div>
            <div class="interactive_delete" v-if="!isEnd" title="Удалить интерактив"
              @click="deletePopup(interactive.id)">
              <img src="/images/interactives/vector.png" id="delete" />
            </div>
            <div class="interactive_edit" v-if="!isEnd" @click="edit_interactive(String(interactive.id))"
              title="Редактировать интерактив">
              <img src="/images/interactives/edit.svg" id="edit" />
            </div>
            <div class="interactive_start" v-if="!isEnd" @click="start_interactive(String(interactive.id))"
              title="Запустить интерактив">
              <img src="/images/interactives/start.svg" id="start" />
            </div>
          </div>

          <div class="interactive_date" v-if="isEnd">
            {{ interactive.date_completed }}
          </div>

        </div>

      </div>
      <div  class ="interactive_list_content_warn"  v-if="localInteractives.length ===0 && isEnd">
              Вы не провели ни один интерактив!
            </div>
      <div  class ="interactive_list_content_warn"  v-if="localInteractives.length ===0 && !isEnd">
              Вы не создали ни один интерактив!
            </div>
    </div>
    <div v-if="showPopup" class="interactives_popup-overlay">
      <div class="interactives_popup">
        <div class="interactives_popup-header">
          <div class="interactives_popup-header-text">Вы точно хотите продублировать выбранный интерактив?</div>
          <img src="/images/history/Vector_1.svg" class="interactives_popup-close" @click="closePopup" />
        </div>
        <div class="interactives_popup-body">

          <button class="interactives_popup-button"
            @click="duplicateAndSaveInteractive(String(currentInteractiveId))">Да</button>
          <button class="interactives_popup-button" @click="closePopup()">Нет</button>
          <button class="interactives_popup-button" @click="dublicate_interactive(String(currentInteractiveId))">Да, и
            хочу его сразу отредактировать</button>
        </div>
      </div>
    </div>

    <div v-if="showDeletePopap" class="interactives_delete_popup-overlay">
      <div class="interactives_delete_popup">
        <div class="interactives_delete_popup-header">
          <div class="interactives_delete_popup-header-text">Вы действительно хотите удалить?</div>

        </div>
        <div class="interactives_delete_popup-body">

          <button class="interactives_delete_popup-button"
            @click="deleteInteractive(String(currentInteractiveId))">Удалить</button>
          <button class="interactives_delete_popup-button" @click="closePopup()">Отмена</button>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/interactives/interactives_list.scss");
</style>
