<script setup >
import interactives from '~/components/interactives/interactives.vue'
import { ref, onMounted } from 'vue'


const my_interactives ={
  interactives_list_conducted: [
    {
      title: "Интересные факты про УрФУ",
      question_count: 20,
      target_audience: "Школьники",
      id: 0,
      date_completed: "19.04.25"
    }
  ],
  interactives_list_not_conducted: [
    {
      title: "Интересные факты про магистратуру ИРИТ-РТФ",
      question_count: 3,
      target_audience: "Студенты 4 курса",
      id: 20,
      date_completed: ""
    }
  ]
}
</script>

<template>
  <div>

    <interactives :interactives_list="my_interactives" />
  </div>
</template>

<style >

</style>
