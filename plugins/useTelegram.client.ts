export default defineNuxtPlugin(async (nuxtApp) => {
  const initDataUnsafe = ref(null)

  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp
    initDataUnsafe.value = tg.initDataUnsafe ?? null

    // Сохраняем в sessionStorage
    sessionStorage.setItem('telegram_init_data', JSON.stringify(initDataUnsafe.value))
  }

  // Подгружаем роль
  const userRole = ref<string | null>(null)
  const userId = initDataUnsafe.value?.user?.id ?? null

  // Проверяем sessionStorage на роль
  const savedRole = sessionStorage.getItem('user_role')
  if (savedRole) {
    userRole.value = savedRole
  } else if (userId) {
    try {
      const roleData = await $fetch('/api/role', {
        query: { telegram_id: userId }
      })
      userRole.value = roleData?.role ?? null
      sessionStorage.setItem('user_role', userRole.value ?? '')
    } catch (err) {
      console.error('Ошибка при получении роли:', err)
    }
  }

  // Редирект, если пользователь не лидер и заходит на /leader/*
  if (typeof window !== 'undefined' && userRole.value !== 'leader') {
    const router = useRouter()
    if (router.currentRoute.value.path.startsWith('/leader')) {
      router.replace('/not_leader')
    }
  }

  return {
    provide: {
      telegram: {
        initDataUnsafe
      },
      userRole
    }
  }
})
