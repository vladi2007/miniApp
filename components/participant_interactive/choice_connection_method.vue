<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { object, string, type InferType } from 'yup';

const choiceEmail = ref(true)
const schemaCon = object({
    email: string()
        .required('Введите почту')
        .email('Введите корректную почту')


})
type SchemaCon = InferType<typeof schemaCon>
const initialCon = {
    email: ''
}
const stateCon = reactive({ ...initialCon })
const formCon = useTemplateRef('formCon')
const isSended = ref(false)
async function onSubmitCon(event: FormSubmitEvent<SchemaCon>) {
    isSended.value = true
}
</script>

<template>
    <div :class="$style.connection">
        <div :class="$style.connection__header">
            <div :class="$style.connection__goback" v-if="choiceEmail" @click="choiceEmail = false">
                <img src="/public/images/moderation/goback.svg">
            </div>
            <img src="/public/images/logo.svg" :class="$style.connection__logo" />

        </div>
        <div :class="$style.formInfo" v-if="choiceEmail">
            <span :class="$style.formInfo__header">
                Введите адрес электронной почты
            </span>

        </div>
        <UForm ref="formCon" v-if="choiceEmail" :class="$style.connection__form" :validate-on="['input']"
            :state="stateCon" :schema="schemaCon" @submit="onSubmitCon">
            <UFormField v-slot="{ error }" name="email" :eager-validation="true" :validate-on-input-delay="0" label=""
                :ui="{ error: $style.connection__form_error }">

                <div :class="$style.connection__input_wrapper">
                    <UInput v-model="stateCon.email" :ui="{
                        base: error
                            ? [$style.connection__input, $style.connection__form_errorInput]
                            : $style.connection__input
                    }" placeholder="E-mail">

                    </UInput>
                </div>
            </UFormField>
            <UButton :class="$style.connection__form_submit" type="submit" :disabled="isSended">
                Далее
            </UButton>
        </UForm>
        <div :class="$style.formInfo" v-if="!choiceEmail">
            <span :class="$style.formInfo__header">
                Выберите способ подключения<br />к интерактиву
            </span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0.305919 13.6918C0.110039 13.4945 0 13.2268 0 12.9477C0 12.6686 0.110039 12.401 0.305919 12.2036L5.47795 6.99365L0.305919 1.78371C0.115591 1.5852 0.0102749 1.31933 0.0126553 1.04337C0.0150361 0.767401 0.124922 0.503418 0.318647 0.308273C0.512371 0.113129 0.774434 0.00243855 1.04839 4.00543e-05C1.32235 -0.00235844 1.58628 0.103728 1.78334 0.295452L7.69408 6.24952C7.88996 6.44689 8 6.71456 8 6.99365C8 7.27273 7.88996 7.5404 7.69408 7.73777L1.78334 13.6918C1.5874 13.8892 1.32169 14 1.04463 14C0.767572 14 0.501858 13.8892 0.305919 13.6918Z" />
            </svg>

        </div>
        <div :class="$style.methods" v-if="!choiceEmail">
            <div :class="$style.methods__vk">
                <img src="/public/images/connection/vk.svg">
                <span>
                    Войти через VK ID
                </span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.305919 13.6918C0.110039 13.4945 0 13.2268 0 12.9477C0 12.6686 0.110039 12.401 0.305919 12.2036L5.47795 6.99365L0.305919 1.78371C0.115591 1.5852 0.0102749 1.31933 0.0126553 1.04337C0.0150361 0.767401 0.124922 0.503418 0.318647 0.308273C0.512371 0.113129 0.774434 0.00243855 1.04839 4.00543e-05C1.32235 -0.00235844 1.58628 0.103728 1.78334 0.295452L7.69408 6.24952C7.88996 6.44689 8 6.71456 8 6.99365C8 7.27273 7.88996 7.5404 7.69408 7.73777L1.78334 13.6918C1.5874 13.8892 1.32169 14 1.04463 14C0.767572 14 0.501858 13.8892 0.305919 13.6918Z"
                        fill="white" />
                </svg>

            </div>
            <div :class="$style.methods__max">
                <img src="/public/images/connection/max.svg">
                <span>
                    Войти через MAX
                </span>
                <svg width="8" height="14" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.305919 13.6918C0.110039 13.4945 0 13.2268 0 12.9477C0 12.6686 0.110039 12.401 0.305919 12.2036L5.47795 6.99365L0.305919 1.78371C0.115591 1.5852 0.0102749 1.31933 0.0126553 1.04337C0.0150361 0.767401 0.124922 0.503418 0.318647 0.308273C0.512371 0.113129 0.774434 0.00243855 1.04839 4.00543e-05C1.32235 -0.00235844 1.58628 0.103728 1.78334 0.295452L7.69408 6.24952C7.88996 6.44689 8 6.71456 8 6.99365C8 7.27273 7.88996 7.5404 7.69408 7.73777L1.78334 13.6918C1.5874 13.8892 1.32169 14 1.04463 14C0.767572 14 0.501858 13.8892 0.305919 13.6918Z"
                        fill="white" />
                </svg>

            </div>
            <div :class="$style.methods__email" @click="choiceEmail = true">
                <span>
                    E-mail
                </span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.305919 13.6918C0.110039 13.4945 0 13.2268 0 12.9477C0 12.6686 0.110039 12.401 0.305919 12.2036L5.47795 6.99365L0.305919 1.78371C0.115591 1.5852 0.0102749 1.31933 0.0126553 1.04337C0.0150361 0.767401 0.124922 0.503418 0.318647 0.308273C0.512371 0.113129 0.774434 0.00243855 1.04839 4.00543e-05C1.32235 -0.00235844 1.58628 0.103728 1.78334 0.295452L7.69408 6.24952C7.88996 6.44689 8 6.71456 8 6.99365C8 7.27273 7.88996 7.5404 7.69408 7.73777L1.78334 13.6918C1.5874 13.8892 1.32169 14 1.04463 14C0.767572 14 0.501858 13.8892 0.305919 13.6918Z"
                        fill="white" />
                </svg>

            </div>
            <div :class="$style.methods__anonym">
                <span>
                    Пропустить
                </span>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0.305919 13.6918C0.110039 13.4945 0 13.2268 0 12.9477C0 12.6686 0.110039 12.401 0.305919 12.2036L5.47795 6.99365L0.305919 1.78371C0.115591 1.5852 0.0102749 1.31933 0.0126553 1.04337C0.0150361 0.767401 0.124922 0.503418 0.318647 0.308273C0.512371 0.113129 0.774434 0.00243855 1.04839 4.00543e-05C1.32235 -0.00235844 1.58628 0.103728 1.78334 0.295452L7.69408 6.24952C7.88996 6.44689 8 6.71456 8 6.99365C8 7.27273 7.88996 7.5404 7.69408 7.73777L1.78334 13.6918C1.5874 13.8892 1.32169 14 1.04463 14C0.767572 14 0.501858 13.8892 0.305919 13.6918Z"
                        fill="white" />
                </svg>

            </div>
        </div>

    </div>
