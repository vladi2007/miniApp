<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent, FormError } from '@nuxt/ui'
import show from '../../public/images/login/showPass.svg'
import hide from '../../public/images/login/hidePass.svg'
import { useUrlSearchParams } from '@vueuse/core'
import { useAuthStore } from '~/store/auth'
import { postForgotPassword } from '~/composables/api/auth/auth'
import type { Axios, AxiosError } from 'axios'
import type { ApiErrorResponse } from '~/composables/api/handleAuthError'

const auth = useAuthStore()
const schemaLogin = object({
  login: string(),
  password: string(),

})
const schemaReg = object({
  email: string()
    .email('Введите корректную почту')
    .required('Введите почту'),

  login: string()
    .min(8, 'От 8 до 12 символов')
    .max(12, 'От 8 до 12 символов')
    .matches(/^[a-zA-Z0-9]+$/, 'Только латинские буквы и цифры')
    .required('Введите логин'),

  password: string()
    .min(8, 'От 8 до 15 символов')
    .max(15, 'От 8 до 15 символов')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Пароль должен содержать спецсимвол')
    .required('Введите пароль'),
})

const schemaForgot = object({
  email: string()
    .email('Введите корректную почту')
    .required('Введите почту'),
})
type SchemaLogin = InferType<typeof schemaLogin>
type SchemaReg = InferType<typeof schemaReg>

type SchemaForgot = InferType<typeof schemaForgot>
const initialLogin = {
  login: '',
  password: '',
}

const initialReg = {
  email: '',
  login: '',
  password: '',
}

const initialForgot = {
  email: '',
}
const stateLogin = reactive({ ...initialLogin })
const stateReg = reactive({ ...initialReg })
const stateForgot = reactive({ ...initialForgot })
const formLogin = useTemplateRef('formLogin')
const formReg = useTemplateRef('formReg')
const formForgot = useTemplateRef('formForgot')
function resetAllForms() {
  Object.assign(stateLogin, initialLogin)
  Object.assign(stateReg, initialReg)
  Object.assign(stateForgot, initialForgot)

  customLoginError.value = null

  formLogin.value?.clear()
  formReg.value?.clear()
  formForgot.value?.clear()
}
async function onSubmitReg(event: FormSubmitEvent<SchemaReg>) {
  console.log(event.data)
}
async function onSubmitLogin(event: FormSubmitEvent<SchemaLogin>) {
  try {
    await auth.login({ password: event.data.password!, username: event.data.login! })
  }
  catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    const status = error.response?.status
    const code = error.response?.data?.detail?.code

    if (formLogin?.value?.getErrors().length === 0) {
      if (status == 401 && code == 'INVALID_CREDENTIALS') {
        customLoginError.value = 'Неправильный логин или пароль'
      }
      else {
        window.alert(`${err}`)
      }

    }
  }
}

const forgotPending = ref(false)
async function onSubmitForgot(event: FormSubmitEvent<SchemaForgot>) {
  forgotPending.value = true
  try {
    await postForgotPassword(event.data.email!)

  }
  catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    const code = error.response?.data?.detail?.code
    switch (code) {
      case 'EMAIL_SEND':
        window.alert('Ошибка отправки email')
        break
    }
  }
  finally {
    forgotPending.value = false
  }
}
const showPasswordLogin = ref(false)
const showPasswordReg = ref(false)

const searchParams = useUrlSearchParams('history')
const activeMode = ref<'login' | 'reg' | 'forgot'>(searchParams.mode as 'login' | 'reg' | 'forgot' || 'login')

watch(activeMode, (newMode) => {
  searchParams.mode = newMode
})
searchParams.mode = activeMode.value
const customLoginError = ref<string | null>(null)
</script>

