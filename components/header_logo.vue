<script setup lang="ts">
    const telegramName = useState<string | null>('userName')
        const userPhoto = useState<string>('userPhoto')
    console.log(telegramName)

    const router = useRouter()
async function goTo(url: string) {
    router.push(url)
}
</script>
<template>
    <div class="header_fon">
        <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
            <div class="header_nav">
                <div class='header_nav_about_us' @click="goTo('/leader/main_menu')">
                    О нас
                </div>
                <div class="header_nav_organization_settings">
                    <div class="header_nav_organization_settings_name">
                        ИРИТ РТФ
                    </div>
                    <div class="header_nav_organization_settings_name">
                      
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

        display: flex;
        align-items: center;
    }

    #logo_header {
        width: calc((123/1280) * 100dvw);
        height: calc((50 / 832) * 100dvh);
        margin-left: calc((28/1280) * 100dvw) !important;
    }

    .header_nav {
        display: flex;
        gap:calc((30/1280) * 100dvw) ;
        margin-left: calc((697.91/1280) * 100dvw) !important;
        height: calc((50 / 832) * 100dvh);
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
        margin-left: 1082.91px !important;
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
}


 /* .header{
        background-color: beige;
    } */
</style>