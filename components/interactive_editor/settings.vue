<script setup>
const form = ref({
    title: '123',
    description: '123',
    target_audience: '123',
    location: '123',
    responsible_full_name: '123',
    answer_duration: 10,
    discussion_duration: 5,
    countdown_duration: 5,
    questions: [
        {
            question: {
                type: 'one',
                image: '',
                score: 1,
                position: 0,
                text: '',
                answers: [{ text: '', is_correct: false }, { text: '', is_correct: false }, { text: '', is_correct: false }]
            }
        },

    ]
})

const active_step = ref("main")

function take_step(value) {
    active_step.value = value
}
const currentQuestionIndex = ref(0);

// Проверка: все ли поля заполнены (текстовые поля не пустые, числовые > 0)
const isFormComplete = computed(() => {
    return (
        form.value.title.trim() &&
        form.value.description.trim() &&
        form.value.target_audience.trim() &&
        form.value.location.trim() &&
        form.value.responsible_full_name.trim() &&
        form.value.answer_duration > 0 &&
        form.value.discussion_duration > 0 &&
        form.value.countdown_duration > 0
    )
})

const errors = ref({
    title: false,
    description: false,
    target_audience: false,
    location: false,
    responsible_full_name: false,
    answer_duration: false,
    discussion_duration: false,
    countdown_duration: false,
})
function validateForm() {
    errors.value.title = !form.value.title.trim();
    errors.value.description = !form.value.description.trim();
    errors.value.target_audience = !form.value.target_audience.trim();
    errors.value.location = !form.value.location.trim();
    errors.value.responsible_full_name = !form.value.responsible_full_name.trim();
    errors.value.answer_duration = !(form.value.answer_duration > 0);
    errors.value.discussion_duration = !(form.value.discussion_duration > 0);
    errors.value.countdown_duration = !(form.value.countdown_duration > 0);

    return Object.values(errors.value).every(v => v === false);
}
watch(form, (newVal) => {
    for (const key in newVal) {
        if (
            typeof newVal[key] === 'string' && newVal[key].trim() ||
            typeof newVal[key] === 'number' && newVal[key] > 0
        ) {
            errors.value[key] = false;
        }
    }
}, { deep: true })
const visibleCount = 3
const visibleStartIndex = ref(0)

const visibleQuestions = computed(() => {
    const total = form.value.questions.length;
    const result = [];

    for (let i = 0; i < visibleCount; i++) {
        const idx = visibleStartIndex.value + i;
        if (idx < total) {
            result.push(form.value.questions[idx]);
        }
    }
    return result;
})

const currentQuestion = computed(() => form.value.questions[currentQuestionIndex.value])
watch(currentQuestionIndex, (newIndex) => {
    const total = form.value.questions.length
    if (newIndex < visibleStartIndex.value) {
        visibleStartIndex.value = newIndex
    } else if (newIndex >= visibleStartIndex.value + visibleCount) {
        visibleStartIndex.value = newIndex - visibleCount + 1
    }
})

function addQuestion() {
    if (form.value.questions.length < 20) {
        form.value.questions.push({
            question: {
                type: 'one',
                image: '',
                score: '1',
                position: form.value.questions.length,
                text: '',
                answers: Array(3

                ).fill(null).map(() => ({ text: '', is_correct: false }))
            }
        })
        currentQuestionIndex.value = form.value.questions.length - 1;

        // Сдвигаем видимую область, если нужно
        if (currentQuestionIndex.value >= visibleStartIndex.value + visibleCount) {
            visibleStartIndex.value = currentQuestionIndex.value - visibleCount + 1;
        }
    }

}
function deleteQuestion() {
    // Проверяем, что в списке больше одного вопроса
    if (form.value.questions.length > 1) {
        // Удаляем вопрос по текущему индексу
        form.value.questions.splice(currentQuestionIndex.value, 1);

        // Сдвигаем индексы оставшихся вопросов
        form.value.questions.forEach((q, index) => {
            q.question.position = index;  // Обновляем позицию каждого вопроса
        });

        // Если удалённый вопрос был последним, сдвигаем индекс текущего вопроса на предыдущий
        if (currentQuestionIndex.value >= form.value.questions.length) {
            currentQuestionIndex.value = form.value.questions.length - 1;
        }
    }
}