<template>
  <div v-if="activeMode == 'login'" class="login">
    <div class="login__body">
      <div class="login__header">
        Вход
      </div>
      <UForm ref="formLogin" :ref_key="activeMode" :validate-on="['input']" :schema="schemaLogin" :state="stateLogin"
        class="login__form" @submit="onSubmitLogin">
        <UFormField v-slot="{ error }" :ui="{ error: 'login__error' }" :validate-on-input-delay="0"
          :eager-validation="true" label="" name="login">
          <div class="login__field" :class="{ 'login__field-error': error || customLoginError }">
            <UInput v-model="stateLogin.login" placeholder="Логин*" :ui="{ base: 'login__input' }" />
          </div>
        </UFormField>

        <UFormField v-slot="{ error }" :ui="{ error: 'login__error' }" :validate-on-input-delay="0"
          :eager-validation="true" label="" name="password">
          <div class="login__field" :class="{ 'login__field-error': error || customLoginError }">
            <UInput v-model="stateLogin.password" placeholder="Пароль*" :type="showPasswordLogin ? 'text' : 'password'"
              :ui="{ base: 'login__input' }" />
            <img class="login__input-show" :src="showPasswordLogin ? hide : show"
              @click="showPasswordLogin = !showPasswordLogin">
          </div>
          <div v-if="customLoginError" class="login__error hide">
            {{ customLoginError }}
          </div>
        </UFormField>
        <div class="login__forgot" @click="activeMode = 'forgot'">
          Восстановить
        </div>
        <UButton type="submit" class="login__submit" :disabled="!formLogin?.dirty">
          Войти
        </UButton>
        <button class="login__reg">
          Еще нет аккаунта?&nbsp;
          <span @click="activeMode = 'reg'; resetAllForms()">Зарегистрироваться</span>
        </button>
      </UForm>
    </div>
  </div>
  <div v-if="activeMode == 'reg'" class="login-reg">
    <div class="login__body">
      <div class="login__header">
        Регистрация
      </div>
      <UForm ref="formReg" :key="activeMode" :validate-on="['input']" :schema="schemaReg" :state="stateReg"
        class="login__form" @submit="onSubmitReg">
        <UFormField v-slot="{ error }" :validate-on-input-delay="0" :eager-validation="true" label="" name="email"
          :ui="{ error: 'login__error' }">
          <div class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.email }">
            <UInput v-model="stateReg.email" placeholder="Email*" :ui="{ base: 'login__input' }" />
          </div>
        </UFormField>
        <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label="" name="login"
          :ui="{ error: 'login__error' }">
          <div class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.login }">
            <UInput v-model="stateReg.login" placeholder="Логин*" :ui="{ base: 'login__input' }" />
          </div>
        </UFormField>

        <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label="" name="password"
          :ui="{ error: 'login__error last-error' }">
          <div class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.password }">
            <UInput v-model="stateReg.password" placeholder="Пароль*" :type="showPasswordReg ? 'text' : 'password'"
              :ui="{ base: 'login__input' }" />
            <img class="login__input-show" :src="showPasswordReg ? hide : show"
              @click="showPasswordReg = !showPasswordReg">
          </div>
        </UFormField>
        <UButton type="submit" class="login__submit">
          Зарегистрироваться
        </UButton>

        <button class="login__reg">
          Уже есть аккаунт?&nbsp;
          <span @click="activeMode = 'login';; resetAllForms()">Войти</span>
        </button>
      </UForm>
    </div>
  </div>
  <div v-if="activeMode == 'forgot'" class="login login___forgot">
    <div class="login__body ">
      <div class="login__back" @click="activeMode = 'login';; resetAllForms()">
        <svg width="11" height="19" viewBox="0 0 11 19" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.725 9.48837L10.075 16.8384C10.325 17.0884 10.446 17.38 10.438 17.7134C10.43 18.0467 10.3007 18.3384 10.05 18.5884C9.79933 18.8384 9.50767 18.9634 9.175 18.9634C8.84233 18.9634 8.55067 18.8384 8.3 18.5884L0.6 10.9134C0.4 10.7134 0.25 10.4884 0.15 10.2384C0.05 9.98837 0 9.73837 0 9.48837C0 9.23837 0.05 8.98837 0.15 8.73837C0.25 8.48837 0.4 8.26337 0.6 8.06337L8.3 0.363372C8.55 0.113372 8.846 -0.00762791 9.188 0.000372093C9.53 0.00837209 9.82567 0.137705 10.075 0.388372C10.3243 0.639039 10.4493 0.930705 10.45 1.26337C10.4507 1.59604 10.3257 1.88771 10.075 2.13837L2.725 9.48837Z"
            fill="#7D7D7D" />
        </svg>
      </div>
      <div class="login__header">
        Восстановление доступа
      </div>
      <UForm ref="formForgot" :key="activeMode" :validate-on="['input']" :schema="schemaForgot" :state="stateForgot"
        class="login__form" @submit="onSubmitForgot">
        <div class="login__info">
          Введите Ваш email, используемый для входа. <br>
          Мы вышлем письмо с инструкцией.
        </div>
        <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label="" name="email"
          :ui="{ error: 'login__error' }">
          <div class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateForgot.email }">
            <UInput v-model="stateForgot.email" placeholder="Email*" :ui="{ base: 'login__input' }" />
          </div>
        </UFormField>
        <UButton type="submit" class="login__submit forgot" :disabled="!formForgot?.dirty || forgotPending">
          Получить ссылку
        </UButton>
      </UForm>
    </div>
  </div>
</template>

<style lang="scss">
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

.last-error {
  margin-bottom: 10px;
}

