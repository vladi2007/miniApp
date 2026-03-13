export type InteractivitiesListFilter = 'all' | 'conducted' | 'not_conducted'
export type InteractivitiesList = {
  interactives_list: {
    title: string
    target_audience: string
    participant_count: number
    is_conducted: boolean
    id: number
    date_completed: string
    username: string
    is_you: boolean
  }[]
  is_end: boolean
}

export type InteractiveState = boolean

export type QuestionAnswer = {
  is_correct: boolean
  text: string
}
export type QuestionQuestion = {
  answers: QuestionAnswer[]
  image: string
  position: number
  score: number
  text: string
  type: 'one' | 'many' | 'text'
}
export type Interactive = {
  answer_duration: number
  countdown_duration: number
  description: string
  discussion_duration: number
  location: string
  questions: QuestionQuestion[]
  target_audience: string
  title: string
}

export type Winner = {
  position: number
  username: string
  score: number
  time: number
}

export type InteractiveLeaderBoard = {
  stage: 'waiting'
  data: {
    title: string
    participants_total: 0
    winners: Winner[]
  }
}

export type ReportData = {
  interactive_id: {
    id: number
  }[]
  report_type: string
}
export type BroadcastData = {
  interactive_id: {
    id: number
  }[]
  report_type: string
}
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

export type LoginCredentials = {
  password: string
  login: string
}
export type AccessToken = {
  accessToken: string
}
export type OrganizationParticipantsFilter = 'all' | 'leader' | 'admin' | 'organizer'
export type OrganizationParticipantRoleChange = 'leader' | 'admin' | 'remote'