function scrollUp() {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
    }

    if (visibleStartIndex.value > currentQuestionIndex.value) {
        visibleStartIndex.value = currentQuestionIndex.value;
    }
}


function scrollDown() {
    const maxIndex = form.value.questions.length - 1;
    if (currentQuestionIndex.value < maxIndex) {
        currentQuestionIndex.value++;
    }

    const maxStartIndex = Math.max(0, form.value.questions.length - visibleCount);
    if (currentQuestionIndex.value >= visibleStartIndex.value + visibleCount) {
        visibleStartIndex.value = Math.min(currentQuestionIndex.value, maxStartIndex);
    }
}
function handleWheelScroll(event) {
    // Проверка направления прокрутки
    if (event.deltaY < 0) {
        // Если прокрутка вверх, переходим к предыдущим вопросам
        scrollUp();
    } else if (event.deltaY > 0) {
        // Если прокрутка вниз, переходим к следующим вопросам
        scrollDown();
    }
}

const imageUploaded = ref(false)
watch(currentQuestionIndex, (newIndex, oldIndex) => {
    if (oldIndex !== undefined) {
        imageUploaded.value = false; // Сбрасываем статус для предыдущего вопроса
    }
    // Проверяем, есть ли изображение у нового вопроса
    imageUploaded.value = form.value.questions[newIndex].question.image !== '';
});
async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file.name) {

        form.value.questions[currentQuestionIndex.value].question.image = file.name;
        imageUploaded.value = true;
    } else {
        form.value.questions[currentQuestionIndex.value].question.image = '';
        imageUploaded.value = false;
    }

    console.log(form.value.questions)
}

function removeImage() {
    form.value.questions[currentQuestionIndex.value].question.image = '';
    imageUploaded.value = false;
}

const isOpen = ref(false); // Состояние, открыто ли меню
const options = ['Один из списка', 'Ввод текста', 'Несколько из списка']; // Возможные опции

// Маппинг типов вопросов
const typeMap = {
    one: 'Один из списка',
    text: 'Ввод текста',
    many: 'Несколько из списка',
};
// Функция для отображения текста
const selectedText = computed(() => typeMap[form.value.questions[currentQuestionIndex.value].question.type]);
// Переключаем состояние открытия/закрытия списка


function toggleDropdown() {
    isOpen.value = !isOpen.value;
}
function selectOption(option) {
    // Находим тип в маппинге по значению опции
    const type = Object.keys(typeMap).find(key => typeMap[key] === option);

    // Сохраняем текущий тип, чтобы сравнить его с новым
    const previousType = form.value.questions[currentQuestionIndex.value].question.type;

    // Если тип не изменился (выбран тот же тип), просто закрываем всплывающий список
    if (previousType === type) {
        isOpen.value = false; // Закрываем список
        return;
    }

    // Обновляем тип вопроса
    form.value.questions[currentQuestionIndex.value].question.type = type;

    // Обработка изменения типа вопроса
    if (previousType === 'one' || previousType === 'many') {
        if (type === 'one' || type === 'many') {
            // Смена с 'one' на 'many' или с 'many' на 'one' => оставляем массив, убираем правильные ответы
            form.value.questions[currentQuestionIndex.value].question.answers.forEach(answer => {
                answer.is_correct = false; // Убираем правильные ответы
            });

            // Дополняем массив до 3 элементов, если их меньше
            while (form.value.questions[currentQuestionIndex.value].question.answers.length < 3) {
                form.value.questions[currentQuestionIndex.value].question.answers.push({ text: '', is_correct: false });
            }
        } else if (type === 'text') {
            // Смена с 'one' или 'many' на 'text' => очищаем массив и добавляем один ответ
            form.value.questions[currentQuestionIndex.value].question.answers = [{ text: '', is_correct: true }];
        }
    } else if (previousType === 'text') {
        if (type === 'one' || type === 'many') {
            // Смена с 'text' на 'one' или 'many' => очищаем массив и возвращаем 3 пустых ответа с is_correct: false
            form.value.questions[currentQuestionIndex.value].question.answers = [
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false }
            ];
        }
    }

    // Закрываем список после изменения типа
    isOpen.value = false; // Закрываем выпадающий список
}





const score = ref(1); // Изначальное значение баллов

