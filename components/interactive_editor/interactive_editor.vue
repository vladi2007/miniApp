<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CountdownData } from '~/types/stageData'
import nav_bar from '~/components/main_menu/nav_bar.vue'
import general_settings from '~/components/interactive_editor/general_settings.vue'
const route = useRouter()

const step = ref(1)

function handleBackClick() {
  if (step.value === 1) {
    route.back()
  } else {
    step.value = 1
  }
}
const router = useRoute()

const mode = computed(() => router.params.mode as string )
const id = computed(() => router.params.id as string)
console.log(mode.value)
</script>

<template>
  <div>

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
  </div>
  <general_settings :step="step" @update-step="step = $event" :mode ="mode"/>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}

.interactive_edit_top_menu {
  width: 1360px;
  ;
  margin: 0 auto;
  display: flex;
  position: relative;
}


.interactive_edit_backButton {cursor: pointer;
  position: absolute;
  top: 19px;
}

.interactive_edit_backButton {cursor: pointer;
  margin-left: 23px;
  ;
  width: 229px;
  height: 62px;
  border-radius: 5px;
  background-color: #853CFF;
  color: white;
  border: 1px solid #853CFF;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  font-size: 24px;

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
