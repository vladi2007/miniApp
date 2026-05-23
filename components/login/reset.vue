<script setup lang="ts">
import { object, string, type InferType } from 'yup';
import * as yup from "yup";
import { decode } from 'jwt-js-decode'
import { postForgotPasswordConfirm } from '~/composables/api/auth/auth';
const schemaReset = object({


    password: string()
        .min(8, 'От 8 до 15 символов')
        .max(15, 'От 8 до 15 символов')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Пароль должен содержать спецсимвол')
        .required('Введите пароль'),

    secondPassword: string()
        .required('Подтвердите пароль')
        .oneOf([yup.ref('password')], 'Пароли не совпадают')


})
const initialReset = {

    password: '',
    secondPassword: '',
}
type SchemaReset = InferType<typeof schemaReset>
const stateReset = reactive({ ...initialReset })
const auth = useAuthStore()
const route = useRoute()
async function onSubmitReset(event: FormSubmitEvent<SchemaReset>) {
    try {
        await postForgotPasswordConfirm(event.data.password, route.query!.jwt! as string)
    }
    catch {

    }
    finally {
        console.log(decode(route.query.jwt! as string).payload)
        await auth.login({ password: event.data.password, username: decode(route.query.jwt! as string).payload.login })
    }
}
const showPasswordReset = ref(false)
const showSecondPasswordReset = ref(false)
import show from '../../public/images/login/showPass.svg'
import hide from '../../public/images/login/hidePass.svg'
import type { FormSubmitEvent } from '@nuxt/ui';
import { useAuthStore } from '~/store/auth';
</script>

<template>
    <div class="login-reset" :class="[$style.login, $style.login_reset]">
        <div class="login__body" :class="$style.login__body">
            <div class="login__header" :class="$style.login__header">
                Смена пароля
            </div>
            <UForm ref="formReg" :key="'reset'" :validate-on="['input']" :schema="schemaReset" :state="stateReset"
                class="login__form" @submit="onSubmitReset" :class="$style.login__form">

                <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label=""
                    name="password" :ui="{ error: $style.login__error }">
                    <div :class="[
                        $style.login__field,
                        error && $style['login__field-error'],
                        !error && stateReset.password && $style['login__field-success']
                    ]">
                        <UInput v-model="stateReset.password" placeholder="Ввод нового пароля*"
                            :ui="{ base: $style.login__input }" :type="showPasswordReset ? 'text' : 'password'" />
                        <img :class="$style.login__input_show" :src="showPasswordReset ? hide : show"
                            @click="showPasswordReset = !showPasswordReset">
                    </div>
                </UFormField>

                <UFormField v-slot="{ error }" :eager-validation="true" :validate-on-input-delay="0" label=""
                    name="secondPassword" :ui="{ error: $style.login__error }">
                    <div :class="[
                        $style.login__field,
                        error && $style['login__field-error'],
                        !error && stateReset.secondPassword && $style['login__field-success']
                    ]">
                        <UInput v-model="stateReset.secondPassword" placeholder="Подтверждение пароля*"
                            :type="showSecondPasswordReset ? 'text' : 'password'" :ui="{ base: $style.login__input }" />
                        <img :class="$style.login__input_show" :src="showSecondPasswordReset ? hide : show"
                            @click="showSecondPasswordReset = !showSecondPasswordReset">
                    </div>
                </UFormField>
                <UButton type="submit" :class="$style.login__submit">
                    Вход
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

* {
    box-sizing: border-box;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;
}

.login {

    margin: 0 22px;
    margin-top: 119px;
    height: 277px;
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

    &_reset {
        margin: 0 22px;
        margin-top: 119px;
        height: 277px;
        position: relative;
        display: flex; // Добавьте это
        flex-direction: column; // Добавьте это

        @media (min-width:768px) {
            width: 579px;
            height: 481.25px;
            margin: 0 auto;
            margin-top: 120px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            box-shadow: 0px 4px 13px 0px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(133, 60, 255, 1);
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

        &_show {
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