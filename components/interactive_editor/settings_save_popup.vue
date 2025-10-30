<template>
    <div v-if="showSavePopup" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <div class="settings_popup-text">Сохранить интерактив и перейти к списку всех интерактивов?</div>
                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn confirm" @click="handleSave">Да</button>
                    <button class="settings_popup-btn cancel" @click="emit('closeSave')">Нет</button>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:score', 'updateCurrentQuestionIndex', 'closeSave'])
const props = defineProps<{
    showSavePopup: boolean,
    handleSave: () => void


}>()
</script>