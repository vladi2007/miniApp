export interface QuestionData {
  // данные для фазы question
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
    type:string
    question_weight:string
     image:string
  }
  answers: {
    id: string
    text: string
  }[]
  data_answers:{
    text:string,
    percentage:string
  }[]
  id_correct_answer: string | string[]
  percentages: {
    id: string
    percentage: number
  }[]
}

// данные для конца интерактива фаза end
export interface EndData {

  
    title: string
    participants_total: string
    winners: {
    position: string
    username: string
  }[]
  
  
}
// данные для фазы ожидания waiting
export interface WaitingData {
  title: string
  description: string
  code: string
  participants_active: string
}
// данные для фазы ожидания countdown
export interface CountdownData {
  timer: string

}
export interface Pause{
  state:string
  timer_n:number
}