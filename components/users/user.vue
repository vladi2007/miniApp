<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const telegramName = useState<string | null>('userName')
const userId = useState('telegramUser')
const { data: name, isLoading, refetch } = useQuery({
    queryKey: computed(() => ['name', userId.value]),
    queryFn: async () => {
        const res = await $fetch('/api/get_name', {
            query: { telegram_id: userId.value, }

        })
        return res
    },
    enabled: computed(() => Boolean(userId)),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
})
const userNameInput = ref('')
watch(
  () => name.value,
  (val) => {
    if (val?.name) {
      userNameInput.value = val.name
    }
  },
  { immediate: true }
)

const { $queryClient } = useNuxtApp()
const { mutate: saveName  } = useMutation({
  mutationFn: (newName: string) =>
  
    $fetch('/api/patch_name', {
      method: 'PATCH',
      query: {
        telegram_id: userId.value,
        name: newName,
      },
    }
    

),
  onSuccess: (data) => {
    // обновляем кэш, без refetch
    
    $queryClient.invalidateQueries(['org_participants'])}

})
const originalName = computed(() => name.value?.name ?? '')

const canSave = computed(() => {
    const trimmed = userNameInput.value.trim()
  if (trimmed.length<3) {
    // Можно показать уведомление
    window.Telegram.WebApp.showAlert('Имя должно быть длинее 2 символов')
    return
  }
  return (
    trimmed !== originalName.value.trim() 
    
  )
})

</script>
<template>
    <layout :active_nav="'user'">
        <form class="user_form">
            <div class="user_form_input">
                <div class="user_form_input_title">
                    Имя пользователя:
                </div>
                <div class="user_form_input_group">
                    <textarea class="user_form_input_group_input" placeholder="Сергеев Сергей Сергеевич"
                        maxlength="32" v-model="userNameInput"></textarea>
                    <div class='user_form_input_group_button' @click="canSave && saveName(userNameInput)">
                        Сохранить
                    </div>
                </div>
                <div class="user_form_input_info">
                    <img src="/public/images/icon.svg" class="user_form_input_info_icon" />
                    <div class='user_form_input_info_text'>
                        Данное имя будет отображаться при создании интерактива и в отчетах
                    </div>
                </div>


            </div>



        </form>
        <div class="user_info">
            <div class='user_info_part'>
                Telegram username: <span>@{{ name?.username }}</span>
            </div>
            <div class='user_info_part'>
                Организация: <span>{{ name?.organization_name }}</span>
            </div>
            <div class='user_info_part'>
                Роль в организации: <span>Администратор</span>
            </div>
        </div>
    </layout>
</template>
<style>
@media (max-width:1918px),
(max-height:1078px) {
    .user_form {
        margin-top: calc((25 / 832) * 100dvh);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc((575 / 1280) * 100dvw);
    }

    .user_form_input_group {
        margin-top: calc((10 / 832) * 100dvh);
        display: flex;
        align-items: center;
        height: calc((42 / 832) * 100dvh);
        width: calc((575 / 1280) * 100dvw);
    }

    .user_form_input_group_button {
        color: #6AB23D;
        cursor: pointer;
        margin-left: calc(118/1280*100dvw);
    }

    .user_form_input_group>textarea {
        width: calc((378 / 1280) * 100dvw);
        height: calc((42 / 832) * 100dvh);
        border-radius: calc((8 / 832) * 100dvh);
        border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;
        padding-left: calc(12/1280*100dvw);
        padding-top: calc((12 / 832) * 100dvh);
        line-height: calc((18 / 832) * 100dvh);
        box-sizing: border-box;
        vertical-align: middle;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

    }

    .user_form_input_info {
        height: calc((26 / 832) * 100dvh);
        display: flex;
        align-items: center;
        margin-top: calc((5 / 832) * 100dvh);
        color: #7D7D7D;
        font-size: clamp(10px, calc(14 / 1280 * 100dvw), 28px);
        letter-spacing: clamp(0.1px, calc(14 / 100 / 1280 * 100dvw), 0.28px);
    }

    .user_form_input_info>div {
        margin-left: calc(5 / 1280 * 100dvw);
        white-space: nowrap;
    }

    .user_form_input_info>img {
        height: calc((24 / 832) * 100dvh);
        width: calc((24 / 1280) * 100dvw);
    }

    .user_info {
        margin-top: calc((15 / 832) * 100dvh);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        display: flex;
        flex-direction: column;
        gap: calc((15 / 832) * 100dvh);
    }

    .user_info_part>span {
        color: #853CFF
    }
}

@media (min-width:1918px) and (min-height:1078px) {
    .user_form {
        margin-top: 25px;
        ;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 0.16px;
        width: 575px;
        ;
    }

    .user_form_input_group {
        margin-top: 10px;
        display: flex;
        align-items: center;
        height: 42px;
        ;
        width: 575px;
    }

    .user_form_input_group_button {
        color: #6AB23D;
        cursor: pointer;
        margin-left: 118px;
    }

    .user_form_input_group>textarea {
        width: 378px;
        height: 42px;
        border-radius: 8px;
        border: 1.5px solid #E0E0E0;
        padding-left: 12px;
        ;
        padding-top: 12px;
        ;
        line-height: 12px;
        ;
        box-sizing: border-box;
        vertical-align: middle;
        font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;
        ;
        letter-spacing: 0.16px;

    }

    .user_form_input_info {
        height: 26px;
        ;
        display: flex;
        align-items: center;
        margin-top: 5px;
        color: #7D7D7D;
        font-size: 14px;
        ;
        letter-spacing: 0.14px;
    }

    .user_form_input_info>div {
        margin-left: 5px;
        ;
        white-space: nowrap;
    }

    .user_form_input_info>img {
        height: 24px;
        width: 24px;
    }

    .user_info {
        margin-top: 15px;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 0.16px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .user_info_part>span {
        color: #853CFF
    }
}

textarea {
    resize: none;
}
</style>