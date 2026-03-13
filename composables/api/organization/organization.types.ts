export type MeInOrganization = {
  name: string
  username: string
  organization_name: string
  role: string
}

export type OrganizationDescription = {
  organization_name: string
  organization_description: string
}
export type OrganizationParticipants = {
  participants: {
    name: string
    username: string
    role: 'leader' | 'admin' | 'organizator'
    id: number
    is_you: boolean
  }
}
export type OrganizationParticipantsFilter = 'all' | 'leader' | 'admin' | 'organizer'
export type OrganizationParticipantRoleChange = 'leader' | 'admin' | 'remote'