<script setup lang="ts">
const userId = useState('telegramUser')
const userRole = useState('userRole')
const route = useRoute()
const interactiveId = route.params.id
const props = ref<any>()
const isReady = ref(false)
onMounted(async () =>{
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        //вместо того чтобы обращаться к этим данным через api telegram, грузим это из sessionStorage
        if (userId) {
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
            
        }}
})

</script>

<template ><div v-if="isReady && props?.data">
  <InteractiveEnd_leader :data="props.data" :stage="props.stage"/>
</div>
</template>

<style>
</style>
