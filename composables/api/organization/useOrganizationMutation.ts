import { useMutation } from '@tanstack/vue-query'
import { patchMeInOrganization, patchOrganizationDescription, patchOrganizationParticipantRole } from './organization'
import type { MeInOrganization, OrganizationDescription, OrganizationParticipantRoleChange } from './organization.types'
import { useAuthStore } from '~/store/auth'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../handleAuthError'

export function mutateMeInOrganization() {
  const auth = useAuthStore()
  const { $queryClient } = useNuxtApp()
  return useMutation<MeInOrganization, unknown, string>({
    mutationFn: (newName: string) => patchMeInOrganization(newName),
    onSuccess: (data) => {
      $queryClient.setQueryData(['me_in_org', String(auth.id)], data)
      const queryKeysToUpdate = [
        ['org_participants', String(auth.id), 'all'],
        ['org_participants', String(auth.id), String(auth.role)],
      ]
      queryKeysToUpdate.forEach((key) => {
        $queryClient.setQueryData(key, (old: any) => {
          if (!old) return old

          return {
            ...old,
            participants: old.participants.map((p: any) => {
              if (p.is_you) {
                return {
                  ...p,
                  name: data.name,
                  username: data.username,
                  role: data.role,
                }
              }
              return p
            }),
          }
        })
      })
    },
    onError: (err) =>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
        case 'NAME_TOO_LONG':
            window.alert('Ваше имя должно быть длиной от 3 до 32 символов')
            break
        case 'ORGANIZATION_NOT_FOUND':
            window.alert('Организация не найдена')
            break
      }
    }
  })
}

export function mutateOrganizationDescription() {
  const { $queryClient } = useNuxtApp()
  const auth = useAuthStore()
  return useMutation<OrganizationDescription, unknown, { organization_name: string, organization_description: string }>({
    mutationFn: (paylod: { organization_name: string, organization_description: string }) => patchOrganizationDescription(paylod.organization_name, paylod.organization_description),
    onSuccess: (data) => {
      $queryClient.setQueryData(['org_desc', String(auth.id)], data)
      $queryClient.setQueryData(['me_in_org', String(auth.id)], (old: { organization_name: string, organization_description: string }) => {
        if (!old) return old
        return {
          ...old,
          organization_name: data.organization_name,
        }
      })
    },
    onError: (err) =>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
        case 'ORGANIZATION_NAME_TOO_LONG':
          window.alert('Название организации должно быть длиной от 3 до 32 символов')
          break
        case 'ORGANIZATION_DESCRIPTION_TOO_LONG':
          window.alert('Описание организации должно быть короче 200 символов')
          break
        case 'ONLY_ORGANIZER_CAN_CHANGE_DESCRIPTION':
          window.alert('Только организатор может менять описание организации')
          break
        case 'ORGANIZATION_NOT_FOUND':
          window.alert('Организация не найдена')
          break
      }
    }
  })
}

export function mutateOrganizationParticipants() {
  const { $queryClient } = useNuxtApp()
  const auth = useAuthStore()

  return useMutation<
    { name: string, username: string, organization_name: string, role: OrganizationParticipantRoleChange },
    unknown,
    { participant_id: number, role: OrganizationParticipantRoleChange }
  >({
    mutationFn: async (payload) => {
      const data = await patchOrganizationParticipantRole(payload.participant_id, payload.role)
      const role = data.role
      return {
        name: data.name,
        username: data.username,
        organization_name: data.organization_name,
        role,
      }
    },

    onSuccess: (data, payload) => {
      const queryKeys = ['all', 'leader', 'admin']
      if (payload.role === 'remote') {
        queryKeys.forEach((key) => {
          $queryClient.setQueryData(['org_participants', String(auth.id), key], (old: any) => {
            return {
              ...old,
              participants: old.participants.filter((p: any) => p.id !== payload.participant_id),
            }
          })
        })
      }
      else {
        $queryClient.setQueryData(['org_participants', String(auth.id), 'all'], (old: any) => {
          if (!old) return old
          return {
            ...old,
            participants: old.participants.map((p: any) =>
              p.id === payload.participant_id
                ? { ...p, role: data.role, name: data.name, username: data.username }
                : p,
            ),
          }
        })
        if (data.role === 'leader') {
        // добавляем в leader
          $queryClient.setQueryData(['org_participants', String(auth.id), 'leader'], (old: any) => {
            if (!old) return { participants: [{ ...data, id: payload.participant_id, is_you: false }] }
            const exists = old.participants.some((p: any) => p.id === payload.participant_id)
            return exists
              ? old
              : { ...old, participants: [...old.participants, { ...data, id: payload.participant_id, is_you: false }] }
          })
          $queryClient.setQueryData(['org_participants', String(auth.id), 'admin'], (old: any) => {
            if (!old) return old
            return { ...old, participants: old.participants.filter((p: any) => p.id !== payload.participant_id) }
          })
        }
        else if (data.role === 'admin') {
          $queryClient.setQueryData(['org_participants', String(auth.id), 'admin'], (old: any) => {
            if (!old) return { participants: [{ ...data, id: payload.participant_id, is_you: false }] }
            const exists = old.participants.some((p: any) => p.id === payload.participant_id)
            return exists
              ? old
              : { ...old, participants: [...old.participants, { ...data, id: payload.participant_id, is_you: false }] }
          })
          $queryClient.setQueryData(['org_participants', String(auth.id), 'leader'], (old: any) => {
            if (!old) return old
            return { ...old, participants: old.participants.filter((p: any) => p.id !== payload.participant_id) }
          })
        }
      }
    },
    onError: (err) =>{
      const error = err as AxiosError<ApiErrorResponse>
      const code = error.response?.data?.detail?.code
      console.log(code)
      switch (code) {
          case 'INSUFFICIENT_ROLE_PERMISSIONS_TO_CHANGE_ROLE':
            window.alert('Менять роли могут только администраторы и организатор')
            break
          case 'USER_NOT_FOUND_IN_ORGANIZATION':
            window.alert('Такой пользователь не состоит в вашей организации')
            break
          case 'USERS_IN_DIFFERENT_ORGANIZATIONS':
            window.alert('Этот пользователь состоит в другой организации')
            break
          case 'CANNOT_CHANGE_OWN_ROLE':
            window.alert('Нельзя менять роль самому себе')
            break
          case 'ADMIN_CAN_ONLY_CHANGE_LEADER':
            window.alert('Администратор может менять роль только ведущим')
            break
      }
    }
  })
}