.login {
  margin: 0 22px;
  margin-top: 119px;
  height: 304px;
  position: relative;
  display: flex; // Добавьте это
  flex-direction: column; // Добавьте это

  @media (min-width:768px) {
    width: 579px;
    height: 459px;
    position: relative;
    display: flex; // Добавьте это
    flex-direction: column; // Добавьте это
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(133, 60, 255, 1);
    margin: 0 auto;
    margin-top: 115px;


  }


  &___forgot {
    height: 183px;

    @media (min-width:768px) {
      height: 459px
    }

    ;
  }

  &-reg {
    margin: 0 22px;
    margin-top: 119px;
    height: 304px;
    border-radius: 14px;
    position: relative;

    @media (min-width:768px) {
      width: 579px;
      height: 481px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(133, 60, 255, 1);
      margin: 0 auto;
      margin-top: 115px;
      position: relative;
    }
  }

  &__body {

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%; // Добавьте это

    @media (min-width:768px) {
      height: 100%;
      align-items: flex-start;
      padding: 45px 45px 25px 45px;
    }

  }

  &__header {
    font-size: 20px;
    font-weight: 500;


    @media (min-width:768px) {
      font-weight: 700;
      font-size: 40px;
      line-height: 120%;
      letter-spacing: 1%;
    }
  }

  &__form {
    display: flex; // Измените с grid на flex
    flex-direction: column;
    gap: 10px;
    margin-top: 40px;
    width: 100%;

    flex: 1;



    @media (min-width:768px) {
      display: flex; // Измените с grid на flex
      flex-direction: column;
      flex: 1;
      margin: 0px;
      gap: 0px;
    }
  }

  &__field {

    position: relative;
    width: 100%;
    font-size: 14px;

    border: 1px solid #E0E0E0;
    border-radius: 8px;


    @media (min-width:768px) {
      position: relative;
      border: none;
      border-bottom: 1px solid #1D1D1D80;
      border-radius: 0;
      margin-top: 30px;
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
        border: none !important;
        border-bottom: 1px solid #F0436C !important;
        border-radius: 0px;
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


    font-size: 14px;
    outline: none;
    border: none;
    border-radius: 8px;
    padding: 0 10px;

    color: #1D1D1D;

    @media (min-width:768px) {
      font-weight: 500;
      height: 44px;
      font-size: 20px;
      width: calc(100% - 38px);
      padding: 0;
    }

    &:focus {
      border-color: #7D7D7D;
      outline: none;
    }

    &-show {
      position: absolute;
      width: 18px;
      height: 18px;
      cursor: pointer;
      right: 13px;
      top: 55%;
      transform: translateY(-50%);


      @media (min-width:768px) {
        position: absolute;
        width: 18px;
        cursor: pointer;
        right: 8px;
        height: 18px;
        bottom: 13px;
      }
    }

  }

  &__forgot {
    padding: 0;
    color: #853CFF;
    font-size: 12px;
    padding-left: 10px;
    height: 14px;

    @media (min-width:768px) {

      background-color: #FFFFFF1A;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      margin-top: 10px;
      color: #853CFF;
      text-align: left !important;
    }
  }

  &__submit {
    margin-top: auto;
    height: 44px;
    width: 100%;
    background-color: #6AB23D;
    border: 1px solid #6AB23D;
    border-radius: 8px;
    color: white;

    cursor: pointer;
    font-size: 16px;

    @media (min-width:768px) {
      margin-top: auto;
      background-color: white;
      border: 1px solid #6AB23D;
      color: #6AB23D;
      position: absolute;
      height: 42px;
      width: 489px;
      bottom: 64px;
      font-size: 20px;
    }

    &:hover {
      @media (min-width:768px) {
        background-color: #6AB23D;
        color: white;
      }

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

  &__reg {
    width: 100%;
    height: 17px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &>span {
      color: #6AB23D;
      cursor: pointer;
      border-bottom: calc((1 / 832) * 100dvh) solid transparent;

      &:hover {
        border-bottom-color: #6AB23D;
      }
    }

    @media (min-width:768px) {
      position: absolute;
      height: 24px;
      width: 489px;
      bottom: 25px;
      font-size: 20px;
    }
  }

  &__error {
    padding-left: 10px;
    color: #F0436C;
    font-weight: 500;
    font-size: 12px;



    @media (min-width:768px) {
      position: absolute;
      padding: 0;
      margin-top: 6px;
      font-size: 16px;
    }

  }

  &__info {
    display: none;

    @media (min-width:768px) {
      font-weight: 500;
      font-size: 20px;
      margin-top: 40px;
      line-height: 30px;
      letter-spacing: 1%;
    }
  }

  &__back {

    display: none;

    @media (min-width:768px) {
      position: absolute;
      display: flex;
      color: #7D7D7D;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      object-fit: cover;
      background-color: #FFFFFF;
      box-shadow: 0px 4px 13px 0px #00000040;
      cursor: pointer;
      width: 50px;
      height: 50px;
      top: -14px;
      left: -13px;
      box-sizing: border-box;

      &:hover {
        color: #853CFF;
        border: 1px solid #853CFF;
      }
    }

    &>svg path {
      fill: currentColor;
    }

    &>svg {
      width: calc(10.45 / 1280 * 100dvw);
      height: calc(18.96 / 832 * 100dvh);

      @media (min-width:768px) {
        width: 10.45px;
        height: 18.96px;
      }

    }

  }

}

.hide {
  position: relative !important;
}

.error {
  color: #F0436C;
  border-color: #F0436C;
}
</style>
