<script setup lang="ts">
import { useEndInteractive } from '~/composables/api/interactivities/useInteractivitesQuery'

const route = useRoute()
const interactiveId = route.params.id
const props = ref<any>()
const isReady = ref(false)
const { data, isLoading } = useEndInteractive(Number(interactiveId))
definePageMeta({
  middleware: ['init', 'auth', 'role',
  ],
})
</script>

<template>
  <div v-if="data">
    <InteractiveEnd_leader :data="data" />
  </div>
</template>

<style></style>
