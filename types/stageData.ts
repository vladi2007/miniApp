export interface QuestionData {
  questions_count: string
  timer_duration: string
  stage:string
  timer: string
  title: string
  code: string
  question: {
    id: string
    text: string
    position: string
  }
  answers: {
    id: string
    text: string
  }[]
  id_correct_answer: string
  percentages: {
    id: string
    percentage: number
  }[]
}


export interface EndData {

  
    title: string
    participants_total: string
    winners: {
    position: string
    username: string
  }[]
  
  
}

export interface WaitingData {
  title: string
  description: string
  code: string
  participants_active: string
}

export interface CountdownData {
  timer: string

}
