<script setup>
import Settings from '~/components/interactive_editor/settings.vue'
import { onMounted, ref } from 'vue'

const settings = ref(null)
const route = useRouter()
const router = useRoute()
const header = computed(() => route.params.mode === 'edit' ? 'Сохранить изменения перед выходом?' : '')
async function confirmBack(save) {
  if (save) {
    const success = await settings.value.handleSave()
    if (success) {
      showConfirmPopup.value = false
      route.push('/leader/new_interactives')
    }
    else { showConfirmPopup.value = false }
  }
  else {
    showConfirmPopup.value = false
    route.push('/leader/new_interactives')
  }
}
const showConfirmPopup = ref(false)

const isCheckMode = ref(false)

onMounted(() => {
  // 👇 читаем то что передали в router.push state
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
  }
})
function handleBackClick() {
  if (
    router.params.mode === 'edit'
    && settings.value
    && !settings.value.isFormChanged() || isCheckMode.value === true
  ) {
    route.push('/leader/new_interactives')
    return
  }
  showConfirmPopup.value = true
}
</script>

<template>
  <div class="interactive_editor">
    <div class="intreractive_editor_header">
      <img
        id="interactive_editor_logo"
        src="/public/images/interactive_editor/logo.svg"
      >
      <div
        class="goback"
        @click="handleBackClick()"
      >
        <img
          id="interactive_editor_back"
          src="/public/images/interactive_editor/Vector.svg"
        >
        <div class="intreractive_editor_header_back_text">
          Управление интерактивами
        </div>
      </div>
    </div>
    <Settings
      ref="settings"
      :confirm-back="handleBackClick"
    />
    <div
      v-if="showConfirmPopup"
      class="interactive_edit_popup-overlay_goback"
    >
      <div
        class="interactive_edit_popup-content_goback"
        style="position: relative !important;"
        @click="showConfirmPopup=false"
      >
        <div class="interactive_delete_popup-close">
          <img src="/public/images/interactives/delete_close.svg">
        </div>
        <div
          v-if="router.params.mode === 'edit'"
          class="interactive_edit_popup-text_goback"
        >
          Сохранить изменения перед выходом?
        </div>
        <div
          v-if="router.params.mode !== 'edit'"
          class="interactive_edit_popup-text_goback"
        >
          Сохранить настройки интерактива перед<br></br> выходом из редактирования?
        </div>
        <div class="interactive_edit_popup-actions_goback">
          <button
            class="interactive_edit_popup-btn_goback cancel"
            @click="confirmBack(false)"
          >
            {{ router.params.mode === "edit" ? "Не сохранять" : "Удалить" }}
          </button>
          <button
            class="interactive_edit_popup-btn_goback save"
            @click="confirmBack(true)"
          >
            Сохранить
          </button>
          <!-- <button @click="confirmBack(false)" class="interactive_edit_popup-btn cancel">Нет</button> -->
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
