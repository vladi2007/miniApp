<script setup>
import Settings from '~/components/interactive_editor/settings.vue'
const settings = ref(null)
const route = useRouter()
async function confirmBack(save) {
  if (save ) {
    const success = await settings.value.handleSave()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/interactives')
    }
    else { showConfirmPopup.value = false }
  } else {
    showConfirmPopup.value = false
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
    <Settings  ref="settings" :confirmBack="handleBackClick"/>
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
@import url("/assets/css/interactive_editor/settings.scss");
@import url("/assets/css/interactive_editor/settings_media.scss");
@import url("/assets/css/interactive_editor/create_interactive.scss");


@import url("/assets/css/interactive_editor/settings_static.scss");
</style>
