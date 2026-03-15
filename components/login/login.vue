<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'
import show from '../../public/images/login/showPass.svg'
import hide from '../../public/images/login/hidePass.svg'

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
const stateLogin = reactive({
  login: '',
  password: '',
})
const stateReg = reactive({
  email: '',
  login: '',
  password: '',
})
const stateForgot = reactive({
  email: '',
})

async function onSubmitReg(event: FormSubmitEvent<SchemaReg>) {
  console.log(event.data)
}
async function onSubmitLogin(event: FormSubmitEvent<SchemaLogin>) {
  console.log(event.data)
}
async function onSubmitForgot(event: FormSubmitEvent<SchemaForgot>) {
  console.log(event.data)
}
const showPasswordLogin = ref(false)
const showPasswordReg = ref(false)
const formLogin = useTemplateRef('formLogin')
const formReg = useTemplateRef('formReg')

const activeMode = ref<'login' | 'reg' | 'forgot'>('login')
</script>

<template>
  <div
    v-if="activeMode == 'login'"
    class="login"
  >
    <div class="login__body">
      <div class="login__header">
        Вход
      </div>
      <UForm
        ref="formLogin"
        :schema="schemaLogin"
        :state="stateLogin"
        class="login__form"
        @submit="onSubmitLogin"
      >
        <UFormField
          label=""
          name="login"
        >
          <div class="login__field">
            <input
              v-model="stateLogin.login"
              class="login__input"
              placeholder="Логин*"
            >
          </div>
        </UFormField>

        <UFormField
          label=""
          name="password"
        >
          <div class="login__field">
            <input
              v-model="stateLogin.password"
              class="login__input"
              placeholder="Пароль*"
              :type="showPasswordLogin ? 'text' : 'password'"
            >
            <img
              class="login__input-show"
              :src="showPasswordLogin ? hide : show"
              @click="showPasswordLogin = !showPasswordLogin"
            >
          </div>
        </UFormField>
        <div
          class="login__forgot"
          @click="activeMode = 'forgot'"
        >
          Восстановить
        </div>
        <UButton
          type="submit"
          class="login__submit"
        >
          Войти
        </UButton>

        <button class="login__reg">
          Еще нет аккаунта?&nbsp;
          <span @click="activeMode = 'reg'">Зарегистрироваться</span>
        </button>
      </UForm>
    </div>
  </div>
  <div
    v-if="activeMode == 'reg'"
    class="login-reg"
  >
    <div class="login__body">
      <div class="login__header">
        Регистрация
      </div>
      <UForm
        ref="formReg"
        :validate-on="['input']"
        :schema="schemaReg"
        :state="stateReg"
        class="login__form"
        @submit="onSubmitReg"
      >
        <UFormField
          v-slot="{ error }"
          :validate-on-input-delay="0"
          :eager-validation="true"
          label=""
          name="email"
          :ui="{ error: 'login__error' }"
        >
          <div
            class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.email }"
          >
            <UInput
              v-model="stateReg.email"
              placeholder="Email*"
              :ui="{ base: 'login__input' }"
            />
          </div>
        </UFormField>
        <UFormField
          v-slot="{ error }"
          :eager-validation="true"
          :validate-on-input-delay="0"
          label=""
          name="login"
          :ui="{ error: 'login__error' }"
        >
          <div
            class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.login }"
          >
            <UInput
              v-model="stateReg.login"
              placeholder="Логин*"
              :ui="{ base: 'login__input' }"
            />
          </div>
        </UFormField>

        <UFormField
          v-slot="{ error }"
          :eager-validation="true"
          :validate-on-input-delay="0"
          label=""
          name="password"
          :ui="{ error: 'login__error' }"
        >
          <div
            class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateReg.password }"
          >
            <UInput
              v-model="stateReg.password"
              placeholder="Пароль*"
              :type="showPasswordReg ? 'text' : 'password'"
              :ui="{ base: 'login__input' }"
            />
            <img
              class="login__input-show"
              :src="showPasswordReg ? hide : show"
              @click="showPasswordReg = !showPasswordReg"
            >
          </div>
        </UFormField>
        <UButton
          type="submit"
          class="login__submit"
        >
          Зарегистрироваться
        </UButton>

        <button class="login__reg">
          Уже есть аккаунт?&nbsp;
          <span @click="activeMode = 'login'">Войти</span>
        </button>
      </UForm>
    </div>
  </div>
  <div
    v-if="activeMode == 'forgot'"
    class="login"
  >
    <div class="login__body">
      <div
        class="login__back"
        @click="activeMode = 'login'"
      >
        <svg
          width="11"
          height="19"
          viewBox="0 0 11 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.725 9.48837L10.075 16.8384C10.325 17.0884 10.446 17.38 10.438 17.7134C10.43 18.0467 10.3007 18.3384 10.05 18.5884C9.79933 18.8384 9.50767 18.9634 9.175 18.9634C8.84233 18.9634 8.55067 18.8384 8.3 18.5884L0.6 10.9134C0.4 10.7134 0.25 10.4884 0.15 10.2384C0.05 9.98837 0 9.73837 0 9.48837C0 9.23837 0.05 8.98837 0.15 8.73837C0.25 8.48837 0.4 8.26337 0.6 8.06337L8.3 0.363372C8.55 0.113372 8.846 -0.00762791 9.188 0.000372093C9.53 0.00837209 9.82567 0.137705 10.075 0.388372C10.3243 0.639039 10.4493 0.930705 10.45 1.26337C10.4507 1.59604 10.3257 1.88771 10.075 2.13837L2.725 9.48837Z"
            fill="#7D7D7D"
          />
        </svg>
      </div>
      <div class="login__header">
        Восстановление доступа
      </div>
      <UForm
        ref="formForgot"
        :validate-on="['input']"
        :schema="schemaReg"
        :state="stateForgot"
        class="login__form"
        @submit="onSubmitForgot"
      >
        <div class="login__info">
          Введите Ваш email, используемый для входа. <br>
          Мы вышлем письмо с инструкцией.
        </div>
        <UFormField
          v-slot="{ error }"
          :eager-validation="true"
          :validate-on-input-delay="0"
          label=""
          name="email"
          :ui="{ error: 'login__error' }"
        >
          <div
            class="login__field"
            :class="{ 'login__field-error': error, 'login__field-success': !error && stateForgot.email }"
          >
            <UInput
              v-model="stateForgot.email"
              placeholder="Email*"
              :ui="{ base: 'login__input' }"
            />
          </div>
        </UFormField>

        <UButton
          type="submit"
          class="login__submit forgot"
        >
          Получить код
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

