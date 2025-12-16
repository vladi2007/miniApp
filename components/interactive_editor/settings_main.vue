<script setup lang="ts">

const props = defineProps<{
    active_step:string,
    form: any,
    errors:any,
    isFormComplete: boolean,
    take_step: (step: string) => void,
    validateForm: () => boolean
}>()
</script>

<template>
<div class="settings_main" v-if="active_step === 'main'">
            <div class="settings_main_first">
                <div class="settings_input"><label>Название интерактива*<textarea v-model="form.title"
                            placeholder="Название" maxlength="40" :class="{ 'field-error': errors.title,   'done': !errors.title && form.title?.trim() }" /></label>
                </div>

                <div class="settings_input"> <label>Описание интерактива*<textarea v-model="form.description"
                            id="description_input" placeholder="Описание" maxlength="115"
                            :class="{ 'field-error': errors.description, 'done': !errors.description && form.description?.trim()}" /></label></div>
                <div class="settings_input"> <label>Место проведения интерактива*<textarea v-model="form.location"
                            placeholder="ИРИТ-РТФ" maxlength="40" :class="{ 'field-error': errors.location,  'done': !errors.location && form.location?.trim() }" /></label>
                </div>
                <div class="settings_input"> <label>Целевая аудитория участников*<textarea
                            v-model="form.target_audience" placeholder="Абитуриенты" maxlength="40"
                            :class="{ 'field-error': errors.target_audience,  'done': !errors.target_audience && form.target_audience?.trim() }" /></label></div>
                <div class="settings_input"> <label>ФИО ведущего*<textarea v-model="form.responsible_full_name"
                            placeholder="Сергеев Сергей Сергеевич" maxlength="40"
                            :class="{ 'field-error': errors.responsible_full_name, 'done': !errors.responsible_full_name && form.responsible_full_name?.trim() }" /></label></div>
            </div>

            <div class="settings_main_second">
                <div class="settings_input"> <label>Время ответа на вопрос (сек.)*<textarea type="number"
                            v-model.number="form.answer_duration" maxlength="2" placeholder="10"
                            :class="{ 'field-error': errors.answer_duration, 'done': !errors.answer_duration && form.answer_duration > 0 }" /></label></div>
                <div class="settings_input"> <label>Время на показ ответа (сек.)*<textarea type="number" placeholder="5"
                            v-model.number="form.discussion_duration" maxlength="2"
                            :class="{ 'field-error': errors.discussion_duration, 'done': !errors.discussion_duration && form.discussion_duration > 0 }" /></label></div>
                <div class="settings_input"> <label>Обратный отсчет перед стартом (сек.)*<textarea type="number"
                            placeholder="5" v-model.number="form.countdown_duration" maxlength="2"
                            :class="{ 'field-error': errors.countdown_duration ,  'done': !errors.countdown_duration && form.countdown_duration > 0}" /></label></div>
            </div>

            <div class="settings_go_to_questions" :class="{ disabled: !isFormComplete }"
                @click="validateForm() && take_step('questions')">
                <span class="settings_go_to_questions_text">Далее</span>
                <img src="/public/images/interactive_editor/purple.svg" id="goto" />
            </div>
        </div>
</template>

<style>
.done{
    border:1.5px solid #6AB23D !important;
}
</style>