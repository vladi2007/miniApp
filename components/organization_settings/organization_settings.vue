<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const telegramName = useState<string | null>('userName')
const userId = useState('telegramUser')
const { data: org, isLoading, refetch } = useQuery({
    queryKey: computed(() => ['org', userId.value]),
    queryFn: async () => {
        const res = await $fetch('/api/get_org_name', {
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
const orgNameInput = ref<string>('')
const orgDescInput = ref<string>('')
watch(
  () => org.value,
  (val) => {

      orgNameInput.value = val?.organization_name ?? ''
    orgDescInput.value = val?.organization_description ?? ''
    
  },
  { immediate: true }
)

const { $queryClient } = useNuxtApp()
const { mutate: saveOrg  } = useMutation({
  mutationFn: () =>
  
    $fetch('/api/patch_org', {
      method: 'PATCH',
      query: {
        telegram_id: userId.value,
        organization_name: orgNameInput.value,
        organization_description:orgDescInput.value,
      },
    }
    

),
  onSuccess: (data) => {
    // обновляем кэш, без refetch
    $queryClient.invalidateQueries(['org'])}

})

const originalName = computed(() => org.value?.organization_name ?? '')
const originalDesc= computed(() => org.value?.organization_description ?? '')
const canSave = computed(() => {
    const trimmedName = orgNameInput.value.trim()
        const trimmedDesc = orgDescInput.value.trim()
  if (trimmedName.length<3) {
    // Можно показать уведомление
    window.Telegram.WebApp.showAlert('Имя должно быть длинее 2 символов')
    return
  }
  return (
    trimmedName !== originalName.value.trim() || trimmedDesc !== originalDesc.value.trim()
    
  )
})
</script>
<template>
    <layout :active_nav="'organization_settings'">
        <form class="org_form">
            <div class="org_form_input">
                <div class="org_form_input_title">
                    Название организации:
                </div>
                <textarea class="org_form_input_input" placeholder="Название" maxlength="32" minlength="3" v-model="orgNameInput"></textarea>

            </div>
            <div class="org_form_input">
                <div class="org_form_input_title">
                    Описание организации:
                </div>
                <textarea class="org_form_input_input"placeholder="Описание"maxlength="200" v-model="orgDescInput" ></textarea>


            </div>
            <div class="org_form_input_button" @click="canSave && saveOrg()">
                Сохранить изменения
            </div>
        </form>
    </layout>
</template>
<style>
    
@media (max-width:1918px),
(max-height:1078px) {
    .org_form {
        margin-top: calc((25 / 832) * 100dvh);
        margin-left: calc(327/1280*100dvw);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc((378 / 1280) * 100dvw);;
    }
    .org_form_input {
    display: flex;
    flex-direction: column;
    gap: calc((10 / 832) * 100dvh);
    margin-bottom: calc((10 / 832) * 100dvh);;
}
.org_form_input_title{
    height: calc((18 / 832) * 100dvh);;
    display: flex;
    align-items: center;
}
 .org_form_input > textarea{
    height: calc((42 / 832) * 100dvh);;
    border-radius: calc((8 / 832) * 100dvh);;
    border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;;
    padding-left:calc(12/1280*100dvw);
    padding-top:calc((12 / 832) * 100dvh);;  line-height: calc((18 / 832) * 100dvh); 
    box-sizing: border-box;
    vertical-align: middle;


    font-family: Lato;
font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

 }
.org_form_input_button{ width: calc((165 / 1280) * 100dvw);;
    margin-left: auto;;color:#6AB23D;cursor: pointer;
}
}

@media (min-width:1918px) and (min-height:1078px) {
       .org_form {
        margin-top: 25px;;
        margin-left: 327px;;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 0.16px;;
        width:378px;;
    }
    .org_form_input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;;
}
.org_form_input_title{
    height: 18px;;
    display: flex;
    align-items: center;
}
 .org_form_input > textarea{
     height: 42px;;
    border-radius: 8px;;
    border: 1.5px solid #E0E0E0;;
    padding-left:12px;
    padding-top:12px;;;  line-height: 18px; 
    box-sizing: border-box;
    vertical-align: middle;


font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;;
        letter-spacing: 0.16px;;

 }
.org_form_input_button{width:165px;;;
    margin-left: auto;;color:#6AB23D;cursor: pointer;
}
}
.org_form_input_button{
    white-space: nowrap;
}
textarea {
    resize: none;
}
</style>