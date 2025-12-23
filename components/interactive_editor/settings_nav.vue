<script setup lang="ts">

const props = defineProps<{
    take_step: (step: string) => void,
    active_step: string,
    isFormComplete: boolean,
    validateForm: () => boolean
    confirmBack: () => void

}>()
</script>

<template>
    <div class="container">
    <div class="settings_nav">
        <div class ='settings_nav_backbutton' @click="confirmBack">
            <img src="/public/images/interactive_editor/Vector_static.svg" id="back_purple" />
         <div >
          Управление интерактивами
         </div>
            
      </div>
      
        <div class="settings_nav_main" :class="{ settings_active_nav: active_step === 'main' }"
            @click='take_step("main")'>
            Общие настройки
        </div>

        <div class="settings_nav_questions_button"
            :class="{ settings_active_nav: active_step === 'questions' && isFormComplete, settings_disabled_nav: !isFormComplete }"
            @click="validateForm() && take_step('questions')">
            Вопросы
        </div>
        <img src="/public/images/interactive_editor/lock.svg" id="lock" v-if="!props.isFormComplete" />
        <div class="settings_nav_questions_info" v-if="!isFormComplete">
            <div> Будет доступно после заполнения <br />общих настроек</div>
        </div>


    </div></div>
</template>


<style>
.settings_nav_backbutton{
    display: none;
}

</style>