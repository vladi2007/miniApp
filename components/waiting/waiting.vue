<script>
import Description from '/components/waiting/description';  // Путь может отличаться в зависимости от структуры проекта
import active from '/components/waiting/active_users';
export default {
    components: {
        Description,
        active // Регистрация компонента
    },
};

</script>

<template>
    <div class="participant_waiting">
        <div class="grey"></div>

        <div class="logo">
            <img src="/images/waiting/Clik.svg" />
            <img src="/images/waiting/Group.svg" />
            <img src="/images/waiting/Vector_88.svg" class="fixed" />
        </div>

        <div class="description">
            <div class="grey-line"></div>
            <div class="description-content">
                <p>Ждём пользователей, скоро начнём.</p>
                <active></active>
                <description></description>

            </div>

        </div>

    </div>
</template>

<style>
@import url("~/assets/css/waiting.scss");
</style>
