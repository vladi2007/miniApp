<script>
useHead(
    {
        script: [
            {
                src: 'https://telegram.org/js/telegram-web-app.js?', defer: true
            }
        ]
    }
)

    
</script>

<template>
    <div>
         <ClientOnly>
            <slot >

            </slot>
         </ClientOnly>
    </div>
</template>


<style>

</style>