// Ваш метод updateScore
function updateScore() {
    // Ограничиваем значение от 1 до 5
    if (score.value < 1) {
        score.value = 1;
    } else if (score.value > 5) {
        score.value = 5;
    }
}


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
    if (question.type === 'many' && question.answers.length < 3){
        return;
    }
    else{
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
    if ((question.type === 'one' || question.type === 'many') && question.answers.length <5) {
        // Для 'one' и 'many' добавляем новый ответ без is_correct
        question.answers.push({ text: '', is_correct: false });
    } else if (question.type === 'text' && question.answers.length <3) {
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

</script>

<template>
    <div class="settings">
        <div class="settings_nav">
            <div class="settings_nav_main" :class="{ settings_active_nav: active_step === 'main' }"
                @click='take_step("main")'>
                Общие настройки
            </div>

            <div class="settings_nav_questions_button"
                :class="{ settings_active_nav: active_step === 'questions' && isFormComplete, settings_disabled_nav: !isFormComplete }"
                @click="validateForm() && take_step('questions')">
                Вопросы
            </div>
            <img src="/public/images/interactive_editor/lock.svg" id="lock" v-if="!isFormComplete" />
            <div class="settings_nav_questions_info" v-if="!isFormComplete">
                <div> Будет доступно после заполнения <br />общих настроек</div>
            </div>


        </div>
        <div class="settings_main" v-if="active_step === 'main'">
            <div class="settings_main_first">
                <div class="settings_input"><label>Название интерактива*<textarea v-model="form.title"
                            placeholder="Название" maxlength="40" :class="{ 'field-error': errors.title }" /></label>
                </div>

                <div class="settings_input"> <label>Описание интерактива*<textarea v-model="form.description"
                            id="description_input" placeholder="Описание" maxlength="115"
                            :class="{ 'field-error': errors.description }" /></label></div>
                <div class="settings_input"> <label>Место проведения интерактива*<textarea v-model="form.location"
                            placeholder="ИРИТ-РТФ" maxlength="40" :class="{ 'field-error': errors.location }" /></label>
                </div>
                <div class="settings_input"> <label>Целевая аудитория участников*<textarea
                            v-model="form.target_audience" placeholder="Абитуриенты" maxlength="40"
                            :class="{ 'field-error': errors.target_audience }" /></label></div>
                <div class="settings_input"> <label>ФИО ведущего*<textarea v-model="form.responsible_full_name"
                            placeholder="Сергеев Сергей Сергеевич" maxlength="40"
                            :class="{ 'field-error': errors.responsible_full_name }" /></label></div>
            </div>

            <div class="settings_main_second">
                <div class="settings_input"> <label>Время ответа (сек.)*<textarea type="number"
                            v-model.number="form.answer_duration" maxlength="2"
                            :class="{ 'field-error': errors.answer_duration }" /></label></div>
                <div class="settings_input"> <label>Время на показ ответа (сек.)*<textarea type="number"
                            v-model.number="form.discussion_duration" maxlength="2"
                            :class="{ 'field-error': errors.discussion_duration }" /></label></div>
                <div class="settings_input"> <label>Обратный отсчет перед стартом (сек.)*<textarea type="number"
                            v-model.number="form.countdown_duration" maxlength="2"
                            :class="{ 'field-error': errors.countdown_duration }" /></label></div>
            </div>

            <div class="settings_go_to_questions" :class="{ disabled: !isFormComplete }"
                @click="validateForm() && take_step('questions')">
                <span class="settings_go_to_questions_text">Далее</span>
                <img src="/public/images/interactive_editor/goto.svg" id="goto" />
            </div>
        </div>
        <div class="settings_questions" v-if="active_step === 'questions'">
            <div class="settings_questions_nav">
                <img src="/public/images/interactive_editor/question_up.svg" id="up" @click="scrollUp()" />
                <div class="question_buttons_list" @wheel="handleWheelScroll">
                    <div v-for="(q, idx) in visibleQuestions" :key="q.question.position"
                        @click="currentQuestionIndex = visibleStartIndex + idx" class="quest-nav-button"
                        :class="{ active: currentQuestionIndex === (visibleStartIndex + idx) }">
                        {{ visibleStartIndex + idx + 1 }}
                    </div>

                </div>
                <img src="/public/images/interactive_editor/question_down.svg" id="down" @click="scrollDown()" />
                <div class="question_button_plus" @click="addQuestion()"><img
                        src="/public/images/interactive_editor/question_plus.svg" id="plus" /></div>
            </div>
            <div class="settings_questions_editor">
                <div class="question_header">
                    <div class="question_header_text">
                        <span> Вопрос {{ currentQuestionIndex + 1 }}</span>
                        <img src="/public/images/interactive_editor/delete.svg" id="question_edit_delete"  @click="deleteQuestion"/>
                    </div>
                </div>

                <!-- Вопрос -->
                <div class="input-group">

                    <textarea v-model="currentQuestion.question.text" maxlength="100" placeholder="Вопрос*"
                        id="question_text"></textarea>
                </div>

                <!-- В вашем шаблоне, для отображения имени файла -->
                <div class="custom-file-upload" :class="{ 'file-uploaded': imageUploaded }"
                    @click="!imageUploaded && $refs.fileInput.click()">

                    <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileChange" />

                    <template v-if="imageUploaded">
                        <!-- Выводим имя файла, если оно загружено -->
                        <span>{{ currentQuestion.question.image }}</span>
                        <img src="/public/images/interactive_editor/delete.svg" @click.stop="removeImage"
                            class="remove-icon" />
                    </template>

                    <template v-else>
                        <span style="color: #1D1D1D; ">Загрузите изображение</span>
                        <span style="margin-left: auto; color:#A9A9A9; letter-spacing: calc((16px / 100));">Не
                            выбрано</span>
                    </template>
                </div>


                <!-- Тип вопроса и Балл -->
                <div class="input-group_row">
                    <div class="input-group_type">
                        <!-- Кастомный выпадающий список -->
                        <div class="custom-dropdown" @click="toggleDropdown">
                            <div class="custom-dropdown-selected">{{ selectedText }}</div>
                            <div class="custom-arrow" :class="{ open: isOpen }">
                                <img src="/public/images/interactive_editor/list_close.svg" v-if="isOpen" />
                                <img src="/public/images/interactive_editor/list_open.svg" v-if="!isOpen" />
                            </div>
                        </div>

                        <!-- Список опций -->
                        <div class="custom-dropdown-options" v-if="isOpen">
                            <div class="custom-dropdown-options_header">Тип вопроса</div>
                            <div class="custom-dropdown-option-list">
                                <div class="custom-dropdown-option" v-for="(option, index) in options" :key="index"
                                    @click="selectOption(option)">



                                    <img class="custom-dropdown-circle" src="/public/images/interactive_editor/full.svg"
                                        v-if="typeMap[currentQuestion.question.type] === option" />
                                    <img class="custom-dropdown-circle"
                                        src="/public/images/interactive_editor/circle.svg"
                                        v-if="typeMap[currentQuestion.question.type] !== option" />


                                    <div class="custom-dropdown-text">{{ option }}</div>
                                </div>

                            </div>

                        </div>
                    </div>

                    <!-- Поле для ввода баллов с "Баллы:" внутри -->
                    <div class="input-group_score">
                        <div>Баллы:</div>
                        <input type="text" v-model="score" @input="updateScore"  />
                    </div>

                </div>

                <div class="answers-section">
                    <div v-for="(answer, index) in currentQuestion.question.answers" :key="index" class="answer-item">
                        <div class="answer-input-wrapper">
                            <!-- Обёртка с иконкой и инпутом -->
                            <div class="custom-answer-input">
                                <!-- Показать иконку, если тип не 'text' -->
                                <div v-if="currentQuestion.question.type !== 'text'" class="custom-dropdown-circle"
                                    @click="toggleCorrect(index)">
                                    <img :src="getIconSrc(currentQuestion.question.type, answer.is_correct)" />
                                </div>

                                <!-- Инпут, убираем отступ слева для типа 'text' -->
                                <input class="custom-input-field" type="text" v-model="answer.text"
                                    :placeholder="currentQuestion.question.type === 'text' ? 'Поле для ввода правильного ответа' : 'Поле для ввода'"
                                    maxlength="30" :class="{ 'text-type': currentQuestion.question.type === 'text' }" />
                            </div>

                            <!-- Удаление ответа -->
                            <img v-if="currentQuestion.question.answers.length > 1" class="delete-answer-icon"
                                src="public/images/interactive_editor/delete_answer.svg" alt="Удалить ответ"
                                @click="deleteAnswer(index)" />
                        </div>
                    </div>
                    <div class="answers-section-add_question" @click="addAnswer()" v-if="!limit_answers">
                            <img class="add_question_icon"
                 src="/public/images/interactive_editor/add_question.svg">
                    </div>
                </div>



            </div>

            <div class="settings_questions_mobile">
                
            </div>
        </div>
    </div>

</template>

<style>
* {
    margin: 0;
    padding: 0;
}

.settings {
    height: calc((640 / 832) * 100dvh);
    width: calc((1114 / 1280) * 100dvw);

    margin-top: calc((28 / 832) * 100dvh);
    position: relative;

}

.settings_nav {
    margin-left: calc((112 / 1280) * 100dvw);
    z-index: 0;
}

.settings_nav_main {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #A9A9A9;
    vertical-align: middle;
    cursor: pointer;
    height: calc((26 / 832) * 100dvh);
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    letter-spacing: 0.2px;
    margin-top: calc((8 / 832) * 100dvh);
    letter-spacing: 0.2px;
    ;
    height: calc((26 / 832) * 100dvh);


}


.settings_nav {
    display: flex;
    height: calc((53/832)*100dvh);
}




.settings_nav_questions_button {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    height: calc((26 / 832) * 100dvh);
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    color: #A9A9A9;
    width: max-content;
    letter-spacing: 0.2px;
    height: calc((26 / 832) * 100dvh);
    vertical-align: middle;
    cursor: pointer;
    margin-left: calc((20 / 1280) * 100dvw);
    margin-top: calc((8 / 832) * 100dvh);
}

.settings_nav_main:hover,
.settings_nav_questions_button:hover {
    color: #1D1D1D;
}

.settings_nav_main:not(.settings_active_nav):hover::after,
.settings_nav_questions_button:not(.settings_active_nav):hover::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 0px;
    background-color: #853CFF;
}

.settings_nav_questions_info {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #7D7D7D;
    margin-left: calc((44 / 1280) * 100vw);
    vertical-align: middle;
    height: calc((53 / 832) * 100dvh);
    border-radius: calc((8 /832) * 100dvh);

}

.settings_nav_questions_info>div {

    padding-left: calc((10 / 1280) * 100dvw);
    padding-top: calc((5 / 832) * 100dvh);
    padding-right: calc((10 / 1280) * 100dvw);
    padding-bottom: calc((5 / 832) * 100dvh);
    font-size: clamp(10px, calc((14 / 1280) * 100dvw), 24px);
    letter-spacing: 0.2px;
    height: calc((43/832) * 100dvh);
    line-height: calc((22/832)*100dvh);
    background-color: #E0E0E0;
    border-radius: 8px;
    ;
}

.settings_active_nav {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    color: #1D1D1D;

    vertical-align: middle;
    display: grid;
    width: fit-content;
}

.settings_active_nav::after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    /* Толщина линии */

    /* Цом как у текста */
    margin-top: 0px;
    background-color: #853CFF;
    /* Цвет для активного состояния */
}


