<script setup lang="ts">


const props = defineProps<{
    header: string,
    interactives_list: {
        title: string,
        question_count: string,
        target_audience: string,
        id: string,
        date_completed: string
    }[]
    status: string
}
>()
const route= useRouter()
const isEnd = computed(() => props.status === 'end')

function start_interactive(id: string) {
  route.push(`/leader/start/${id}`)
}

function dublicate_interactive(id: string) {
  route.push(`/leader/dublicate/${id}`)
}

function edit_interactive(id: string) {
  route.push(`/leader/edit/${id}`)
}
function gotoTest_leader_interactive(){
    route.push('/leader/123')
}
</script>

<template>
    <div class="interactive_list">
        <div class="interactive_list_header">
            {{ props.header }}
        </div>
        <div class="interactive_list_content">
            <div class ="date" v-if="isEnd">Дата проведения</div>
            <div class="interactive_list_content_list" v-for="interactive in props.interactives_list" :class="{margin:!isEnd}">
                <div class="interactive_description">
                    <div class="interactive_title">
                        {{ interactive.title }}
                    </div>

                    <div class="interactive_question_count">
                        Количество вопросов: {{ interactive.question_count }}
                    </div>
                    <div class="interactive_target_audience">
                        Целевая аудитория: {{ interactive.target_audience }}
                    </div>
                    <div class="interactive_buttons">
                        <div class="interactive_dublicate"   :class="{hidden : isEnd}" >
                            <img src="/images/interactives/dublicate.svg" id="dublicate"/>
                        </div>
                        <div class="interactive_edit" v-if="!isEnd" >
                            <img src="/images/interactives/edit.svg" id="edit" />
                        </div>
                        <div class="interactive_start" v-if="!isEnd">
                            <img src="/images/interactives/start.svg" id="start" @click="gotoTest_leader_interactive()" />
                        </div>
                    </div>

                    <div class ="interactive_date" v-if="isEnd">
                        {{ interactive.date_completed }}
                    </div>

                </div>

            </div>

        </div>

    </div>
</template>

<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}
.hidden{
    position: absolute;

    left: 152px;;
}
.interactive_list {
    margin-left: 26px;
    ;
    width: 1319px;
    height: 703px;
    ;
}

.interactive_list_header {
    font-size: 36px;
    vertical-align: middle;
    font-weight: 700;
    font-family: 'Work Sans', sans-serif;
    color: #A774FC;
}

.interactive_list_content {
    background-color: #853CFF;
    overflow-y: auto;
    width: 1299px;
    height: 626px;
    margin-left: auto;
    margin-top: 35px;
    border-radius: 26px;
    ;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
}

.interactive_list_content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari */
}

.interactive_list_content_list {
    width: 1229px;
    min-height: 155px;
    background-color: white;
    border-radius: 30px;
    ;
    margin: 0 auto;

    margin-top: 9px;
    margin-bottom: 41px;
    ;


}

.interactive_description {
    font-family: 'Lato', sans-serif;
    font-weight: 500;
    width: 600px;
    ;
    font-size: 24px;
    line-height: 32px;
    ;
    letter-spacing: 1px;
    ;
   
    ;
    padding-bottom: 25px;;
    padding-top: 25px;
    margin-left: 38px;
    ;

}

.interactive_title {
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 32px;
    line-height: 32px;

    ;
}

.interactive_question_count {
    margin-top: 24px;
}

.interactive_description {
    position: relative;
}

.interactive_buttons {
    position: absolute;
    top: 64px;
    ;
    display: flex;
    left: 941px;
    ;

}

.interactive_dublicate {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    ;
    background-color: #853CFF;
}

.interactive_edit {
    margin-left: 16px;
    width: 60px;
    border-radius: 5px;
    ;
    height: 60px;
    ;
    background-color: #F0436C;
}

.interactive_start {
    margin-left: 16px;
    width: 60px;
    border-radius: 5px;
    ;
    height: 60px;
    ;
    background-color: #6AB23D;
}

.interactive_dublicate,
.interactive_edit,
.interactive_start {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    display: flex;
    /* ✅ flex для центрирования */
    justify-content: center;
    /* ✅ по горизонтали */
    align-items: center;
    /* ✅ по вертикали */
}

.date{ white-space: nowrap;
        font-family: 'Lato', sans-serif;
        color: white;
        font-weight: 500;
        font-size: 24px;
        line-height: 24px;
        vertical-align: middle;
        letter-spacing: 1px;;
        margin-top:9px;
        margin-left:1051px;
        width: 300px;;
}

.interactive_date{
    position: absolute;
    top:15px;
    left:1004px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 700;
    font-size: 36px;
    vertical-align: middle;
    letter-spacing: 1px;;
    color:#A774FC;
}
.margin{
    margin-top:41px;
}
</style>
