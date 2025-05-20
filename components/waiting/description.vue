
<script setup lang="ts">
const props = defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="waiting_description">
    <div class="waiting_desc-content">
      <div class="waiting_interactive-title">{{ title }}</div>
      <div class="waiting_interactive-description">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<style>
.waiting_description{
  width: 680px;
  margin-top: 87px;
}
.waiting_desc-content{
display: flex;
  flex-direction: column;       /* Элементы — в столбик */
  align-items: center;          /* Центрирование по горизонтали */
  justify-content: center;      /* Центрирование по вертикали (если нужно) */
  height: 100%;                 /* Нужно для вертикального центрирования */
  
}
.waiting_interactive-title{
  font-family: 'Lato';
  font-size: 40px;
  line-height: 24px;
  font-weight: 700;
  width: 565px;
  padding-top:63px;
  vertical-align:middle;

}
.waiting_interactive-description{
  margin-top:30px;
  height: 152px;
  width: 587px;;
  
}
.waiting_interactive-description > p{
  text-align: left;font-family: 'Lato';
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
}

</style>
