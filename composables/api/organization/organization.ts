import type { MeInOrganization, OrganizationDescription, OrganizationParticipantsFilter, OrganizationParticipants, OrganizationParticipantRoleChange } from "./organization.types"

// получить данные о себе в организации
export const getMeInOrganization = async (): Promise<MeInOrganization> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/organization/me/name?x_key=super-secret-key&telegram_id=5480613794`, { params: { } })
  console.log(res.data)
  return res.data
}

// изменить данные о себе в организации
export const patchMeInOrganization = async (name: string): Promise<MeInOrganization> => {
  const { $api } = useNuxtApp()
  const res = await $api.patch(`/organization/me/name`, { params: { name } })
  return res.data
}

// получить описание организации
export const getOrganizationDescription = async (): Promise<OrganizationDescription> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/organization/description`, { params: { } })
  return res.data
}
// изменить описание организации
export const patchOrganizationDescription = async (organization_name: string, organization_description: string): Promise<OrganizationDescription> => {
  const { $api } = useNuxtApp()
  const res = await $api.patch(`/organization/description`, { params: { organization_name, organization_description } })
  return res.data
}

// получить список участников организации
export const getOrganizationParticipants = async (filter: OrganizationParticipantsFilter): Promise<OrganizationParticipants> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/organization/participants`, { params: { filter } })
  return res.data
}

// изменить роль участника организации
export const patchOrganizationParticipantRole = async (participant_id: number, role: OrganizationParticipantRoleChange): Promise<OrganizationParticipants> => {
  const { $api } = useNuxtApp()
  const res = await $api.get(`/organization/participant_change_role`, { params: { role, participant_id } })
  return res.data
}