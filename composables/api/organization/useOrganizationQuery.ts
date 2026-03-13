import { useQuery } from "@tanstack/vue-query";
import { getMeInOrganization } from "./organization";

export function useMeInOrganization(){
    return useQuery({
  queryKey: computed(() => ['me_in_org']),
  queryFn: async () => getMeInOrganization(),
  
  
})
}