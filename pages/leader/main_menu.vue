<script setup>
import main_menu from '~/components/main_menu/main_menu.vue'
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const { $telegram } = useNuxtApp()
const userId = computed(() => $telegram.initDataUnsafe.value?.user?.id ?? null)
const {
  data: roleData,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['user-role', userId],
  queryFn: async () => {
    if (!userId.value) return null

    const res = await $fetch('/api/role', {
      query: { telegram_id: userId.value }
    })

    return res
  },
  enabled: computed(() => Boolean(userId.value)),
  staleTime: 1000 * 60 * 30,       // 5 минут данные считаются свежими
  cacheTime: 1000 * 60 * 30,      // 30 минут кэш хранится даже если компонент размонтирован
  refetchOnWindowFocus: false,    // не рефетчить при возврате на вкладку
  refetchOnMount: false,    
})
const role = computed(() => roleData.value?.role ?? null)
</script>

<template>
  <div>
    <main_menu v-if="role==='leader'"/>


  </div>
</template>

<style>
.you_are_not_leader {


  display: flex;
  /* Используем Flexbox */
  justify-content: center;
  /* Центр по горизонтали */
  align-items: center;
  /* Центр по вертикали */
  text-align: center;
  /* Центрируем текст внутри блока */
  font-family: 'Lato', sans-serif;
  font-size: 64px;
  font-weight: 500;
}
</style>
