<template>
    <div class="header">
            <img src="/public/images/interactive_editor/logo.svg" id="logo_header" />
        </div>
    </template>


<style>

@media (max-width:1918px), (max-height:1078px){
    .header {
    width: 100dvw;
    height: calc((71 / 832) * 100dvh);
    background-color: #853CFF;
    display: flex;
    align-items: center;
   
}

#logo_header {
    width: calc((123/1280) * 100dvw);
    height: calc((50 / 832) * 100dvh);
    margin-left: auto;
    margin-right: calc((40.29/1280) * 100dvw);
}
}


@media (min-width:1920px) and (min-height:1080px){
    .header {
    width: 100dvw;
    height: 71px;
    background-color: #853CFF;
    display: flex;
    align-items: center;
}

#logo_header {
    width: 123px;
    height: 50px;
    margin-left: auto;
    margin-right: 165.3px;
}
}
</style>