<script setup>

 const {data: products} = await useFetch('https://carclicker.ru/hello/asdasdasdasdasds'); 

</script>

<template>
    <div>

        <pre>{{ products }}asdsad</pre>
    </div>
</template>

<style scoped>
pre {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 4px;
}
</style>
