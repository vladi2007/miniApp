import { useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '~/store/auth'
import { postRegister } from './auth'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../handleAuthError'

export function mutateAddParticipant() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: async (payload: { email: string, role: string }) => postRegister(payload.email, payload.role),
    onSuccess: (data, payload) => {
      
      $queryClient.invalidateQueries({
        queryKey: ['org_participants', String(auth.id), 'all'],
      }),
      $queryClient.invalidateQueries({
        queryKey: ['org_participants', String(auth.id), String(payload.role)],
      })
      window.alert('Письмо успешно отправлено')
    },
    onError: (err) =>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      switch (code) {
          case 'INVALID_EMAIL':
            window.alert('Некорректный email добавляемого участника')
            break
          case 'LEADER_CANNOT_ADD_NEW_USER':
            window.alert('Ведущий не может добавить нового участника')
            break
          case 'CANNOT_ADD_USER_ANOTHER_ORGANIZATION':
            window.alert('Пользователь уже в другой организации')
            break
          case 'EMAIL_SEND':
            window.alert('Ошибка отправки email')
            break
      }
    }
    
})}
