import { form } from '#build/ui'
import { Mutation, useMutation } from '@tanstack/vue-query'
import { useAuthStore } from '~/store/auth'
import { getInteractive, postInteractive, deleteInteractive, patchInteractive } from './interactivities'
import type { InteractivitiesListFilter } from './interactivities.types'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../handleAuthError'

export function mutateCreateInteractivities() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: async (formData: FormData) => postInteractive(formData),
    onSuccess: (data) => {
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'all'],
      }),
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'not_conducted'],
      })
    },
    onError: (err)=>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
          
          
          case 'INTERACTIVE_PARSING_ERROR':
            window.alert('Неправильный формат интерактива')
            break
          case 'INVALID_QUESTION_POSITIONS':
            window.alert('Неправильный формат интерактива. Вопрос должен начинаться с 1')
            break
          case 'INVALID_QUESTION_SCORE':
            window.alert('Неправильный формат интерактива. Балл за вопрос должен быть от 1 до 5')
            break
          case 'TOO_MANY_ANSWERS':
            window.alert('Неправильный формат вопроса интерактива. Неправильное число вариантов ответа')
            break
          case 'REQUIRES_ONE_CORRECT_ANSWER':
            window.alert('Вопрос типа "один из списка" должен иметь один правильный вариант')
            break
          case 'REQUIRES_MANY_CORRECT_ANSWERS':
            window.alert('Вопрос типа "несколько из списка" должен иметь несколько правильный вариант')
            break
          case 'REQUIRES_TEXT_CORRECT_ANSWERS':
            window.alert('В вопросе типа "текст" каждый вариант должен быть правильным')
            break
          case 'INSUFFICIENT_IMAGES':
            window.alert('получено недостаточно изображений для интерактива')
            break
          case 'FILE_SIZE_EXCEEDED':
            window.alert('размер файла должен быть до 5 мб')
            break
         
          
      }
    }
  })
}

export function mutateEditInteractive() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: async (payload: { formData: FormData, interactive_id: number }) => patchInteractive(payload.formData, payload.interactive_id),
    onSuccess: (data) => {
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'all'] }),
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'conducted'] })
    },
    onError: (err)=>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
          
          
          case 'INTERACTIVE_PARSING_ERROR':
            window.alert('Неправильный формат интерактива')
            break
          case 'INVALID_QUESTION_POSITIONS':
            window.alert('Неправильный формат интерактива. Вопрос должен начинаться с 1')
            break
          case 'INVALID_QUESTION_SCORE':
            window.alert('Неправильный формат интерактива. Балл за вопрос должен быть от 1 до 5')
            break
          case 'TOO_MANY_ANSWERS':
            window.alert('Неправильный формат вопроса интерактива. Неправильное число вариантов ответа')
            break
          case 'REQUIRES_ONE_CORRECT_ANSWER':
            window.alert('Вопрос типа "один из списка" должен иметь один правильный вариант')
            break
          case 'REQUIRES_MANY_CORRECT_ANSWERS':
            window.alert('Вопрос типа "несколько из списка" должен иметь несколько правильный вариант')
            break
          case 'REQUIRES_TEXT_CORRECT_ANSWERS':
            window.alert('В вопросе типа "текст" каждый вариант должен быть правильным')
            break
          case 'INSUFFICIENT_IMAGES':
            window.alert('получено недостаточно изображений для интерактива')
            break
          case 'FILE_SIZE_EXCEEDED':
            window.alert('размер файла должен быть до 5 мб')
            break
          case 'INTERACTIVE_NOT_FOUND':
            window.alert('интерактив не найден')
            break
          case 'INTERACTIVE_ALREADY_END':
            window.alert('интерактив завершён ')
            break
          case 'INTERACTIVE_ALREADY_STARTED':
            window.alert('интерактив запущен ')
            break
          case 'ORGANIZATION_NOT_FOUND':
            window.alert('Организация не найдена')
            break
      }
    }
  })
}
export function mutateDuplicateInteractive() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  const { mutate: saveInteractive } = mutateCreateInteractivities()
  return useMutation({
    mutationFn: async (id: number) => {
      const data = await getInteractive(id)
      const plain = JSON.parse(JSON.stringify(data))

      const formData = new FormData()
      formData.append('interactive', JSON.stringify(plain))
      saveInteractive(formData)
    },

  })
}

export function mutateDeleteInteractive() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()

  return useMutation({
    mutationFn: (payload: { interactive_id: number }) =>
      deleteInteractive(payload.interactive_id),

    onSuccess: () => {
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'all'] }),
      $queryClient.invalidateQueries({
        queryKey: ['interactives', String(auth.id), 'not_conducted'] })
    },
    onError: (err) =>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
          case 'ORGANIZATION_NOT_FOUND':
            window.alert('Организация не найдена')
            break
          case 'INTERACTIVE_ALREADY_END':
            window.alert('интерактив завершён ')
            break
          case 'LEADER_CANNOT_DELETE_FOREIGN_INTERACTIVE':
            window.alert('ведущий не может удалять чужие интерактивы ')
            break
          case 'CANNOT_DELETE_FOREIGN_ORGANIZATION_INTERACTIVE':
            window.alert('пользователь не может удалять интерактивы других организаций')
            break
         
         
          
      }
    }
  })
}
