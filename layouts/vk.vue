<script setup lang="ts">
import bridge from '@vkontakte/vk-bridge';

bridge.send("VKWebAppInit");
bridge.send('VKWebAppGetLaunchParams')
    .then((data) => {
        if (data.vk_app_id) {
            console.log(data)
        }
    })
    .catch((error) => {
        // Ошибка
        console.log(error);
    });
</script>

<template>
    {{ bridge.isEmbedded() }}

    asdsad
    <slot />
</template>
