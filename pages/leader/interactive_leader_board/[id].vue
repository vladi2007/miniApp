<script setup lang="ts">
import InteractiveEnd_leader from '~/components/interactive_end/interactive_end_leader.vue'
const webApp = ref(null)
const userId = ref(null)
const route = useRoute()
const interactiveId = route.params.id
const props = ref<any>()
const isReady = ref(false)
onMounted(async () =>{
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        webApp.value = window.Telegram.WebApp
        //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
        const { $telegram } = useNuxtApp();
        userId.value = $telegram.initDataUnsafe.value?.user?.id;}
        if (userId.value) {
            const data = await useFetch('/api/get_leader_board', {

                query: {
                    telegram_id: userId.value,
                    interactive_id: interactiveId,
                    
                },
            });
            if (data){
             props.value=data.data.value
            isReady.value = true;
            }
            
        }
})

</script>

<template ><div v-if="isReady && props?.data">
  <InteractiveEnd_leader :data="props.data" :stage="props.stage"/>
</div>
</template>

<style>
</style>
