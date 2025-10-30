export function useAnswerQuestion(currentQuestion){
    const getAnswerCount = (type) => {
    if (type === 'text') {
        return [{ text: '', is_correct: true }]; // Для типа 'text' один ответ и он правильный по умолчанию
    } else {
        return Array(3).fill({ text: '', is_correct: false }); // Для других типов 3 ответа
    }
}
function deleteAnswer(index) {
    const question = currentQuestion.value?.question;
    if (!question || !question.answers) return;
    if (question.type === 'many' && question.answers.length < 3) {
        return;
    }
    else {
        question.answers.splice(index, 1);
    }

}
function toggleCorrect(index) {
    const type = currentQuestion.value.question.type;
    const answers = currentQuestion.value.question.answers;

    if (type === 'one') {
        // Снимаем флаг со всех, кроме выбранного
        answers.forEach((a, i) => a.is_correct = i === index);
    } else if (type === 'many') {
        // Переключаем только текущий
        answers[index].is_correct = !answers[index].is_correct;
    }
}

function getIconSrc(type, isCorrect) {
    if (type === 'one') {
        return isCorrect
            ? "/images/interactive_editor/answer_circle_pick.svg"
            : "/images/interactive_editor/answer_circle.svg";
    }
    if (type === 'many') {
        return isCorrect
            ? "/images/interactive_editor/answer_square_picked.svg"
            : "/images/interactive_editor/answer_square_gray.svg";
    }
    return ''; // Для text ничего не показываем
}
// Функция для добавления нового ответа
function addAnswer() {
    const question = currentQuestion.value?.question;

    if (!question || !question.answers) return;

    // Добавление нового ответа в зависимости от типа вопроса
    if ((question.type === 'one' || question.type === 'many') && question.answers.length < 5) {
        // Для 'one' и 'many' добавляем новый ответ без is_correct
        question.answers.push({ text: '', is_correct: false });
    } else if (question.type === 'text' && question.answers.length < 3) {
        // Для 'text' добавляем один правильный ответ
        question.answers.push({ text: '', is_correct: true });
    }
}

const limit_answers = computed(() => {
    const question = currentQuestion.value?.question;

    if (!question || !question.answers) return false;

    // Для типов 'one' и 'many' лимит 5 ответов
    if (question.type === 'one' || question.type === 'many') {
        return question.answers.length >= 5;
    }

    // Для типа 'text' лимит 3 ответа
    if (question.type === 'text') {
        return question.answers.length >= 3;
    }

    return false;
});

return  {getAnswerCount,deleteAnswer , toggleCorrect, getIconSrc, addAnswer,limit_answers}
}