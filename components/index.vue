<script setup>
const json = say_hello("куча пенисов упирается мне в лицо");

const json2 = say_hello("к123уча пенисов упирается мне в лицо");
</script>

<template>
  <pre class="huy">
    <!-- Проверяем, что json.value существует, прежде чем выводить -->
    {{ json }}
    {{ json2 }}
  </pre>
</template>

<style>
.huy{background-color: aqua; color: black;}
</style>
