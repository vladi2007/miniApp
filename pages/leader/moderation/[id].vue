<script setup lang="ts">
definePageMeta({
    middleware: ['init', 'auth', 'role',
    ],
})
import desktop from '~/components/moderation/desktop.vue';

</script>

<template>
    <desktop />
</template>

<style></style>