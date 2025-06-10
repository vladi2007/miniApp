<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CountdownData } from '~/types/stageData'
import nav_bar from '~/components/main_menu/nav_bar.vue'
import general_settings from '~/components/interactive_editor/general_settings.vue'
import { ref } from 'vue'

const generalSettingsRef = ref<InstanceType<typeof general_settings> | null>(null)
const route = useRouter()

const step = ref(1)

function handleBackClick() {
  if (step.value === 1) {
    showConfirmPopup.value = true
  } else {
    step.value = 1
  }
}
const router = useRoute()

const mode = computed(() => router.params.mode as string)
const id = computed(() => router.params.id as string)
console.log(mode.value)
const showConfirmPopup = ref(false)
async function confirmBack(save: boolean) {
  if (save && generalSettingsRef.value) {
    const success = await generalSettingsRef.value.saveInteractive()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/interactives')
    }
    else{showConfirmPopup.value = false}
  } else {
    showConfirmPopup.value = false
    route.push('/leader/interactives')
  }
}
</script>

<template>
  <div class="interactive_editor">

    <nav_bar />
    <div class="interactive_edit_top_menu">
      <div>
        <button class="interactive_edit_backButton" @click="handleBackClick()"
          :class="{ back_to_all_settings: step === 2 }">
          {{ step === 1 ? 'Вернуться' : 'Вернуться к общим настройкам' }}
        </button>

      </div>
      <div class="interactive_edit_top_menu_header" :class="{ margin_left_question: step === 2 }">
        {{ step === 1 ? 'Общие настройки интерактива' : 'Создание вопросов' }}

      </div>

    </div>
    <div v-if="showConfirmPopup" class="interactive_edit_popup-overlay">
  <div class="interactive_edit_popup-content">
    <div class="interactive_edit_popup-text">Сохранить настройки перед выходом из редактирования викторины?</div>
    <div class="interactive_edit_popup-actions">
      <button @click="confirmBack(true)" class="interactive_edit_popup-btn save">Да</button>
      <button @click="confirmBack(false)" class="interactive_edit_popup-btn cancel">Нет</button>
    </div>
  </div>
</div>
    <general_settings  ref="generalSettingsRef" :step="step" @update-step="step = $event" :mode="mode" />
  </div>
</template>

<style>
.interactive_edit_popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(29, 29, 29, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.interactive_edit_popup-content {
  background-color: white;
  border-radius: 10px;
  padding: 32px;
  width: 600px;
  text-align: center;
  font-family: 'Lato', sans-serif;
}

.interactive_edit_popup-text {
  font-size: 24px;
  margin-bottom: 24px;
}

.interactive_edit_popup-actions {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.interactive_edit_popup-btn {
  padding: 12px 32px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.interactive_edit_popup-btn.save {
  background-color: #6AB23D;
  color: white;
}

.interactive_edit_popup-btn.cancel {
  background-color: #F0436C;
  color: white;
}
.interactive_edit_popup-btn:hover {
  opacity: 0.9;
}
* {
  padding: 0;
  margin: 0;
}

.interactive_editor {
  height: 1246px;
  ;
}

.interactive_edit_top_menu {
  width: 1360px;
  ;
  margin: 0 auto;
  display: flex;
  position: relative;
}


.interactive_edit_backButton {
  cursor: pointer;
  position: absolute;
  top: 19px;
}

.interactive_edit_backButton {
  cursor: pointer;
  margin-left: 23px;
  ;
  width: 229px;
  height: 62px;
  border-radius: 5px;
  background-color:white;
  color:#853CFF;
  border: 2px solid #853CFF;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;

}
.interactive_edit_backButton:hover{
  background-color: #853CFF;
  color: white;
  border: 1px solid #853CFF;
}
.back_to_all_settings {
  width: 280px;
  ;
  height: 62px;
  margin-left: 0px;
  ;
}

.interactive_edit_top_menu_header {
  font-family: 'Lato', sans-serif;
  font-weight: 700;
  font-size: 36px;
  ;
  vertical-align: middle;
  letter-spacing: 1px;
  margin-left: 394px;
  ;
  height: 85px;
  display: flex;
  color: #1D1D1D;
  justify-content: center;
  /* Горизонтальное выравнивание */
  align-items: center;
}

.margin_left_question {
  margin-left: 611px;
}
</style>
