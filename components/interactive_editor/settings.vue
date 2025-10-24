<script setup>
import { deviceOptions, VueDevice } from 'vue-devices'
import question from '../question/check_qestion.vue'
import { saveToDeviceStorage, loadFromDeviceStorage, clearDeviceStorage } from '~/utils/deviceStorage'
import check_qestion from '../question/check_qestion.vue'
const FORM_STORAGE_KEY = 'interactive_form_draft'
const CURRENT_INDEX_KEY = 'interactive_current_index'
const SCROLL_POSITION_KEY = 'question_nav_scroll_position'
const STEP_KEY = 'interactive_editor_step'
const IMAGE_STATE_KEY = 'interactive_image_state'

const currentQuestionIndex = ref(0);
const form = ref({
    title: '',
    description: '',
    target_audience: '',
    location: '',
    responsible_full_name: '',
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
const route = useRouter()
const active_step = ref("main")
onMounted(async () => {
    const savedForm = loadFromDeviceStorage(FORM_STORAGE_KEY)
    console.log('Loaded form from storage:', savedForm)

    if (savedForm) {
        form.value = savedForm
    }

    const savedIndex = loadFromDeviceStorage(CURRENT_INDEX_KEY)
    console.log('Loaded index from storage:', savedIndex)

    if (typeof savedIndex === 'number') {
        currentQuestionIndex.value = savedIndex


    }
    const storedStep = loadFromDeviceStorage(STEP_KEY)

    if (storedStep !== null) {
        active_step.value = storedStep
        console.log('Загружен step из хранилища:', storedStep)
    } else {
        console.log('Step не найден в хранилище или невалиден:', storedStep)
    }

    const imageState = loadFromDeviceStorage(IMAGE_STATE_KEY)
    if (imageState && imageState.index === currentQuestionIndex.value) {
        const currentImage = form.value.questions[currentQuestionIndex.value]?.question.image
        if (currentImage && currentImage !== '') {
            imageUploaded.value = true
            uploadedFileName.value = imageState.name
        }
    }
})

watch(form, (newForm) => {
    console.log('Saving form to storage', newForm)
    saveToDeviceStorage(FORM_STORAGE_KEY, newForm)
}, { deep: true })

watch(currentQuestionIndex, (newIndex) => {
    console.log('Saving index to storage', newIndex)
    saveToDeviceStorage(CURRENT_INDEX_KEY, newIndex)
})

watch(active_step, (newStep) => {
    saveToDeviceStorage(STEP_KEY, newStep.toString())
})

function take_step(value) {
    active_step.value = value
}


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

watch(
    () => form.value.questions,
    (newQuestions) => {
        newQuestions.forEach((qWrap, index) => {
            const q = qWrap.question;

            // Если ошибка уже была, проверяем — нужно ли её снять
            if (questionErrors.value[index]) {
                const error = questionErrors.value[index];

                // Текст вопроса
                if (q.text.trim()) {
                    error.text = false;
                }

                // Баллы
                if (+q.score >= 1 && +q.score <= 5) {
                    error.score = false;
                }

                // Тип вопроса
                if (['one', 'many', 'text'].includes(q.type)) {
                    error.type = false;
                }

                // Ответы
                q.answers.forEach((a, i) => {
                    if (a.text.trim()) {
                        error.answers[i] = false;
                    }
                });

                // Корректные ответы
                if (q.type === 'one') {
                    const correct = q.answers.filter(a => a.is_correct);
                    if (correct.length === 1) {
                        error.correctAnswers = false;
                    }
                }

                if (q.type === 'many') {
                    const correct = q.answers.filter(a => a.is_correct);
                    if (correct.length >= 2 && correct.length <= 5) {
                        error.correctAnswers = false;
                    }
                }
            }
        });
    },
    { deep: true }
);


const visibleCount = 3
const visibleStartIndex = ref(0)
const showSavePopup = ref(false)
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
watch(currentQuestionIndex, (newIndex) => {
  saveToDeviceStorage(CURRENT_INDEX_KEY, newIndex)

  const image = form.value.questions[newIndex]?.question.image
  const imageState = loadFromDeviceStorage(IMAGE_STATE_KEY)

  if (image && image !== '') {
    imageUploaded.value = true
    uploadedFileName.value =
      imageState && imageState.index === newIndex ? imageState.name : 'изображение.png'
  } else {
    imageUploaded.value = false
    uploadedFileName.value = ''
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
        questionErrors.value[form.value.questions.length - 1] = {
            text: false,
            score: false,
            type: false,
            answers: [],
            correctAnswers: false
        };
        currentQuestionIndex.value = form.value.questions.length - 1;

        // Сдвигаем видимую область, если нужно
        if (currentQuestionIndex.value >= visibleStartIndex.value + visibleCount) {
            visibleStartIndex.value = currentQuestionIndex.value - visibleCount + 1;
        }
    }

}
function deleteQuestion() {
    if (form.value.questions.length > 1) {
        form.value.questions.splice(currentQuestionIndex.value, 1);

        // Обновляем позиции
        form.value.questions.forEach((q, index) => {
            q.question.position = index;
        });

        if (currentQuestionIndex.value >= form.value.questions.length) {
            currentQuestionIndex.value = form.value.questions.length - 1;
        }

        // Обновляем visibleStartIndex, чтобы сохранялось 3 видимых
        const maxStartIndex = Math.max(0, form.value.questions.length - visibleCount);
        if (visibleStartIndex.value > maxStartIndex) {
            visibleStartIndex.value = maxStartIndex;
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
})
const uploadedFileName = ref(''); // <-- просто локально храним имя для UI

async function handleFileChange(event) {
    const file = event.target.files[0]
    if (file) {
        uploadedFileName.value = file.name
        const reader = new FileReader()

        reader.onload = () => {
            form.value.questions[currentQuestionIndex.value].question.image = reader.result // base64
            imageUploaded.value = true

            // 🟢 Сохраняем состояние
            saveToDeviceStorage(IMAGE_STATE_KEY, {
                index: currentQuestionIndex.value,
                name: file.name
            })
        }

        reader.readAsDataURL(file)
    } else {
        form.value.questions[currentQuestionIndex.value].question.image = ''
        uploadedFileName.value = ''
        imageUploaded.value = false

        // 🟢 Удаляем состояние
        saveToDeviceStorage(IMAGE_STATE_KEY, null)
    }
}

const isImagePopupOpen = ref(false); // Показывает/скрывает попап
function openImagePopup() {
    isImagePopupOpen.value = true;
}
function closeImagePopup() {
    isImagePopupOpen.value = false;
}

function removeImage() {
    form.value.questions[currentQuestionIndex.value].question.image = ''
    uploadedFileName.value = ''
    imageUploaded.value = false
    saveToDeviceStorage(IMAGE_STATE_KEY, null)
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



// Реф на dropdown DOM-элемент
const dropdownRef = ref(null)

function handleClickOutside(event) {
    if (isOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})


function toggleDropdown() {
    isOpen.value = !isOpen.value;
}
function selectOption(option) {
    const type = Object.keys(typeMap).find(key => typeMap[key] === option);
    const previousType = form.value.questions[currentQuestionIndex.value].question.type;

    if (previousType === type) {
        isOpen.value = false;
        return;
    }

    // Обновляем тип вопроса
    form.value.questions[currentQuestionIndex.value].question.type = type;

    // ❗ Обнуляем ошибки при смене типа
    if (questionErrors.value[currentQuestionIndex.value]) {
        questionErrors.value[currentQuestionIndex.value].correctAnswers = false;

        const answersLength = form.value.questions[currentQuestionIndex.value].question.answers.length;
        questionErrors.value[currentQuestionIndex.value].answers = Array(answersLength).fill(false);
    }

    // Обновляем ответы в зависимости от типа
    if (previousType === 'one' || previousType === 'many') {
        if (type === 'one' || type === 'many') {
            form.value.questions[currentQuestionIndex.value].question.answers.forEach(answer => {
                answer.is_correct = false;
            });
            while (form.value.questions[currentQuestionIndex.value].question.answers.length < 3) {
                form.value.questions[currentQuestionIndex.value].question.answers.push({ text: '', is_correct: false });
            }
        } else if (type === 'text') {
            form.value.questions[currentQuestionIndex.value].question.answers = [{ text: '', is_correct: true }];
        }
    } else if (previousType === 'text') {
        if (type === 'one' || type === 'many') {
            form.value.questions[currentQuestionIndex.value].question.answers = [
                { text: '', is_correct: false },
                { text: '', is_correct: false },
                { text: '', is_correct: false }
            ];
        }
    }

    isOpen.value = false;
}





const score = ref(1); // Изначальное значение баллов

function validateScore() {
    if (score.value < 1) {
        score.value = 1;
    } else if (score.value > 5) {
        score.value = 5;
    }

    currentQuestion.value.question.score = score.value;
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
const questionErrors = ref([])

function validateQuestions() {
    active_step.value
    let isValid = true;
    questionErrors.value = [];

    for (let i = 0; i < form.value.questions.length; i++) {
        const q = form.value.questions[i].question;
        const error = {
            text: false,
            score: false,
            type: false,            // ✅ добавили
            answers: [],
            correctAnswers: false
        };

        if (!q.text.trim()) {
            error.text = true;
            isValid = false;
        }

        if (!(+q.score >= 1 && +q.score <= 5)) {
            error.score = true;
            isValid = false;
        }

        // ✅ проверка типа
        if (!q.type || !['one', 'many', 'text'].includes(q.type)) {
            error.type = true;
            isValid = false;
        }

        q.answers.forEach((a, index) => {
            if (!a.text.trim()) {
                error.answers[index] = true;
                isValid = false;
            } else {
                error.answers[index] = false;
            }
        });

        if (q.type === 'one') {
            const correct = q.answers.filter(a => a.is_correct);
            if (correct.length !== 1) {
                error.correctAnswers = true;
                isValid = false;
            }
        }

        if (q.type === 'many') {
            const correct = q.answers.filter(a => a.is_correct);
            if (correct.length < 2 || correct.length > 5) {
                error.correctAnswers = true;
                isValid = false;
            }
        }

        questionErrors.value[i] = error;

        // Переключаемся на первый вопрос с ошибкой
        if (!isValid) {
            currentQuestionIndex.value = i;
            break;
        }
    }
    if (!isValid && active_step.value === 'main') {
        active_step.value = 'questions';
    }
    return isValid;
}
defineExpose({
    handleSave
})
function handleSave() {
    const isMainValid = validateForm();
    showSavePopup.value = false
    if (!isMainValid) {
        active_step.value = 'main';

        return false;
    }

    const isQuestionsValid = validateQuestions();

    if (!isQuestionsValid) {
        active_step.value = 'questions';
        return false;
    }
    route.push('/leader/interactives')
    console.log(form.value)
    clearDeviceStorage(FORM_STORAGE_KEY)
    clearDeviceStorage(CURRENT_INDEX_KEY)
    clearDeviceStorage(STEP_KEY)
    return true;
}


function handleStart() {
    const isMainValid = validateForm();
    showSavePopup.value = false
    if (!isMainValid) {
        active_step.value = 'main';

        return false;
    }

    const isQuestionsValid = validateQuestions();

    if (!isQuestionsValid) {
        active_step.value = 'questions';
        return false;
    }
    
    console.log(form.value)
    console.log("Интерактив запущен");
}
function getIconSrcWithValidation(type, isCorrect, hasError, index, question) {
    const errorIcons = {
        one: "/images/interactive_editor/answer_circle_red.svg",
        many: "/images/interactive_editor/answer_square_red.svg",
    };

    // Тип "один из списка" — всё просто
    if (type === 'one') {
        if (hasError) {
            return errorIcons.one;
        }

        return isCorrect
            ? "/images/interactive_editor/answer_circle_pick.svg"
            : "/images/interactive_editor/answer_circle.svg";
    }

    // Тип "несколько из списка"
    if (type === 'many') {
        const correctCount = question.answers.filter(a => a.is_correct).length;

        if (hasError && !isCorrect && correctCount < 2) {
            // Ошибка: слишком мало выбранных, и этот конкретный не выбран — показываем красный
            return errorIcons.many;
        }

        // Показываем обычную иконку в остальных случаях
        return isCorrect
            ? "/images/interactive_editor/answer_square_picked.svg"
            : "/images/interactive_editor/answer_square_gray.svg";
    }

    return '';
}
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
                            v-model.number="form.answer_duration" maxlength="2" placeholder="10"
                            :class="{ 'field-error': errors.answer_duration }" /></label></div>
                <div class="settings_input"> <label>Время на показ ответа (сек.)*<textarea type="number" placeholder="5"
                            v-model.number="form.discussion_duration" maxlength="2"
                            :class="{ 'field-error': errors.discussion_duration }" /></label></div>
                <div class="settings_input"> <label>Обратный отсчет перед стартом (сек.)*<textarea type="number"
                            placeholder="5" v-model.number="form.countdown_duration" maxlength="2"
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
                        <img src="/public/images/interactive_editor/delete.svg" id="question_edit_delete"
                            @click="deleteQuestion" />
                    </div>
                </div>

                <!-- Вопрос -->
                <div class="input-group">

                    <textarea v-model="currentQuestion.question.text" maxlength="100" placeholder="Вопрос*"
                        id="question_text" :class="{ 'field-error': questionErrors[currentQuestionIndex]?.text }" />

                </div>

                <!-- В вашем шаблоне, для отображения имени файла -->
                <div class="custom-file-upload" :class="{ 'file-uploaded': imageUploaded }"
                    @click="!imageUploaded && $refs.fileInput.click()">

                    <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileChange" />

                    <template v-if="imageUploaded">
                        <!-- показываем только имя файла -->
                        <span>{{ uploadedFileName }}</span>
                        <img src="/public/images/interactive_editor/delete.svg" @click.stop="removeImage"
                            class="remove-icon" />
                    </template>

                    <template v-else>
                        <span style="color: #1D1D1D;">Загрузите изображение</span>
                        <span style="margin-left: auto; color:#A9A9A9;">Не выбрано</span>
                    </template>
                </div>



                <!-- Тип вопроса и Балл -->
                <div class="input-group_row">
                    <div class="input-group_type" ref="dropdownRef">
                        <!-- Кастомный выпадающий список -->
                        <div class="custom-dropdown" @click="toggleDropdown"
                            :class="{ 'field-error': questionErrors[currentQuestionIndex]?.type }">
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
                        <input type="number" v-model.number="score" @change="validateScore()" min="1" max="5"
                            :class="{ 'field-error': questionErrors[currentQuestionIndex]?.score }" />

                    </div>

                </div>

                <div class="answers-section">
                    <div v-for="(answer, index) in currentQuestion.question.answers" :key="index" class="answer-item">
                        <div class="answer-input-wrapper">
                            <!-- Обёртка с иконкой и инпутом -->
                            <div class="custom-answer-input" :class="{
                                'field-error': questionErrors[currentQuestionIndex]?.answers?.[index]
                            }">
                                <!-- Показать иконку, если тип не 'text' -->
                                <div v-if="currentQuestion.question.type !== 'text'" class="custom-dropdown-circle"
                                    @click="toggleCorrect(index)">
                                    <img :src="getIconSrcWithValidation(
                                        currentQuestion.question.type,
                                        answer.is_correct,
                                        questionErrors[currentQuestionIndex]?.correctAnswers,
                                        index,
                                        currentQuestion.question
                                    )" />

                                </div>

                                <input class="custom-input-field" type="text" v-model="answer.text"
                                    :placeholder="currentQuestion.question.type === 'text' ? 'Поле для ввода правильного ответа' : 'Поле для ввода'"
                                    maxlength="30" :class="{
                                        'text-type': currentQuestion.question.type === 'text',
                                    }" />
                            </div>

                            <!-- Удаление ответа -->
                            <img v-if="currentQuestion.question.answers.length > 1" class="delete-answer-icon"
                                src="public/images/interactive_editor/delete_answer.svg" alt="Удалить ответ"
                                @click="deleteAnswer(index)" />
                        </div>
                    </div>
                    <div class="answers-section-add_question" @click="addAnswer()" v-if="!limit_answers">
                        <img class="add_question_icon" src="/public/images/interactive_editor/add_question.svg">
                    </div>
                </div>

                <div class="settings_questions_editor_buttons">
                    <div class="settings_questions_editor_buttons_start" @click="handleStart">
                        Запуск
                    </div>
                    <div class="settings_questions_editor_buttons_save" @click="showSavePopup = true">
                        Сохранить
                    </div>
                </div>

            </div>

            <div class="settings_questions_mobile">
                <VueDevice :device="'iphone-14'" :showHeader="false">
                    <check_qestion :timer="form.answer_duration" :questions_count="form.questions.length"
                        :question="currentQuestion.question.text" :answers="currentQuestion.question.answers"
                        :score="currentQuestion.question.score" :currentIndex="currentQuestionIndex"
                        :type="currentQuestion.question.type" :image="currentQuestion.question.image"></check_qestion>/>

                </VueDevice>



            </div>


        </div>
        <!-- Попап загрузки изображения -->
        <teleport to="body">
            <div class="popup-backdrop" v-if="isImagePopupOpen" @click.self="closeImagePopup">
                <div class="popup-content">
                    <div class="popup-content-header">Добавить файл</div>
                    <div class="popup-content-uploader">
                        <img src="/public/images/interactive_editor/uploader.svg" />
                        <input type="file" accept="image/*" id="fileInput" hidden @change="handleFileChangeAndClose" />
                        <label for="fileInput" class="upload-button">Выбрать файл</label>
                    </div>

                    <button @click="closeImagePopup">Отмена</button>
                </div>
            </div>
        </teleport>
        <div v-if="showSavePopup" class="settings_popup-overlay">
            <div class="settings_popup-content">
                <div class="settings_popup-text">Сохранить интерактив и перейти к списку всех интерактивов?</div>
                <div class="settings_popup-buttons">
                    <button class="settings_popup-btn confirm" @click="handleSave">Да</button>
                    <button class="settings_popup-btn cancel" @click="showSavePopup = false">Нет</button>
                </div>
            </div>
        </div>

    </div>

</template>

<style>
@import url("/assets/css/interactive_editor/settings.scss");
@import url("/assets/css/interactive_editor/settings_media.scss");
</style>