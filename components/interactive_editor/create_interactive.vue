<script setup>
import Settings from '~/components/interactive_editor/settings.vue'
const settings = ref(null)
const route = useRouter()
const FORM_STORAGE_KEY = 'interactive_form_draft'
const CURRENT_INDEX_KEY = 'interactive_current_index'
const STEP_KEY = 'interactive_editor_step'
async function confirmBack(save) {
  if (save ) {
    const success = await settings.value.handleSave()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/interactives')
      clearDeviceStorage(FORM_STORAGE_KEY)
    clearDeviceStorage(CURRENT_INDEX_KEY)
    clearDeviceStorage(STEP_KEY)
    }
    else { showConfirmPopup.value = false }
  } else {
    showConfirmPopup.value = false
    clearDeviceStorage(FORM_STORAGE_KEY)
    clearDeviceStorage(CURRENT_INDEX_KEY)
    clearDeviceStorage(STEP_KEY)


    route.push('/leader/interactives')
  }
}
const showConfirmPopup = ref(false)
function handleBackClick() {
  showConfirmPopup.value = true
}
</script>

<template>
  <div class="interactive_editor">
    <div class="intreractive_editor_header">
      <img src="/public/images/interactive_editor/logo.svg" id="interactive_editor_logo" />
      <div @click="handleBackClick()">
        <div class="intreractive_editor_header_back_text">
        Управление интерактивами
        </div>
      <img src="/public/images/interactive_editor/Vector.svg" id="interactive_editor_back" />
      </div>
      
    </div>
    <Settings  ref="settings"/>
    <div v-if="showConfirmPopup" class="interactive_edit_popup-overlay">
            <div class="interactive_edit_popup-content">
                <div class="interactive_edit_popup-text">Сохранить настройки перед выходом из редактирования викторины?
                </div>
                <div class="interactive_edit_popup-actions">
                    <button @click="confirmBack(true)" class="interactive_edit_popup-btn save">Да</button>
                    <button @click="confirmBack(false)" class="interactive_edit_popup-btn cancel">Нет</button>
                </div>
            </div>
        </div>
  </div>
</template>

<style>

@import url("/assets/css/interactive_editor/create_interactive.scss");
</style>
