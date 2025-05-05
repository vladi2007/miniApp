import { ref, onMounted } from 'vue';


export function say_hello(name = '') {
// Создаем реактивную переменную с начальным значением в виде пустого объекта
    const json = ref({ message: '' });

    onMounted(async () => {
    try {
        // Делаем асинхронный запрос
        const res = await fetch(`https://thingproxy.freeboard.io/fetch/https://carclicker.ru/hello/${name}`);
        const data = await res.json();
        console.log(data.message)
        // Сохраняем данные в реактивную переменную
        json.value.message = data.message;// Защищаем от пустого ответа
    } catch (error) {
        // В случае ошибки, сохраняем ошибку в json
        console.error(error);
        
    }
    });
    
    return json;
}


