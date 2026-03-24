import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '~/store/auth'
import type { InteractiveLeaderBoard, InteractivitiesList, InteractivitiesListFilter } from './interactivities.types'
import { getInteractiveLeaderBoard, getInteractivities } from './interactivities'

export function useInteractivities(filter: Ref<InteractivitiesListFilter>,
  to_number: Ref<string>,
  from_number: Ref<string>) {
  const auth = useAuthStore()
  return useQuery<InteractivitiesList>({
    queryKey: computed(() => ['interactives', String(auth.id), String(filter.value), String(from_number.value), String(to_number.value)]),
    queryFn: async () => getInteractivities(filter.value, to_number.value, from_number.value)
  })
}

export function useEndInteractive(interactive_id: number) {
  const auth = useAuthStore()
  return useQuery<InteractiveLeaderBoard>({
    queryKey: computed(() => ['interactive_end', String(auth.id), String(interactive_id)]),
    queryFn: async () => getInteractiveLeaderBoard(interactive_id),
  })
}
