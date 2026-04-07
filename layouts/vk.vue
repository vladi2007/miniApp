<script setup lang="ts">
const { $bridge } = useNuxtApp()
// console.log(await $bridge.send('VKWebAppGetUserInfo'))
// console.log(await $bridge.send('VKWebAppGetLaunchParams'))


// try {
//     console.log(await $bridge.send('VKWebAppGetPersonalCard',)
//         .then((data) => {
//             if (data) {
//                 console.log(data)
//             }
//         })
//         .catch((error) => {
//             // Ошибка
//             console.log(error);
//         }));
// }

// catch (e) {
//     console.error(e)
// }

// try {
//     console.log(await $bridge.send('VKWebAppGetEmail'))
// }

// catch (e) {
//     console.error(e)
// }

try {
    console.log(await $bridge.send('VKWebAppGetGrantedPermissions'))
}

catch (e) {
    console.log(e)
}

// try {
//     console.log(await $bridge.send(''))
// }

// catch (e) {
//     console.error(e)
// }
</script>

<template>
    <slot />
</template>