.login {

    width: calc((579/1280) * 100dvw);
    height: calc((459 / 832) * 100dvh);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(133, 60, 255, 1);
    margin: 0 auto;
    margin-top: calc((120 / 832) * 100dvh);
    position: relative;

    @media (min-width:1918px) and (min-height:1078px) {
        width: 579px;
        height: 459px;
        margin-top: 120px;
    }

    &-reg {
        width: calc((579/1280) * 100dvw);
        height: calc((481.25 / 832) * 100dvh);
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 14px;
        box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(133, 60, 255, 1);
        margin: 0 auto;
        margin-top: calc((120 / 832) * 100dvh);
        position: relative;

        @media (min-width:1918px) and (min-height:1078px) {
            width: 579px;
            height: 481.25px;
            margin-top: 120px;
        }
    }

    &__body {

        padding: calc((45 / 832) * 100dvh) calc((45/1280) * 100dvw) calc((25 / 832) * 100dvh) calc((45/1280) * 100dvw);

        @media (min-width:1918px) and (min-height:1078px) {
            padding: 45px 45px 25px 45px;
        }
    }

    &__header {

        font-family: 'Lato', sans-serif;
        font-weight: 700;
        font-size: clamp(10px, calc(40 / 1280 * 100dvw), 80px);
        line-height: 120%;
        letter-spacing: 1%;
        vertical-align: middle;

        @media (min-width:1918px) and (min-height:1078px) {
            font-size: 40px;
            line-height: 120%;
            letter-spacing: 1%;
        }
    }

    &__form {
        display: grid;

    }

    &__field {

        position: relative;
        margin-top: calc((30 / 832) * 100dvh);

        width: 100%;
        border-bottom: 1px solid #1D1D1D80;

        @media (min-width:1918px) and (min-height:1078px) {
            margin-top: 30px;
        }

        &-error {

            border-color: #F0436C !important;

            input {
                color: #F0436C !important;
            }

        }

        &-success {

            border-color: #6AB23D !important;

            input {
                color: #6AB23D;
            }

        }
    }

    &__input {
        height: calc((44 / 832) * 100dvh);
        width: calc(100% - calc(38 / 1280 * 100dvw));
        border: none;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        outline: none;
        background-color: none;
        font-family: 'Lato', sans-serif;
        line-height: 120%;
        letter-spacing: 1%;

        @media (min-width:1918px) and (min-height:1078px) {
            height: 44px;
            font-size: 20px;
            width: calc(100% - 38px);
        }

        &:focus {
            border-color: #7D7D7D;
            outline: none;
        }

        &-show {
            position: absolute;
            width: calc((18/1280) * 100dvw);
            height: calc((18 / 832) * 100dvh);
            bottom: calc((13 / 832) * 100dvh);
            cursor: pointer;
            right: 0;

            @media (min-width:1918px) and (min-height:1078px) {
                width: 18px;
                height: 18px;
                bottom: 13px;
            }
        }

    }

    &__forgot {
        margin-top: calc((6 / 832) * 100dvh);
        background-color: #FFFFFF1A;
        border: none;
        cursor: pointer;
        font-family: 'Lato', sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        line-height: 120%;
        letter-spacing: 1%;

        color: #853CFF;
        text-align: left !important;

        @media (min-width:1918px) and (min-height:1078px) {
            margin-top: 6px;
            font-size: 16px;
            text-align: left !important;
        }
    }

    &__submit {
        height: calc((42 / 832) * 100dvh);
        width: calc(489 / 1280 * 100dvw);
        background-color: #FFFFFF1A;
        border: 1px solid #6AB23D;
        border-radius: 8px;
        color: #6AB23D;
        position: absolute;
        bottom: calc((64 / 832) * 100dvh);
        cursor: pointer;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);

        @media (min-width:1918px) and (min-height:1078px) {
            height: 42px;
            width: 489px;
            bottom: 64px;
            font-size: 20px;
        }

        &:hover {
            background-color: #6AB23D;
            color: white;
        }

        &.forgot {
            color: #853CFF;
            border-color: #853CFF;

            &:hover {
                color: white;
                background-color: #853CFF;
            }
        }
    }

    &__reg {
        position: absolute;
        width: calc(489 / 1280 * 100dvw);
        height: calc((24 / 832) * 100dvh);
        bottom: calc((25 / 832) * 100dvh);
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        background-color: #FFFFFF1A;
        font-weight: 500;
        border: none;

        &>span {
            color: #6AB23D;
            cursor: pointer;
            border-bottom: calc((1 / 832) * 100dvh) solid transparent;

            &:hover {
                border-bottom-color: #6AB23D;
            }
        }

        @media (min-width:1918px) and (min-height:1078px) {
            height: 24px;
            width: 489px;
            bottom: 25px;
            font-size: 20px;
        }
    }

    &__error {
        position: absolute;
        margin-top: calc((6 / 832) * 100dvh);
        color: #F0436C;
        font-family: 'Lato', sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        line-height: 110.00000000000001%;
        letter-spacing: 0%;
        vertical-align: middle;

        @media (min-width:1918px) and (min-height:1078px) {
            margin-top: 6px;
            font-size: 16px;
        }

    }

    &__info {
        font-family: 'Lato', sans-serif;
        font-weight: 500;
        font-style: Medium;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        line-height: calc((30 / 832) * 100dvh);
        margin-top: calc((30 / 832) * 100dvh);
        letter-spacing: 1%;
        vertical-align: middle;
        color: #7D7D7D;

        @media (min-width:1918px) and (min-height:1078px) {
            font-size: 20px;
            margin-top: 40px;
            line-height: 30px;
            letter-spacing: 1%;
        }
    }

    &__back {
        width: calc(50 / 1280 * 100dvw);
        height: calc(50 / 832 * 100dvh);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        background-color: #FFFFFF;
        box-shadow: 0px 4px 13px 0px #00000040;
        cursor: pointer;
        position: absolute;
        top: calc(-14 / 832 * 100dvh);
        left: calc(-13 / 1280 * 100dvw);
        box-sizing: border-box;
        color: #7D7D7D;

        &:hover {
            color: #853CFF;
            border: 1px solid #853CFF;
        }

        @media (min-width:1918px) and (min-height:1078px) {
            width: 50px;
            height: 50px;
            top: -14px;
            left: -13px;
        }

        &>svg path {
            fill: currentColor;
        }

        &>svg {
            width: calc(10.45 / 1280 * 100dvw);
            height: calc(18.96 / 832 * 100dvh);

            @media (min-width:1918px) and (min-height:1078px) {
                width: 10.45px;
                height: 18.96px;
            }

        }

    }

}

.error {
    color: #F0436C;
    border-color: #F0436C;
}
</style>
