import { safeRequest } from '../api'
import type {
  MeInOrganization,
  OrganizationDescription,
  OrganizationParticipantsFilter,
  OrganizationParticipants,
  OrganizationParticipantRoleChange
} from './organization.types'


// получить данные о себе в организации
export const getMeInOrganization = async (): Promise<MeInOrganization> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.get(`/organization/me/name`)
    return res.data
  })

// изменить данные о себе в организации
export const patchMeInOrganization = async (name: string): Promise<MeInOrganization> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.patch(`/organization/me/name`, null, { params: { name } })
    return res.data
  })

// получить описание организации
export const getOrganizationDescription = async (): Promise<OrganizationDescription> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.get(`/organization/description`)
    return res.data
  })

// изменить описание организации
export const patchOrganizationDescription = async (
  organization_name: string,
  organization_description: string
): Promise<OrganizationDescription> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.patch(`/organization/description`, null, {
      params: { organization_name, organization_description }
    })
    return res.data
  })

// получить список участников организации
export const getOrganizationParticipants = async (filter: OrganizationParticipantsFilter): Promise<OrganizationParticipants> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.get(`/organization/participants`, { params: { filter } })
    return res.data
  })

// изменить роль участника организации
export const patchOrganizationParticipantRole = async (
  participant_id: number,
  role: OrganizationParticipantRoleChange
): Promise<MeInOrganization> =>
  safeRequest(async () => {
    const { $api } = useNuxtApp()
    const res = await $api.patch(`/organization/participant_change_role`, null, {
      params: { role, participant_id }
    })
    return res.data
  })