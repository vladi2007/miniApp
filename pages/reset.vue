<script setup lang="ts">
import header_logo from '~/components/header_logo.vue'
import reset from '~/components/login/reset.vue';

definePageMeta({
    middleware: ['init', 'hide-login'],
})
</script>

<template>
    <Layout :active_nav="'login'">
        <reset />
    </Layout>

</template>

<style></style>
