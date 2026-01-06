<script setup lang="ts">
    const telegramName = useState<string | null>('userName')
        const userPhoto = useState<string>('userPhoto')
    console.log(telegramName)

    const router = useRouter()
async function goTo(url: string) {
    router.push(url)
}
const orgs=ref(false)
const org_name=ref('ИРИТ РТФ')
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
const userId = useState('telegramUser')
const { data: org, isLoading, refetch } = useQuery({
    queryKey: computed(() => ['org', userId.value]),
    queryFn: async () => {
        const res = await $fetch('/api/get_org_name', {
            query: { telegram_id: userId.value, }

        })
        return res
    },
    enabled: computed(() => Boolean(userId)),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
})
</script>
<template>
    <div class="header_fon">
        <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
            <div class="header_nav">
                <div class='header_nav_about_us' @click="goTo('/leader/main_menu')">
                    О нас
                </div>
                <div class="header_nav_organization_settings" @click="orgs=!orgs" >
                    <div class="header_nav_organization_settings_name">
                        {{ org?.organization_name }}
                    </div>
                      <img src="../public/images/Vector.svg" />
                      <div class="header_nav_item-dropdown-options" v-if="orgs"
                                style=" z-index: 10001 !important;" >
                                <div class ='header_nav_item-dropdown-options-header'>
                                    Выберите организацию:
                                </div>
                                <div class="header_nav_item-dropdown-option"  @click="org_name='Джойтека'">
                                    Джойтека
                                </div>
                                <div class="header_nav_item-dropdown-option"  @click="org_name='Звезда'">
                                    Звезда 
                                </div>
                                <div class="header_nav_item-dropdown-option"   @click="org_name='ИРИТ РТФ'">
                                    ИРИТ РТФ 
                                </div>
                            </div>
                </div>
                <div class='header_nav_user' @click="goTo('/leader/user')">
                    @{{ telegramName }}
                </div>
                <div class = 'header_nav_photo' @click="goTo('/leader/user')">
                    <img :src="userPhoto"/>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
   
@media (max-width:1918px),
(max-height:1078px) {

    .header_fon {
        width: 100dvw;
        height: calc((71 / 832) * 100dvh);
        background-color: #853CFF;
        display: flex;
    }

    .header {
        width: calc((1224/1280) * 100dvw);height: calc((71 / 832) * 100dvh);
        display: flex;
        align-items: center;
       
        margin: 0 auto;
    }
    
    #logo_header {
        width: calc((123/1280) * 100dvw);
        height: calc((50 / 832) * 100dvh);
    }

    .header_nav {
        display: flex;
        gap: calc((30/1280) * 100dvw);
        height: calc((50 / 832) * 100dvh);
        margin-left:  auto;
        align-items: center; 
    }

    .header_nav>div {
        font-family: "Lato", sans-serif;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-style: Medium;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        font-style: Medium;
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        text-align: center;
        vertical-align: middle;
        color: #FFFFFF;
        cursor: pointer;

    }

    .header_nav_organization_settings >img  {
        width: calc((16/1280) * 100dvw);
        height: calc((9 / 832) * 100dvh);
        margin-left: calc((5/1280) * 100dvw);
    }
    .header_nav_photo{
      width: calc((50/1280) * 100dvw);
        height: calc((50 / 832) * 100dvh);
    }
    .header_nav_photo > img{
      width: calc((50/1280) * 100dvw);
        height: calc((50 / 832) * 100dvh);
        border-radius: 50%;
  object-fit: cover;
    }

    .header_nav_item-dropdown-options {
        position: absolute;
        top: calc(100% + calc(32/832)*100dvh);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: calc((318 / 1280) * 100dvw);
        height: calc((206 / 832) * 100dvh);
        border-radius: calc((14/832*100dvh));
        left: calc((-11 / 1280) * 100dvw);
        background: white;
        z-index: 665455;

    }
    .header_nav_item-dropdown-options-header{
      margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 600;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        width: calc((306/1280) * 100dvw);
         height: calc((34 / 832) * 100dvh);
         padding-left: calc((5/1280) * 100dvw);
         margin-top:calc((17 / 832) * 100dvh)
    }
    .header_nav_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size: clamp(10px, calc(20 / 1280 * 100dvw), 40px);
        letter-spacing: clamp(0.1px, calc(20 / 100 / 1280 * 100dvw), 0.4px);
        width: calc((306/1280) * 100dvw);
         height: calc((34 / 832) * 100dvh);
         padding-left: calc((5/1280) * 100dvw);
        margin-top:calc((12 / 832) * 100dvh)
    }

    .header_nav_item-dropdown-option:hover{
        border-radius: calc(7/832*100dvh);
        background-color: #DFDFDF !important;
    }
}


@media (min-width:1918px) and (min-height:1078px) {
    .header_fon {
        width: 100dvw;
        height: 71px;
        background-color: #853CFF;
        display: flex;
    }

    .header {
        width: 1620px;
        height: 71px;
        background-color: #853CFF;
        display: flex;
        align-items: center;
        margin: 0 auto;
    }

    #logo_header {
        width: 123px;
        height: 50px;
    }

    .header_nav {
        display: flex;
         gap:30px; ;
       margin-left:  auto;
         height: 50px;;
        align-items: center;
    }

    .header_nav>div {
        font-family: "Lato", sans-serif;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-style: Medium;
        font-size: 20px;
        font-style: Medium;
        letter-spacing: 0.2px;
        text-align: center;
        vertical-align: middle;
        color: #FFFFFF;
        cursor: pointer;

    }
     .header_nav_organization_settings >img  {
        width: 16px;
        height: 9px;
        margin-left: 5px;;
    }
     .header_nav_photo{
      width: 50px;
        height: 50px;
    }
    .header_nav_photo > img{
      width: 50px;
        height: 50px;
        border-radius: 50%;
  object-fit: cover;
    }
    .header_nav_item-dropdown-options {
        position: absolute;
        top: calc(100% + 32px);
        box-shadow: 0px 1px 13.8px 0px #00000025;
        width: 318px;
        height: 206px;
        border-radius: 14px;
        left: -11px;
        background: white;
        z-index: 665455;

    }
    .header_nav_item-dropdown-options-header{
      margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 600;
        font-size:20px;
        letter-spacing: 0.2px;
        width: 306px;
         height: 34px;
         padding-left: 5px;
         margin-top:17px
    }
    .header_nav_item-dropdown-option {
        margin: 0 auto;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-family: "Lato", sans-serif;
        color: #1D1D1D;
        white-space: nowrap;
        font-weight: 400;
        font-size:20px;
        letter-spacing: 0.2px;
        width: 306px;
         height: 34px;
         padding-left: 5px;
         margin-top:12px
    }

    .header_nav_item-dropdown-option:hover{
        border-radius: 7px;
        background-color: #DFDFDF !important;
    }
}
*{
    padding: 0;;
}
.header_nav_organization_settings{
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
}

 /* .header{
        background-color: beige;
    } */
</style>