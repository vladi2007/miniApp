export function useScoreQuestion(currentQuestion){
const score = ref(1); // Изначальное значение баллов

function validateScore() {
    if (score.value < 1) {
        score.value = 1;
    } else if (score.value > 5) {
        score.value = 5;
    }

    currentQuestion.value.question.score = score.value;
}
return {score, validateScore}
}