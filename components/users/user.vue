<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { object, string, type InferType } from 'yup'
import { mutateMeInOrganization } from '~/composables/api/organization/useOrganizationMutation'
import { useMeInOrganization } from '~/composables/api/organization/useOrganizationQuery'

const { data: org, isLoading, refetch } = useMeInOrganization()
const userNameInput = ref('')
watch(
  () => org.value,
  (val) => {
    if (val?.name) {
      userNameInput.value = val.name
    }
  },
  { immediate: true },
)
const { mutate: saveName } = mutateMeInOrganization()
const role = computed(() => {
  if (org?.value?.role == 'admin') return 'Администратор'
  if (org?.value?.role == 'leader') return 'Ведущий'
  if (org?.value?.role as 'organizer' == 'organizer') return 'Организатор'
})

const schemaName = object({
  name: string().required('Введите Ваше имя').max(32, 'Ваше имя должно быть короче 33 символов').min(3, 'Ваше имя должно быть длинее 2 символов'),

})
type SchemaName = InferType<typeof schemaName>
const initialName = {
  name: org.value?.name,

}
const stateName = reactive({ ...initialName })
// Следим за загрузкой данных и обновляем форму
watch(
  () => org.value,
  (newOrg) => {
    if (newOrg) {
      stateName.name = newOrg.name ?? ''
    }
  },
  { immediate: true } // immediate: true запустит watch сразу при монтировании
)

const formName = useTemplateRef('formName')
async function onSubmitSettings(event: FormSubmitEvent<SchemaName>) {
  saveName(stateName.name)
}
</script>

<template>
  <layout :active_nav="'user'">
    <div :class="$style.user">
      <div :class="$style.user__header">
        Имя пользователя
      </div>
      <UForm ref="formName" :validate-on="['input']" :schema="schemaName" :state="stateName" @submit="onSubmitSettings"
        :class="$style.user__form">
        <UFormField v-slot="{ error }" :ui="{ error: $style.user__error, }" :validate-on-input-delay="0"
          :eager-validation="true" name="name">
          <div :class="$style.user__form_wrapper">

            <div :class="[error ? $style.user__field_error : $style.user__field, $style.user__field]">
              <UInput v-model="stateName.name" placeholder="Иванов Иван Сергеевич" :ui="{ base: $style.user__input }" />
            </div>
            <UButton type="submit" :class="[$style.user__submit, $style.hide_]" :disabled="!formName?.dirty">
              Сохранить
            </UButton>
          </div>

        </UFormField>
        <div :class="$style.user__info">
          <img src="/public/images/icon.svg">
          <div>
            Данное имя будет отображаться при создании <br /> интерактива и в отчетах
          </div>
        </div>
        <div :class="$style.user__data">
          <div class="user_info_part">
            Логин:&nbsp;<span>@{{ org?.username }}</span>
          </div>
          <div class="user_info_part">
            Электронная почта:&nbsp;<span>{{ org?.email }}</span>
          </div>
          <div class="user_info_part">
            Организация:&nbsp;<span>{{ org?.organization_name }}</span>
          </div>
          <div class="user_info_part">
            Роль в организации:&nbsp;<span>{{ ' ' + role! }}</span>
          </div>
        </div>

        <UButton type="submit" :class="[$style.user__submit, $style.hide]" :disabled="!formName?.dirty" id='submit'
          style="text-align: left !important;">
          Сохранить изменения
        </UButton>

      </UForm>

    </div>

  </layout>
</template>

<style module lang="scss">
* {
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  line-height: 120%;
  letter-spacing: 1%;
  vertical-align: middle;
}


.hide {
  @media (min-width:768px) {
    display: none;
  }
}

.hide_ {
  display: none;

  @media (min-width:768px) {
    display: block;
  }
}

.user {
  padding: 0 22px;
  margin-top: 10px;
  height: 232px;
  position: relative;
  display: flex; // Добавьте это
  flex-direction: column; // Добавьте это
  width: 100%;


  @media (min-width:768px) {
    width: 503px;
    height: 200px;
    position: relative;
    display: flex; // Добавьте это
    flex-direction: column; // Добавьте это
    margin: 0 auto;
    margin-top: 25px;
    padding: 0;
    width: calc(100% - 44px);
    max-width: 1056px;
  }

  &__header {
    font-size: 14px;
    color: #1D1D1D;
    margin-bottom: 5px;

    @media (min-width:768px) {
      font-size: 16px;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;



    @media (min-width:768px) {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 503px;
      margin: 0px;

    }

    &_wrapper {
      @media (min-width:768px) {
        display: flex;
        align-items: center;
        gap: 120px;
        height: 42px;
      }

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

    &_error {
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
      height: 42px;
      font-size: 16px;
      padding: 0 13px;
      width: 304px;
    }

    &:focus {
      border-color: #7D7D7D;
      outline: none;
    }



  }

  &__info {
    display: flex;
    gap: 3px;
    margin-top: 5px;

    @media (min-width:768px) {
      margin-top: 6px;
      gap: 5px;
      color: #7D7D7D;

    }

    &>img {
      width: 17px;
      height: 17px;
    }

    &>div {
      color: #7D7D7D;
      font-size: 12px;

      @media (min-width:768px) {
        font-size: 14px;
      }

      &>br {
        @media (min-width:768px) {
          display: none;
        }
      }
    }
  }

  &__data {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 14px;
    margin-top: 10px;

    @media (min-width:768px) {
      font-size: 16px;
      margin-top: 15px;
      gap: 15px;
    }

    &>div {
      display: flex;
      align-items: center;
      height: 17px;

      &>span {
        color: #853CFF;
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

  &__submit {
    height: 17px;
    border: none;
    color: #6AB23D;
    cursor: pointer;
    white-space: nowrap;
    padding: 0;
    font-size: 16px;
    margin-top: 30px;
    text-align: left !important;
    width: 168px;
    background-color: white;

    @media (min-width:768px) {
      padding: 0;
      margin: 0;
      height: 19px;
    }
  }
}

#submit {
  text-align: left !important;
}

textarea {
  resize: none;
}
</style>