</template>

<style module lang="scss">
:root {
    --app-height: 100dvh;
}

.connection {
    height: var(--app-height);
    width: 100dvw;
    display: flex;
    align-items: center;
    flex-direction: column;

    &__header {
        background-color: #853CFF;
        height: calc(49/844*var(--app-height));
        width: calc(346/390*100dvw);
        border-bottom-left-radius: 24px;
        border-bottom-right-radius: 24px;
        display: flex;
        align-items: center;
        padding: 0 14px;

    }

    &__logo {
        margin-left: auto;
        height: calc(20/844*var(--app-height));
        width: calc(50/390*100dvw);
    }

    &__form {
        margin-top: calc((40/844) * var(--app-height));

        &_error {
            position: absolute;
            margin-top: 5px;
            color: #F0436C !important;
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: clamp(10px, calc(12 / 390 * 100dvw), 12px);
            line-height: 110.00000000000001%;
            letter-spacing: 0%;
            vertical-align: middle;

        }

        &_errorInput {
            color: #F0436C !important;
            border: 1px solid #F0436C !important;
        }

        &_submit {
            margin-top: calc((40/844) * var(--app-height));
            border-radius: 8px;
            border: none;
            background-color: #6AB23D;
            height: calc(44/844*var(--app-height));
            width: calc(346/390*100dvw);
            color: white;
            font-family: "Lato", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: clamp(10px, calc(16 / 390 * 100dvw), 16px);
            line-height: 24px;
            letter-spacing: 1%;
            text-align: center;
            vertical-align: middle;

        }


    }

    &__input {
        height: calc(37/844*var(--app-height));
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;

        &:focus {
            border-color: #7D7D7D;
            outline: none;
        }

        border-radius: 8px;
        border: 1px solid #A9A9A9;

    }

    &__goback {



        &>img {
            height: 18px;
            width: 10px;
        }
    }
}

.formInfo {
    margin-top: calc((161/844)*var(--app-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc((10/844)*var(--app-height));

    &__header {
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-style: Medium;
        font-size: clamp(10px, calc(20 / 390 * 100dvw), 20px);
        line-height: 110.00000000000001%;
        letter-spacing: 0%;
        text-align: center;

    }
}

.methods {
    margin-top: calc((30/844)*var(--app-height));


    display: flex;
    flex-direction: column;
    gap: calc((10/844)*var(--app-height));

    &>div {
        font-family: "Lato", sans-serif;
        width: calc(346/390*100dvw);
        height: calc((44/844)*var(--app-height));
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-style: Regular;
        font-size: clamp(10px, calc(16 / 390 * 100dvw), 32px);
        letter-spacing: 1%;
        text-align: center;
        vertical-align: middle;
        color: #FFFFFF;
        position: relative;

        &>img {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            width: 29px;
            height: 29px;
        }

        &>svg {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 8px;
            height: 14px;
        }
    }

    &__vk {
        background-color: #0077FC;
    }

    &__max {
        border: 1.5px solid transparent;
        border-radius: 8px;

        background:
            linear-gradient(white, white) padding-box,
            linear-gradient(90deg, #0077FC 0%, #853CFF 100%) border-box;

        color: transparent;
        background-clip: padding-box, border-box;

        &>span {
            background: linear-gradient(90deg, #0077FC 0%, #853CFF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        &>svg path {
            fill: #853CFF;
        }

    }

    &__email {
        background-color: #6AB23D;
    }

    &__anonym {
        border: 1.5px solid #6AB23D;
        color: #6AB23D !important;

        &>svg path {
            fill: #6AB23D;
        }
    }

}
</style>