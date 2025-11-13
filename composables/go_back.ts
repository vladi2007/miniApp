import { useRouter } from 'vue-router'
export function UseGoBack(){
 const router = useRouter()
 function go_Back() {
    router.push("/leader/interactives").then(() => {
        // Перезагрузка после успешной навигации
        window.location.reload()
    })

}
return {router,go_Back}
}