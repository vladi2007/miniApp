<script setup lang="ts">
import { object, string, type InferType } from 'yup';

const schemaReg = object({


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
const initialReg = {

    login: '',
    password: '',
}
type SchemaReg = InferType<typeof schemaReg>
const stateReg = reactive({ ...initialReg })
async function onSubmitReg(event: FormSubmitEvent<SchemaReg>) {
    console.log(event.data)
}
const showPasswordReg = ref(false)
import show from '../../public/images/login/showPass.svg'
import hide from '../../public/images/login/hidePass.svg'
import type { FormSubmitEvent } from '@nuxt/ui';
</script>

<template>
    <div class="login-reg" :class="[$style.login, $style.login_reg]">
        <div class="login__body" :class="$style.login__body">
            <div class="login__header" :class="$style.login__header">
                Регистрация
            </div>
            <UForm ref="formReg" :key="'reg'" :validate-on="['input']" :schema="schemaReg" :state="stateReg"
                class="login__form" @submit="onSubmitReg" :class="$style.login__form">

                <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label=""
                    name="login" :ui="{ error: $style.login__error }">
                    <div :class="[
                        $style.login__field,
                        error && $style['login__field-error'],
                        !error && stateReg.login && $style['login__field-success']
                    ]">
                        <UInput v-model="stateReg.login" placeholder="Введите логин*"
                            :ui="{ base: $style.login__input }" />
                    </div>
                </UFormField>

                <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label=""
                    name="password" :ui="{ error: $style.login__error }">
                    <div :class="[
                        $style.login__field,
                        error && $style['login__field-error'],
                        !error && stateReg.password && $style['login__field-success']
                    ]">
                        <UInput v-model="stateReg.password" placeholder="Введите пароль*"
                            :type="showPasswordReg ? 'text' : 'password'" :ui="{ base: $style.login__input }" />
                        <img :class="$style.login__input_show" :src="showPasswordReg ? hide : show"
                            @click="showPasswordReg = !showPasswordReg">
                    </div>
                </UFormField>
                <UButton type="submit" :class="$style.login__submit">
                    Войти
                </UButton>


            </UForm>
        </div>
    </div>
</template>

<style module lang="scss">
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

    &_reg {
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
        &>input {
            transition: none !important;
            /* убираем все анимации при ошибках */
            background-color: transparent !important;
            /* если фон тоже мерцает */
        }

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
        background-color: #FFFFFF1A;
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

        &_show {
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

.hide {
    position: relative !important;
}

.error {
    color: #F0436C;
    border-color: #F0436C;
}
</style>