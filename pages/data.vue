<script setup>
import { ref, onMounted } from 'vue'

const data = ref({ message: '' });


onMounted(async () => {
   
        const res = await fetch('https://thingproxy.freeboard.io/fetch/https://carclicker.ru/hello/h123123123uy')
        const result = await res.json()
   
        data.value.message = result.message;
});
</script>

<template>
    <div>

        <pre>{{ data }}</pre>
    </div>
</template>

<style scoped>
pre {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
}
</style>
