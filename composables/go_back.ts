import { useRouter } from 'vue-router'
export function UseGoBack(){
 const router = useRouter()
 function go_Back() {
    router.push("/leader/new_interactives").then(() => {
     
    })

}
return {router,go_Back}
}