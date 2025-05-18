import { ref } from 'vue';
import { useTgWebAppStore } from '/stores/tgWebApp'; // Путь к твоему store


// Функция для отправки запроса на сервер для аутентификации
const authenticateOnServer = async (contactData) => {
  try {
    const response = await useFetch('/api/verify', {
      method: 'POST',
      body: {
        contactData: contactData,
        unsafeData: contactData.unsafe
      }
    });

    console.log(response);

    if (response.data.value.status === 'success') {
      return { status: 'success', message: 'Аутентификация прошла успешно', data: response.data };
    } else {
      return { status: 'not_success', message: 'Ошибка при аутентификации на сервере', data: response.data };
    }
  } catch (error) {
    console.error('Ошибка при запросе на сервер:', error);
    return { status: 'error', message: 'Ошибка при аутентификации на сервере' };
  }
};

export const useAuthentication = () => {
  const status = ref('loading'); // Статус аутентификации
  const contactData = ref(null); // Контактные данные пользователя
  const store = useTgWebAppStore();

  const authenticateUser = async () => {
    try {
      // Проверяем, выполняется ли код на клиенте
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Инициализация данных (считывание unsafeData и contactData)
        await store.init();

        // Попытка аутентификации через биометрические данные
        const authResponse = await store.authenticateBiometric();

        if (authResponse.ok) {
          // Сохраняем контактные данные пользователя
          contactData.value = store.contactData;

          // Отправляем данные на сервер для аутентификации
          const serverAuthResponse = await authenticateOnServer(contactData.value);

          // Обновляем статус аутентификации
          if (serverAuthResponse.status === 'success') {
            status.value = 'success'; // Успешная аутентификация
          } else {
            status.value = 'error'; // Ошибка на сервере
          }
        } else {
          status.value = 'error'; // Ошибка при биометрической аутентификации
        }
      }
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      status.value = 'error';
    }
  };

  // Запуск аутентификации сразу после загрузки компонента, только на клиенте
  onMounted(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      authenticateUser();
    }
  });

  return {
    status,
    contactData,
    authenticateUser
  };
};