#lock {

    height: calc((24 / 832) * 100dvh);
    height: calc((24 / 1280) * 100dvw);
    margin-top: calc((8/832)*100dvh);

}

.settings_line {}

.settings_main {
    margin-left: calc((112 / 1280) * 100dvw);
    margin-top: calc((20 / 832) * 100dvh);
    width: calc((1114 / 1280) * 100dvw);
    height: calc((568 / 832) * 100dvh);
    display: grid;
    grid-template-columns: calc((510 / 1280) * 100dvw) calc((510 / 1280) * 100dvw);
    gap: calc((30 / 1280) * 100dvw);
    position: relative;
}

.settings_main_first {

    height: calc((567 / 832) * 100dvh);

}

.settings_main_second {

    height: calc((567 / 832) * 100dvh);
}

.settings_input {
    margin-bottom: calc((5 / 832) * 100dvh);
}


.settings_input label {
    display: flex;
    flex-direction: column;
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;

    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    line-height: 120%;
    letter-spacing: 0.2px;
    ;
    vertical-align: middle;

}

.settings_input textarea {
    width: calc((510/1280) * 100dvw);
    height: calc((56 / 832) * 100dvh);
    margin-top: calc((2 / 832) * 100dvh);
    vertical-align: middle;
    ;
}

.field-error {
    border: 1.5px solid red !important;
}

