import { useQuery } from '@tanstack/vue-query'
import { getMeInOrganization, getOrganizationDescription, getOrganizationParticipants } from './organization'
import type { MeInOrganization, OrganizationDescription, OrganizationParticipants, OrganizationParticipantsFilter } from './organization.types'
import { useAuthStore } from '~/store/auth'

export function useMeInOrganization(options?: any) {
  const auth = useAuthStore()
  return useQuery<MeInOrganization>({
    queryKey: computed(() => ['me_in_org', String(auth.id)]),
    queryFn: async () => getMeInOrganization(),
    ...options,
    
  })
}

export function useOrganizationDescription() {
  const auth = useAuthStore()
  return useQuery<OrganizationDescription>({
    queryKey: computed(() => ['org_desc', String(auth.id)]),
    queryFn: async () => getOrganizationDescription(),
  })
}

export function useOrganizationParticipants(filterRef: Ref<OrganizationParticipantsFilter>) {
  const auth = useAuthStore()
  console.log(String(filterRef.value))
  return useQuery<OrganizationParticipants>({
    queryKey: computed(() => ['org_participants', String(auth.id), String(filterRef.value)]),
    queryFn: async () => getOrganizationParticipants(filterRef.value),
  })
}
