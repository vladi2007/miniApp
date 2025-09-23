<script setup lang="ts">


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
const router = useRouter()

function closePopup() {
  showPopup.value = false;

}
const route = useRouter()
const isEnd = computed(() => props.status === 'end')

function start_interactive(id: string) {
  route.push(`/leader/${id}`)
}
function Popup(id: string) {
  currentInteractiveId.value = id
  showPopup.value = true
}
function dublicate_interactive(id: string) {
  route.push(`/leader/dublicate/${id}`)
}

function edit_interactive(id: string) {
  route.push(`/leader/edit/${id}`)
}
const showPopup = ref(false);
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
</script>

<template>
  <div class="interactive_list">
    <div class="interactive_list_header">
      {{ props.header }}
    </div>
    <div class="interactive_list_content">
      <div class="date" v-if="isEnd">Дата проведения</div>
      <div class="interactive_list_content_list" v-for="interactive in props.interactives_list"
        :class="{ margin: !isEnd }">
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
  </div>
</template>

<style>
@import url("~/assets/css/interactives/interactives_list.scss");
</style>
