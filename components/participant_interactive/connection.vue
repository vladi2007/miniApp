<script setup lang="ts">
const props = defineProps<{
    vk: boolean
    nameIsSended: boolean
    onNameSent: () => void;
    onAnswer: ((msg: string) => void) | null
    initName: string
}>()
const { $bridge } = useNuxtApp()
import type { FormSubmitEvent } from '@nuxt/ui';
import { boolean, object, Schema, string, type InferType } from 'yup';

const schemaCon = object({
    name: string()
        .required('Введите Имя')
        .min(2, 'От 2 до 32 символов')
        .max(32, 'От 2 до 32 символов')

})
type SchemaCon = InferType<typeof schemaCon>
const initialCon = {
    name: props.initName
}
const stateCon = reactive({ ...initialCon })
const formCon = useTemplateRef('formCon')
const ready = ref(false)
const forgotPending = ref(false)
const isSended = ref(false)
const route = useRoute()

async function onSubmitCon(event: FormSubmitEvent<SchemaCon>) {
    const id = route.params.id as string
    isSended.value = true
    props.onNameSent();
    props.onAnswer?.(JSON.stringify({ name: stateCon.name }))
    if (props.vk) {
        localStorage.setItem(`name_${interactiveId.value}`, stateCon.name)
    }
    else {
        localStorage.setItem(`name_${id}`, stateCon.name)
    }

}

const interactiveId = ref<string | null>(null)
async function parseHash() {
    const hash = window.location.hash
    if (!hash) return

    const cleanHash = hash.slice(1) // убрали #
    const [path, queryString] = cleanHash.split('?')

    if (path !== 'interactive') return

    const query = Object.fromEntries(
        new URLSearchParams(queryString || '')
    )

    interactiveId.value = query.id as string
}
onMounted(async () => {
    await parseHash()
    const id = route.params.id as string
    if (props.vk) {

        const data = await $bridge?.send('VKWebAppGetUserInfo')
        stateCon.name = data.first_name + ' ' + data.last_name
        const nameFlag = localStorage.getItem(`name_${interactiveId.value}`)
        console.log(nameFlag)
        if (nameFlag) {
            isSended.value = true
            props.onNameSent();
            props.onAnswer?.(JSON.stringify({ name: nameFlag }))
            return
        }
    }
    const nameFlag = localStorage.getItem(`name_${id}`)
    if (nameFlag) {
        isSended.value = true
        props.onNameSent();
        props.onAnswer?.(JSON.stringify({ name: nameFlag }))
        return
    }
    ready.value = true
})

</script>
<template>
    <div :class="$style.connection" v-if="ready">
        <div :class="$style.connection__header">
            <img src="/public/images/logo.svg" :class="$style.connection__logo" />

        </div>
        <div :class="$style.formInfo">
            <span :class="$style.formInfo__header">
                Введите свое имя
            </span>
            <span :class="$style.formInfo__header_second">
                Это имя будет отображаться на доске
            </span>
        </div>
        <UForm ref="formCon" :class="$style.connection__form" :validate-on="['input']" :state="stateCon"
            :schema="schemaCon" @submit="onSubmitCon">
            <UFormField v-slot="{ error }" name="name" :eager-validation="true" :validate-on-input-delay="0" label=""
                :ui="{ error: $style.connection__form_error }">

                <div :class="$style.connection__input_wrapper">
                    <UInput v-model="stateCon.name" :ui="{
                        base: error
                            ? [$style.connection__input, $style.connection__form_errorInput]
                            : $style.connection__input
                    }">
                        <img :class="$style.connection__form_clear" src="/public/images/connection/clear_name.svg"
                            @click="stateCon.name = ''; formCon?.clear(); formCon?.validate()">
                    </UInput>
                </div>
            </UFormField>
            <UButton :class="$style.connection__form_submit" type="submit" :disabled="isSended || forgotPending">
                Присоединиться
            </UButton>
        </UForm>
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
        padding: 14px;

    }

    &__logo {
        margin-left: auto;
        height: calc(20/844*var(--app-height));
        width: calc(50/390*100dvw);
    }

    &__form {
        margin-top: calc((20/844) * var(--app-height));

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

        &_clear {
            position: absolute;
            right: 6.5px;
            top: 6.5px;
            height: calc(24/844*var(--app-height));
            width: calc(24/390*100dvw);
        }
    }

    &__input {
        &:focus {
            border-color: #7D7D7D;
            outline: none;
        }

        height: calc(37/844*var(--app-height));
        width: calc(346/390*100dvw);
        border-radius: 8px;
        border: 1px solid #A9A9A9;
        padding:10px;


        &_wrapper {
            position: relative;
            width: calc(346/390*100dvw);
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

    &__header_second {
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-style: normal;
        font-size: clamp(10px, calc(14 / 390 * 100dvw), 14px);
        line-height: 120%;
        letter-spacing: 1%;
        text-align: center;
        vertical-align: middle;
        color: #7D7D7D;
    }
}
</style>