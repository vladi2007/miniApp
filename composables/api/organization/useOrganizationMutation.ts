import { useMutation } from '@tanstack/vue-query'
import { patchMeInOrganization, patchOrganizationDescription, patchOrganizationParticipantRole } from './organization'
import type { OrganizationParticipantRoleChange } from './organization.types'

export function mutateMeInOrganization() {
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: (newName: string) => patchMeInOrganization(newName),
    onSuccess: () => {
    // обновляем кэш, без refetch

      $queryClient.invalidateQueries({
        queryKey: ['me_in_org'],
      })
    },

  })
}

export function mutateOrganizationDescription() {
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: (paylod: { organization_name: string, organization_description: string }) => patchOrganizationDescription(paylod.organization_name, paylod.organization_description),
    onSuccess: () => {
    // обновляем кэш, без refetch

      $queryClient.invalidateQueries({
        queryKey: ['org_desc'],

      })
      $queryClient.invalidateQueries({
        queryKey: ['me_in_org'],

      })
    },
  })
}

export function mutateOrganizationParticipants() {
  const { $queryClient } = useNuxtApp()
  return useMutation({
    mutationFn: (payload: { participant_id: number, role: OrganizationParticipantRoleChange }) =>
      patchOrganizationParticipantRole(payload.participant_id, payload.role),
    onSuccess: () => {
    // обновляем кэш, без refetch

      $queryClient.invalidateQueries({
        queryKey: ['org_participants'],
      })
    },
  })
}
