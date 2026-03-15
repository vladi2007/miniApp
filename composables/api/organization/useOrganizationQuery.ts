import { useQuery } from '@tanstack/vue-query'
import { getMeInOrganization, getOrganizationDescription, getOrganizationParticipants } from './organization'
import type { OrganizationParticipants, OrganizationParticipantsFilter } from './organization.types'

export function useMeInOrganization() {
  return useQuery({
    queryKey: computed(() => ['me_in_org']),
    queryFn: async () => getMeInOrganization(),

  })
}

export function useOrganizationDescription() {
  return useQuery({
    queryKey: computed(() => ['org_desc']),
    queryFn: async () => getOrganizationDescription(),
  })
}

export function useOrganizationParticipants(filterRef: Ref<OrganizationParticipantsFilter>) {
  return useQuery({
    queryKey: computed(() => ['org_participants', filterRef.value]),
    queryFn: async () => getOrganizationParticipants(filterRef.value),
  })
}
