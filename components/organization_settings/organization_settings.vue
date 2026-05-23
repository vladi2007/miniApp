<script setup lang="ts">
import { mutateOrganizationDescription } from '~/composables/api/organization/useOrganizationMutation'
import { useAuthStore } from '~/store/auth'
import { useOrganizationDescription } from '~/composables/api/organization/useOrganizationQuery'
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'

const auth = useAuthStore()
const userRole = auth.$state.role
const canEdit = computed(() => userRole === 'organizer')
const { data: org, isLoading, refetch } = useOrganizationDescription()


const { mutate: saveOrg } = mutateOrganizationDescription()




const schemaSettings = object({
  name: string().required('Введите название вашей организации').max(32, 'Название вашей организации должно быть короче 33 символов').min(2, 'Название вашей организации должно быть длинее 2 символов'),
  description: string(),

})
type SchemaSettings = InferType<typeof schemaSettings>
const initialSettings = {
  name: org.value?.organization_name,
  description: org.value?.organization_description,
}
const stateSettings = reactive({ ...initialSettings })
// Следим за загрузкой данных и обновляем форму
watch(
  () => org.value,
  (newOrg) => {
    if (newOrg) {
      stateSettings.name = newOrg.organization_name ?? ''
      stateSettings.description = newOrg.organization_description ?? ''
    }
  },
  { immediate: true } // immediate: true запустит watch сразу при монтировании
)

const formSettings = useTemplateRef('formSettings')
async function onSubmitSettings(event: FormSubmitEvent<SchemaSettings>) {
  saveOrg({ organization_description: stateSettings.description!, organization_name: stateSettings.name! })
}
</script>

<template>
  <layout :active_nav="'organization_settings'">
    <div class="settings">
      <div class="settings__body">
        <UForm ref="formSettings" :validate-on="['input']" :schema="schemaSettings" :state="stateSettings"
          @submit="onSubmitSettings" class="settings__form">
          <UFormField v-slot="{ error }" :ui="{ error: 'settings__error', }" :validate-on-input-delay="0"
            :eager-validation="true" name="name">
            <div class="form-field-wrapper">
              <div>
                Название организации:
              </div>
              <div class="settings__field" :class="{ 'settings__field-error': error }">
                <UInput v-model="stateSettings.name" placeholder="Название" :ui="{ base: 'settings__input' }"
                  :disabled="!canEdit" />
              </div>
            </div>

          </UFormField>

          <UFormField v-slot="{ error }" :ui="{ error: 'settings__error', }" :validate-on-input-delay="0"
            :eager-validation="true" name="description">
            <div class="form-field-wrapper">
              <div>
                Описание организации:
              </div>
              <div class="settings__field" :class="{ 'settings__field-error': error }">
                <UInput v-model="stateSettings.description" placeholder="Описание"
                  :ui="{ base: 'settings__input custom-height' }" :disabled="!canEdit" />

              </div>
            </div>


          </UFormField>

          <UButton type="submit" class="settings__submit" :disabled="!formSettings?.dirty || !canEdit" v-if="canEdit">
            Сохранить изменения
          </UButton>

        </UForm>
      </div>
    </div>
  </layout>
</template>

<style lang="scss">
.custom-height {
  height: 54px !important;
}

/* убрать стандартный глазок в Edge / IE */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

/* иногда появляется в Chromium-based */
input[type="password"]::-webkit-credentials-auto-fill-button {
  display: none !important;
  visibility: hidden;
  pointer-events: none;
}

* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}

.settings {
  padding: 0 22px;
  margin-top: 10px;
  height: 172px;
  position: relative;
  display: flex; // Добавьте это
  flex-direction: column; // Добавьте это
  width: 100%;

  @media (min-width:768px) {
    width: 402px;
    height: 189px;
    position: relative;
    display: flex; // Добавьте это
    flex-direction: column; // Добавьте это
    margin: 0 auto;
    margin-top: 25px;
    padding: 0;
  }

  &__body {

    width: 100%;
    display: flex;
    flex-direction: column;

    height: 100%; // Добавьте это

    @media (min-width:768px) {
      height: 100%;
      width: 378px;
      display: flex;
      flex-direction: column;
    }

  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;

    flex: 1;



    @media (min-width:768px) {
      display: flex;
      flex-direction: column;
      flex: 1;
      margin: 0px;
      gap: 10px;

    }

    .form-field-wrapper {
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;

      @media (min-width:768px) {
        font-size: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;

      }
    }

    :deep(.u-form-field) {
      display: flex;
      flex-direction: column;
      gap: 8px; // Здесь задаете нужный промежуток между label и полем
    }
  }

  &__field {

    position: relative;
    width: 100%;
    font-size: 14px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;


    @media (min-width:768px) {
      font-size: 16px;
      position: relative;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
    }

    &>input {
      transition: none !important;
      /* убираем все анимации при ошибках */
      background-color: transparent !important;
      /* если фон тоже мерцает */
    }

    &-error {
      border: 1px solid #F0436C !important;
      border-radius: 8px;



      @media (min-width:768px) {

        border-bottom: 1px solid #F0436C !important;
        border-radius: 8px;
      }

      input {
        color: #F0436C !important;


        @media (min-width:768px) {
          color: #F0436C !important;
        }
      }

    }

    &-success {
      @media (min-width:768px) {
        border-color: #6AB23D !important;
      }

      input {


        @media (min-width:768px) {
          color: #6AB23D;
        }
      }

    }
  }

  &__input {
    position: relative;
    height: 37px;
    width: 100%;
    padding: 0 10px;

    font-size: 14px;
    outline: none;
    border: none;
    border-radius: 8px;


    color: #1D1D1D;

    @media (min-width:768px) {
      font-weight: 500;
      height: 44px;
      font-size: 16px;
      padding: 0 13px;
    }

    &:focus {
      border-color: #7D7D7D;
      outline: none;
    }



  }

  &__submit {

    height: 17px;
    padding: 0;
    width: 100%;
    background-color: white;
    border: none;
    color: #6AB23D;
    width: auto; // 👈 Изменить с 100% на auto
    display: block; // 👈 Добавить
    margin-left: auto;
    cursor: pointer;
    font-size: 16px;

    @media (min-width:768px) {

      background-color: white;
      border: none;
      color: #6AB23D;
      color: #6AB23D;
      height: 19px;
      width: 100%;
      font-size: 16px;
      padding: 0;
      width: auto; // 👈 Изменить с 100% на auto
      display: block; // 👈 Добавить
      margin-left: auto;
      cursor: pointer;
    }

    &:hover {
      @media (min-width:768px) {}

    }

    &.forgot {
      color: white;
      border-color: #853CFF;
      background-color: #853CFF;

      @media (min-width:768px) {
        color: #853CFF;
        background-color: white;
        border-color: #853CFF;
      }

      &:hover {

        @media (min-width:768px) {
          color: #853CFF;
          border-color: #853CFF;
        }
      }
    }
  }

  &__error {
    padding-left: 10px;
    color: #F0436C;
    font-weight: 500;
    font-size: 14px;



    @media (min-width:768px) {
      padding: 0;
      margin-top: 6px;
      font-size: 16px;
    }

  }
}
</style>