.settings_input textarea::placeholder {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    width: calc((480/1280) * 100dvw);
    height: calc((26 / 832) * 100dvh);


    vertical-align: middle;

}

.settings_input textarea {
    width: calc((510 / 1280) * 100dvw);
    height: calc((56 / 832) * 100dvh);
    padding: calc((15 / 832) * 100dvh) calc((15 / 1280) * 100dvw);
    box-sizing: border-box;
    margin-top: calc((2 / 832) * 100dvh);

    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    line-height: 1.2;

    color: #1d1d1d;


    resize: none;
    overflow-x: hidden;
    overflow-y: hidden;
    /* Убираем лишнее */
    border: none;
    outline: none;
    border-radius: 8px;
    ;
    border: 1.5px solid #E0E0E0;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE и Edge */
}

.settings_input textarea::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Edge */
}

#description_input {
    height: calc((131 / 832) * 100dvh);
}

.settings_go_to_questions {
    position: absolute;
    right: 0;
    bottom: 0;
    height: calc((24 / 832) * 100dvh);
    width: auto;
    padding: 0 calc((10 / 1280) * 100dvw);

    cursor: pointer;

    display: flex;
    align-items: center;
    /* ← выравниваем по центру */
    justify-content: center;
    gap: calc((10 / 1280) * 100dvw);
    /* расстояние между текстом и стрелкой */
}

