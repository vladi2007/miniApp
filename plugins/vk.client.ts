import bridge from '@vkontakte/vk-bridge';
export default defineNuxtPlugin( (nuxtApp) => {
    bridge.send("VKWebAppInit");
        return {
            provide:{
                bridge: bridge 
            }
        }
});