<script setup lang="ts">
import header_logo from '~/components/header_logo.vue'
import first_reg from '~/components/login/first_reg.vue';

definePageMeta({
    middleware: ['init', 'hide-login'],
})
</script>

<template>
    <Layout :active_nav="'login'">
        <first_reg />
    </Layout>
</template>

<style></style>