.settings_go_to_questions_text {
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: clamp(10px, calc((20 / 1280) * 100dvw), 34px);
    color: #7D7D7D;
    line-height: 1;
    /* минимальный отступ по вертикали */
}

#goto {
    height: calc((18 / 832) * 100dvh);
    width: calc((10 / 1280) * 100dvw);
    object-fit: contain;
    margin-top: calc((4 / 832) * 100dvh);
}

/* Hover */
.settings_go_to_questions:hover .settings_go_to_questions_text {
    color: #1D1D1D;
}

.settings_go_to_questions:hover #goto {
    content: url("/public/images/interactive_editor/goto_active.svg");
    margin-top: calc((4 / 832) * 100dvh);
}

.settings_questions {
    position: relative;

    width: calc((1138 / 1280) * 100dvw);
    height: calc((649 / 832) * 100dvh);
    margin-left: calc((39 / 1280) * 100dvw);
    display: flex;
}

.settings_questions_nav {
    margin-top: calc((21 / 832) * 100dvh);
    width: calc((42 / 1280) * 100dvw);
    height: calc((649 / 832) * 100dvh);
    display: flex;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Центрирует кнопки по горизонтали */



}

.question_buttons_list div {
    width: calc((42 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);

    border-radius: 8px;
    border: 1.52px solid #E0E0E0;
    background-color: #FFFFFF;
    margin-bottom: calc((5 / 832) * 100dvh);
    ;
}


.quest-nav-button {
    display: flex;
    align-items: center;
    /* вертикальное центрирование */
    justify-content: center;
    /* горизонтальное центрирование */
    width: 40px;
    /* или другая подходящая ширина */
    height: 40px;
    /* или аналогично */
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);

    line-height: 120%;
    letter-spacing: 1%;
    text-align: center;
    vertical-align: middle;

}

.quest-nav-button.active {
    border: 1.5px solid #853CFF
        /* или другой фиолетовый */

        /* опционально — текст */
}

.question_button_plus {
    width: calc((42 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    position: relative;
    border-radius: 8px;
    border: 1.52px solid #E0E0E0;
    background-color: #FFFFFF;
    margin-top: calc((12 / 832) * 100dvh);
    ;
}

#plus {
    width: calc((35 / 2/ 1280) * 100dvw);
    height: calc((35 / 2 / 832) * 100dvh);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
}

#down {
    width: calc((19/ 1280) * 100dvw);
    height: calc((10 / 832) * 100dvh);
}

#up {
    margin-bottom: calc((5 / 832) * 100dvh);
    width: calc((19/ 1280) * 100dvw);
    height: calc((10 / 832) * 100dvh);
}

.settings_questions_editor {
    width: calc((483 / 1280) * 100dvw);
    height: calc((483 / 832) * 100dvh);
    margin-left: calc((31 / 1280) * 100dvw);
}

.question_header_text {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-style: Medium;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);
    line-height: 120%;
    letter-spacing: 0.1px;

    width: calc((483/ 1280) * 100dvw);
    height: calc((26/ 832) * 100dvh);
    margin-bottom: calc((10 / 832) * 100dvh);

}

