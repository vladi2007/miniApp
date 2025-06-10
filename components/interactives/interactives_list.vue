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
// Функция для закрытия попапа
function closePopup() {
  showPopup.value = false;

}
const route= useRouter()
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
      title: data.title ,
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
            <div class ="date" v-if="isEnd">Дата проведения</div>
            <div class="interactive_list_content_list" v-for="interactive in props.interactives_list" :class="{margin:!isEnd}">
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
                        <div class="interactive_dublicate"   :class="{hidden : isEnd}" title="Дублировать интерактив" @click="Popup(interactive.id)">
                            <img src="/images/interactives/dublicate.svg" id="dublicate" />
                        </div>
                        <div class="interactive_edit" v-if="!isEnd" @click="edit_interactive(String(interactive.id))" title="Редактировать интерактив">
                            <img src="/images/interactives/edit.svg" id="edit" />
                        </div>
                        <div class="interactive_start" v-if="!isEnd" @click="start_interactive(String(interactive.id))" title="Запустить интерактив">
                            <img src="/images/interactives/start.svg" id="start" />
                        </div>
                    </div>

                    <div class ="interactive_date" v-if="isEnd">
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
                    
                    <button class="interactives_popup-button" @click="duplicateAndSaveInteractive(String(currentInteractiveId))">Да</button>
  <button class="interactives_popup-button" @click="closePopup()">Нет</button>
  <button class="interactives_popup-button" @click ="dublicate_interactive(String(currentInteractiveId))">Да, и хочу его сразу отредактировать</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

.interactives_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  /* Тёмный фон для затемнения */
  z-index: 999;
  /* Модальное окно поверх контента */
  display: flex;
  justify-content: center;

}

.interactives_popup {
  margin-top: 360px;
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
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 36px;
  letter-spacing: 1px;
  padding-top: 48px;width:718px; 
margin: 0 auto;
  height:20px;
}
.interactives_popup-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* занимает всё пространство попапа */
  gap: 24px;
}
.interactives_popup-button {
  width: 320px;
  height: 62px;
  border-radius: 5px;
  font-family: 'Lato', sans-serif;
  font-size: 24px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
}

.interactives_popup-button:nth-child(2) {
  background-color: #F0436C;
  color: white;
}
.interactives_popup-button:nth-child(2):hover {
  background-color: #DE7D94;
}

.interactives_popup-button:nth-child(3) {
  background-color: #853CFF;
  color: white;
}
.interactives_popup-button:nth-child(3):hover {
  background-color: #AA77FF;
}

.interactives_popup-button:nth-child(1) {
  background-color: #6AB23D;
  color: white;
}
.interactives_popup-button:nth-child(1):hover {
  background-color: #9AC57E;
}
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.hidden{
    position: absolute;
    top:15px;
    left: 152px;;
}
.interactive_list {
    margin-left: 26px;
    ;
    width: 1319px;
    height: 703px;
    ;
}

.interactive_list_header {
    font-size: 36px;
    vertical-align: middle;
    font-weight: 700;
    font-family: 'Work Sans', sans-serif;
    color: #A774FC;
}

.interactive_list_content {
    background-color: #853CFF;
    overflow-y: auto;
    width: 1299px;
    height: 626px;
    margin-left: auto;
    margin-top: 35px;
    border-radius: 26px;
    overflow-x: hidden;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
}

.interactive_list_content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
}

.interactive_list_content_list {
    width: 1229px;
    min-height: 155px;
    background-color: white;
    border-radius: 30px;
    ;
    margin: 0 auto;

    margin-top: 9px;
    margin-bottom: 41px;
    ;
    overflow-x: hidden;

}

.interactive_description {
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    
    ;
    font-size: 24px;
    line-height: 32px;
    ;
    letter-spacing: 1px;
    ;
    height: 108px;
    ;
    padding-top: 25px;
    margin-left: 38px;
    ;

}

.interactive_title {
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 24px;
    ;
}

.interactive_question_count {
    margin-top: 24px;
}

.interactive_description {
    position: relative;
}

.interactive_buttons {
    position: absolute;
    top: 64px;
    ;
    display: flex;
    left: 941px;
    ;

}

.interactive_dublicate {cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 5px;
    ;
    background-color: #853CFF;
}
.interactive_dublicate:hover{
    background-color: #AA77FF;
}
.interactive_edit {cursor: pointer;
    margin-left: 16px;
    width: 60px;
    border-radius: 5px;
    ;
    height: 60px;
    ;
    background-color: #F0436C;
}
.interactive_edit:hover{
    background-color: #DE7D94;
}


.interactive_start {cursor: pointer;
    margin-left: 16px;
    width: 60px;
    border-radius: 5px;
    ;
    height: 60px;
    ;
    background-color: #6AB23D;
}
.interactive_start:hover{
    background-color: #9AC57E;
}
.interactive_dublicate,
.interactive_edit,
.interactive_start {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    display: flex;
    /* ✅ flex для центрирования */
    justify-content: center;
    /* ✅ по горизонтали */
    align-items: center;
    /* ✅ по вертикали */
}

.date{ white-space: nowrap;
        font-family: 'Lato', sans-serif;
        color: white;
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;
        vertical-align: middle;
        letter-spacing: 1px;;
        margin-top:9px;
        margin-left:1051px;
        width: 300px;;
}

.interactive_date{
    position: absolute;
    top:25px;
    left:1004px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 700;
    font-size: 36px;
    vertical-align: middle;
    letter-spacing: 1px;;
    color:#A774FC;
}
.margin{
    margin-top:41px;
}
</style>
