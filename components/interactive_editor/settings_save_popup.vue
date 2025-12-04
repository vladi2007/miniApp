<template>
    <div v-if="showSavePopup" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <div class="settings_popup-text">Вы уверены, что хотите сохранить интерактив?</div>
                <div class="settings_popup-text_">Данный интерактив можно будет найти в общем списке. 
<br></br>Вопросы и данные интерактива будут сохранены. </div>
                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn cancel" @click="emit('closeSave')">Отменить</button>
                    <button class="settings_popup-btn confirm" @click="handleSave">Сохранить</button>
                    
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