#question_text {
    border-radius: 8px;
    border: 1.5px solid #E0E0E0;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
    box-sizing: border-box;
    letter-spacing: 0.1px;
    height: calc((74/ 832) * 100dvh);

}

#question_text::placeholder {

    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);

}

.input-group textarea {
    overflow: auto;
    /* Чтобы прокрутка была доступна, но полоски скрыты */
    resize: none;
    width: calc((483/ 1280) * 100dvw);
    height: calc((74/ 832) * 100dvh);
}

/* Скрыть полоски прокрутки, но оставить прокручивание доступным */
.input-group textarea::-webkit-scrollbar {
    width: 0px;
    /* Скрыть вертикальную полоску */
    height: 0px;
    /* Скрыть горизонтальную полоску */
}

.input-group textarea::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* Делаем скроллбар невидимым */
}

.input-group textarea::-webkit-scrollbar-track {
    background-color: transparent;
    /* Делаем трек скроллбара невидимым */
}

#question_edit_delete {
    width: calc((14 / 1280) * 100dvw);
    height: calc((18 / 832) * 100dvh);
}

.settings_questions_mobile {
    margin-left: calc((227 / 1280) * 100dvw);
    background-color: aquamarine;
    width: calc((355 / 1280) * 100dvw);
    height: calc((684 / 832) * 100dvh);
    /* ВАЖНО: поднимаем выше и немного залезаем на навигацию */


    /* Опционально — если нужно быть поверх */
    position: absolute;
    z-index: 2;
    right: 0px;
    bottom: 0px;
}

.custom-file-upload {
    width: calc((483 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
    font-family: "Lato", sans-serif;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 34px);
    border: 1.5px solid #E0E0E0;
    border-radius: 8px;
    background-color: white;
    color: #1D1D1D;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: calc((15 / 832) * 100dvh);
    margin-bottom: calc((15 / 832) * 100dvh);
}

.file-status {
    margin-top: calc((5 / 832) * 100dvh);
    font-family: "Lato", sans-serif;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 24px);
    color: #7D7D7D;
}

.file-uploaded {
    border-color: #6AB23D !important;
    /* Зелёный */
    color: #1D1D1D;
    color: #6AB23D;
    margin-bottom: calc((15 / 832) * 100dvh);
}

.remove-icon {
    width: calc((14 / 1280) * 100dvw);
    height: calc((18 / 832) * 100dvh);
    margin-left: auto;
    cursor: pointer;
}


.input-group_type select {
    appearance: none;
    /* Убираем стандартную стрелку */
    -webkit-appearance: none;
    /* Для Safari */
    -moz-appearance: none;
    /* Для Firefox */
    width: calc((287 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    border-radius: 8px;
    border: 1.5px solid #E0E0E0;
    box-sizing: border-box;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
}

.input-group_row {
    display: flex;
    width: calc((483 / 1280) * 100dvw);
    align-items: center;
    height: calc((42 / 832) * 100dvh);


}



/* Кастомный выпадающий список */
.custom-dropdown {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc((287 / 1280) * 100dvw);
    border-radius: 8px;
    border: 1.5px solid#E0E0E0;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    height: calc((42 / 832) * 100dvh);

    letter-spacing: 0.1px;
    vertical-align: middle;
    box-sizing: border-box;
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);

}


.custom-arrow {
    width: calc((17 / 1280) * 100dvw);
    height: calc((8 / 832) * 100dvh);
    display: flex;

}



/* Стили для списка */
.custom-dropdown-options {
    position: absolute;
    background-color: white;
    border: 1.5px solid #E0E0E0;
    border-radius: 8px;
    width: calc((287 / 1280) * 100dvw);
    height: calc((146 / 832) * 100dvh);
    margin-top: calc((15 / 832) * 100dvh);
    z-index: 10;
    /* Добавляем высокий z-index */
}

.custom-dropdown-option-list {
    margin-top: calc((10 / 832) * 100dvh);
    margin-left: calc((15 / 1280) * 100dvw);
    z-index: 2;
}

.custom-dropdown-options_header {
    font-family: "Lato", sans-serif;
    font-weight: 600;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    line-height: 120%;
    letter-spacing: 0.1px;
    vertical-align: middle;
    margin-top: calc((7 / 832) * 100dvh);
    margin-left: calc((41 / 1280) * 100dvw);
}
.custom-dropdown-selected{

}
.custom-dropdown-option {
    display: flex;
    align-items: center;


    margin-top: calc((5 / 832) * 100dvh);
    width: calc((245 / 1280) * 100dvw);
    height: calc((26 / 832) * 100dvh);

    cursor: pointer;

}



.custom-dropdown-circle {
    width: calc((18 / 1280) * 100dvw);
    height: calc((18 / 832) * 100dvh);
    display: flex;
    cursor: pointer;
    justify-content: center;


}

.custom-dropdown-circle>img {
    width: calc((16 / 1280) * 100dvw);
    height: calc((16 / 832) * 100dvh);
}

.custom-dropdown-text {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    line-height: 120%;
    letter-spacing: 0.1px;
    vertical-align: middle;
    margin-left: calc((10 / 1280) * 100dvw);

    display: flex;
    align-items: center;

}

.input-group_score {

    display: flex;
    align-items: center;
    margin-left: calc((58 / 1280) * 100dvw);
}

.input-group_score>input {
    margin-left: calc((10 / 1280) * 100dvw);
    width: calc((73 / 1280) * 100dvw);
    height: calc((42 / 832) * 100dvh);
    border: 1.5px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 8px;
    box-sizing: border-box;
    padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);

}

