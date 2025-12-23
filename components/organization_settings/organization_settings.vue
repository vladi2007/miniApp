<script setup lang="ts">

</script>
<template>
    <layout :active_nav="'organization_settings'">
        <form class="org_form">
            <div class="org_form_input">
                <div class="org_form_input_title">
                    Название организации:
                </div>
                <textarea class="org_form_input_input" placeholder="Название"></textarea>

            </div>
            <div class="org_form_input">
                <div class="org_form_input_title">
                    Описание организации:
                </div>
                <textarea class="org_form_input_input"placeholder="Описание" ></textarea>


            </div>
            <div class="org_form_input_button">
                Сохранить изменения
            </div>
        </form>
    </layout>
</template>
<style>
@media (max-width:1918px),
(max-height:1078px) {
    .org_form {
        margin-top: calc((25 / 832) * 100dvh);
        margin-left: calc(327/1280*100dvw);
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);
        width: calc((378 / 1280) * 100dvw);;
    }
    .org_form_input {
    display: flex;
    flex-direction: column;
    gap: calc((10 / 832) * 100dvh);
    margin-bottom: calc((10 / 832) * 100dvh);;
}

 .org_form_input > textarea{
    min-height: calc((42 / 832) * 100dvh);;
    border-radius: calc((8 / 832) * 100dvh);;
    border: calc((1.5 / 832) * 100dvh) solid #E0E0E0;;
    padding-left:calc(12/1280*100dvw);
    padding-top:calc((12 / 832) * 100dvh);;  line-height: calc((18 / 832) * 100dvh); 
    box-sizing: border-box;
    vertical-align: middle;


    font-family: Lato;
font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: clamp(10px, calc(16 / 1280 * 100dvw), 32px);
        letter-spacing: clamp(0.1px, calc(16 / 100 / 1280 * 100dvw), 0.32px);

 }
.org_form_input_button{ width: calc((165 / 1280) * 100dvw);;
    margin-left: auto;;color:#6AB23D;cursor: pointer;
}
}

@media (min-width:1918px) and (min-height:1078px) {
       .org_form {
        margin-top: 25px;;
        margin-left: 327px;;
        font-family: "Lato", sans-serif;
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 0.16px;;
        width:378px;;
    }
    .org_form_input {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;;
}

 .org_form_input > textarea{
    min-height: 42px;;;
    border-radius: 8px;;
    border: 1.5px solid #E0E0E0;;
    padding-left:12px;
    padding-top:12px;;;  line-height: 18px; 
    box-sizing: border-box;
    vertical-align: middle;


    font-family: Lato;
font-family: "Lato", sans-serif;
        font-weight: 400;
        font-size: 16px;;
        letter-spacing: 0.16px;;

 }
.org_form_input_button{width:165px;;;
    margin-left: auto;;color:#6AB23D;cursor: pointer;
}
}

textarea {
    resize: none;
}
</style>