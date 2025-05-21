<script setup lang="ts">
const props = defineProps<{
  onStatus: (status: string) => void
  
}>()


</script>

<template>
  <div class="question_leader_buttons_fon">
    <div class = "question_leader_buttons">
        <div><button class = "goto_end" @click="onStatus('end')">
            Завершить
        </button></div>
       <div> <button class="pause"@click="onStatus('pause')">
            Пауза
        </button></div>
       <div> <button class="continue" @click="onStatus('continue')">
            Продолжить
        </button></div>
    </div>
  </div>
</template>

<style>
.question_leader_buttons_fon{
    
 
    background-color: white;
    width: 685px;
    height: 78px;;
    border-radius: 26px;;

    
  
}
.question_leader_buttons {
  
    display: flex;
    
}
.goto_end{font-family: "Lato";margin-left: 15px;;  margin-top: 20px;
    font-weight: 500;
    font-size: 32px;
    vertical-align: middle;
    background-color: #F0436C;
    width: 210px;
    height: 40px;;
    border-radius: 5px;;
    border: #F0436C;
    color: white;
}
.pause{font-family: "Lato";margin-left: 43px;;  margin-top: 20px;
    font-weight: 500;
    font-size: 32px;
    vertical-align: middle;
    background-color:#6AB23D;
    width: 150px;
    height: 40px;;
    border-radius: 5px;;
    border: #6AB23D;
    color: white;
}
.continue{font-family: "Lato";margin-left: 42px;;  margin-top: 20px;
    font-weight: 500;
    font-size: 32px;
    vertical-align: middle;
    background-color: #853CFF;
    color: white;
    width: 210px;
    height: 40px;;
    border-radius: 5px;;
    border: #853CFF;
}
</style>
