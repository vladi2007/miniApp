<script>
useHead(
    {
        script: [
            {
                src: 'https://telegram.org/js/telegram-web-app.js?57', defer: true
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