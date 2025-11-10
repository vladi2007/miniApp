<script setup lang="ts">

// таблица лидеров
const props = defineProps<{
  winners: { position: number, username: string , time:number,score:number}[]
}>()

function formatTime(secondsStr: number): string {
  const seconds = Number(secondsStr)
  if (isNaN(seconds)) return String(secondsStr) // защита от нечисловых значений

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
</script>

<template>
  <div class="winners_table">
    <div class="table">
      <div class="title">
        Лидерборд
      </div>
      <div class="winner_participant_header">
          <span class="position_participant_header">место</span>
          <span class="name_participant_header">игрок</span>
          <span class="time_participant_header">время</span>
           <span class="score_participant_header">балл</span>
        </div>
      <div class="winners_list">
        

        <div v-for="(winner, index) in props.winners" :key="index" class="winner_participant">
          <span class="position_participant">{{ winner.position }}</span>
          <span class="name_participant">{{ winner.username }}</span>
          <span class="time_participant">{{formatTime(winner.time) }}</span>
           <span class="score_participant">{{ winner.score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.winners_list_header{
  display: flex;
}
.winner_participant_header{
  display: flex;
  margin-top: calc((19 / 844) * var(--app-height));
    font-size: clamp(10px, calc((14 / 390) * 100dvw),28px) !important;
letter-spacing:  clamp(0.10px, calc((14 / 100 / 390) * 100dvw),0.28px) !important;
}

.position_participant_header{
  width: calc((47 / 390) * 100dvw);
  margin-left:calc((5 / 390) * 100dvw); ;
  display: flex;
  align-items: center;
  justify-content: center; 

}
.winners_list{
   margin-top: calc((10 / 844) * var(--app-height));
  height: calc((220 / 844) * var(--app-height));
  overflow-y: auto;
  scroll-behavior: smooth;
  box-sizing: border-box;
    scrollbar-width: none;   /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

}

.winners_list::-webkit-scrollbar {
  width: 0px;              /* Chrome/Safari/Edge */
  background: transparent;  /* опционально */
}
.name_participant_header{  margin-left:calc((65 / 390) * 100dvw); ;  width: calc((47 / 390) * 100dvw);
display: flex;
  align-items: center;

}
.score_participant_header{ width: calc((37 / 390) * 100dvw);;margin-left:  calc((2 / 390) * 100dvw);;
  display: flex;
  align-items: center;
  justify-content: center; 
}
.time_participant_header{width: calc((48 / 390) * 100dvw);;margin-left:  calc((106 / 390) * 100dvw);;

 display: flex;
  align-items: center;
  justify-content: center; 
}
.winner_participant{margin:0 auto;

  margin-bottom: calc((10 / 844) * var(--app-height));
  display: flex;
  background-color: #F7F7F7;
  width: calc((350 / 390) * 100dvw);
height: calc((36 / 844) * var(--app-height));

border-radius:  calc((5 / 844) * var(--app-height));
  font-size: clamp(10px, calc((14 / 390) * 100dvw),28px) !important;
letter-spacing:  clamp(0.10px, calc((14 / 100 / 390) * 100dvw),0.28px) !important;
line-height: clamp(10px, calc((24  / 390) * 100dvw),48px) !important;
   
}
.winner_participant:last-child {
  margin-bottom: 0;
}
.position_participant{
  width: calc((14 / 390) * 100dvw);
  margin-left:calc((5 / 390) * 100dvw); ;
  display: flex;
  align-items: center;
  justify-content: center; 
}

.name_participant{  margin-left:calc((14 / 390) * 100dvw); ; width: calc((199 / 390) * 100dvw);
display: flex;
  align-items: center;

}
.score_participant{width: calc((20 / 390) * 100dvw);margin-left:  calc((15 / 390) * 100dvw);;
  display: flex;
  align-items: center;
  justify-content: center; 
}
.time_participant{margin-left:  calc((37 / 390) * 100dvw);;

 display: flex;
  align-items: center;
  justify-content: center; 
}

</style>