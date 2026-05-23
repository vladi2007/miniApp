<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isCheckMode = ref(false)

onMounted(() => {
  // 👇 читаем то что передали в router.push state
  if (history.state?.is_checkSettings === true) {
    isCheckMode.value = true
  }
})
const props = defineProps<{
  active_step: string
  form: any
  errors: any
  isFormComplete: boolean
  take_step: (step: string) => void
  validateForm: () => boolean
}>()
</script>

<template>
  <div :class="$style.main" v-if="active_step === 'main'">
    <div :class="$style.main__column">
      <div>
        <label>Название интерактива*<textarea v-model="form.title" placeholder="Название" maxlength="40"
            :class="{ 'field-error': errors.title, 'done': !errors.title && form.title?.trim() }"
            :disabled="isCheckMode" /></label>
      </div>

      <div>
        <label>Описание интерактива*<textarea id="description_input" v-model="form.description" placeholder="Описание"
            maxlength="115"
            :class="{ 'field-error': errors.description, 'done': !errors.description && form.description?.trim() }"
            :disabled="isCheckMode" /></label>
      </div>
      <div>
        <label>Место проведения интерактива*<textarea v-model="form.location" placeholder="ИРИТ-РТФ" maxlength="40"
            :class="{ 'field-error': errors.location, 'done': !errors.location && form.location?.trim() }"
            :disabled="isCheckMode" /></label>
      </div>
      <div>
        <label>Целевая аудитория участников*<textarea v-model="form.target_audience" placeholder="Абитуриенты"
            maxlength="40"
            :class="{ 'field-error': errors.target_audience, 'done': !errors.target_audience && form.target_audience?.trim() }"
            :disabled="isCheckMode" /></label>
      </div>

    </div>

    <div :class="$style.main__column">
      <div>
        <label>Время ответа на вопрос (сек.)*<textarea v-model.number="form.answer_duration" type="number" maxlength="2"
            placeholder="10"
            :class="{ 'field-error': errors.answer_duration, 'done': !errors.answer_duration && form.answer_duration > 0 }"
            :disabled="isCheckMode" /></label>
      </div>
      <div>
        <label>Время на показ ответа (сек.)*<textarea v-model.number="form.discussion_duration" type="number"
            placeholder="5" maxlength="2"
            :class="{ 'field-error': errors.discussion_duration, 'done': !errors.discussion_duration && form.discussion_duration > 0 }"
            :disabled="isCheckMode" /></label>
      </div>
      <div>
        <label>Обратный отсчет перед стартом (сек.)*<textarea v-model.number="form.countdown_duration" type="number"
            placeholder="5" maxlength="2"
            :class="{ 'field-error': errors.countdown_duration, 'done': !errors.countdown_duration && form.countdown_duration > 0 }"
            :disabled="isCheckMode" /></label>
      </div>
      <div :class="$style.main__next" @click="validateForm() && take_step('questions')">
        <div>Далее</div>
        <img id="goto" src="/public/images/interactive_editor/purple.svg">
      </div>
    </div>


  </div>

</template>

<style>
.done {
  border: 1px solid #6AB23D !important;
}

.field-error {
  border: 1px solid #F0436C !important;
}

#description_input {
  height: 54px;
}

@media (min-width:1056px) {
  #description_input {
    height: 97px;
  }

  .done {
    border: 1.5px solid #6AB23D !important;
  }

  .field-error {
    border: 1.5px solid #F0436C !important;
  }
}
</style>

<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
  box-sizing: border-box;
}

.main {

  margin: 0 22px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;

  @media (min-width:1056px) {
    margin: 0;
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 483px));
    gap: 57px;
    font-size: 16px;
    margin-left: 73px;
    width: calc(100% - 146px);
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width:1056px) {
      max-width: 483px;
    }

    >div>label {
      display: flex;
      flex-direction: column;
      gap: 5px;

      @media (min-width:1056px) {
        gap: 10px;
        line-height: 18px;
      }

      &>textarea {
        width: 100%;
        height: 37px;
        background-color: white;
        border: 1px solid #A9A9A9;
        border-radius: 8px;
        padding: 10px;
        overflow: hidden;

        @media (min-width:1056px) {
          padding: 12px;
          height: 42px;
          font-size: 16px;
        }

        &::placeholder {
          font-size: 14px;

          @media (min-width:1056px) {
            font-size: 16px;
          }
        }
      }
    }

    &:nth-of-type(2) {
      >div>label>textarea {
        width: 97px;

        @media (min-width:1056px) {
          width: 100%;
        }
      }
    }
  }

  &__next {
    display: none;

    @media (min-width:1056px) {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #853CFF;
      margin-left: auto;
      margin-top: 319px;
    }

    &>img {
      @media (min-width:1056px) {
        width: 10px;
        height: 18px;
      }
    }
  }
}
</style>