.input-group_score>div {
    font-family: "Lato", sans-serif;
    font-weight: 400;
    font-style: Regular;
    font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
    width: calc((55 / 1280) * 100dvw);

    line-height: 120%;
    letter-spacing: 1%;
    vertical-align: middle;

}

.answers-section {
    margin-top: calc((15 / 832) * 100dvh);
    z-index: 0;
}


/* Общие стили для инпута */
.answer-item-input {
  flex-grow: 1;
  font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
  width: calc((483 / 1280) * 100dvw);
  height: calc((42 / 832) * 100dvh);
  border: 1.5px solid #E0E0E0;
  box-sizing: border-box;
  border-radius: 8px;
  color: #1D1D1D;
  padding: calc((12 / 832) * 100dvh) calc((12 / 1280) * 100dvw);
}

.answer-item-input::placeholder {
  font-family: "Lato", sans-serif;
  font-weight: 400;
  font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
  color: #A9A9A9;
  vertical-align: middle;
  padding: calc((38 / 832) * 100dvh) 0;
  letter-spacing: calc((16px / 100));
}

.answer-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: calc((8 / 832) * 100dvh);
}

/* Удаление ответа */
.delete-answer-icon {
  position: absolute;
  width: calc((35 / 2 / 1280) * 100dvw);
  height: calc((35 / 2 / 832) * 100dvh);
  
  right: calc((14 / 1280) * 100dvw);
  cursor: pointer;
}

/* Обертка с инпутом и картинкой */
.custom-answer-input {
  display: flex;
  align-items: center;
  width: 100%;
  height: calc((42 / 832) * 100dvh);
  border: 1.5px solid #E0E0E0;
  border-radius: 8px;
  padding-left: calc((12 / 1280) * 100dvw);
  box-sizing: border-box;
  background-color: white;
}

/* Для типа "text" убираем отступ слева */
.custom-answer-input.text-type {
  padding-left: 0;
}

/* Стили для иконки, показываем ее только если тип не "text" */
.custom-dropdown-circle {
  width: calc((16 / 1280) * 100dvw);
  height: calc((16 / 832) * 100dvh);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.custom-dropdown-circle img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Для инпута текстового типа (когда класс "text-type") убираем отступ слева */
.custom-input-field {
  flex: 1;
  border: none;
  outline: none;
  padding-left: calc((10 / 1280) * 100dvw); /* Для обычных типов вопросов */
  font-family: "Lato", sans-serif;
  font-size: clamp(10px, calc((16 / 1280) * 100dvw), 32px);
  height: 90%;
  box-sizing: border-box;
  max-width: 95%;
 
}

/* Для типа "text" убираем отступ слева */
.custom-input-field.text-type {
  padding-left: 0px;;
}


.answers-section-add_question{
    width: calc((42 / 1280) * 100dvw);
  height: calc((42 / 832) * 100dvh);
  border: 1.5px solid #E0E0E0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add_question_icon{
    width: calc((30 / 1280) * 100dvw);
  height: calc((30 / 832) * 100dvh);

}
</style>