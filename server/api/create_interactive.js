export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const form = await readMultipartFormData(event);
  

  const telegramId = Number(query.telegram_id);
  const xKey = "super-secret-key";

  if (!telegramId || Number.isNaN(telegramId)) {
    return { success: false, error: "Некорректный telegram_id" };
  }

  try {
    // 1️⃣ Собираем нужные поля из form
    const interactiveField = form.find((f) => f.name === "interactive");
    const imageFiles = form.filter((f) => f.name === "images");

    if (!interactiveField) {
      return { success: false, error: "Поле 'interactive' не найдено" };
    }

    // 2️⃣ Парсим JSON интерактива
    let interactive;
    try {
      interactive = JSON.parse(interactiveField.data.toString());
    } catch (err) {
      console.error("Ошибка парсинга интерактива:", err);
      return { success: false, error: "Некорректный JSON интерактива" };
    }

    // 3️⃣ Формируем новый FormData для внешнего API
    const formData = new FormData();
    formData.append("telegram_id", String(telegramId));
    formData.append("interactive", JSON.stringify(interactive));

    for (const f of imageFiles) {
      const blob = new Blob([f.data], { type: f.type });
      const file = new File([blob], f.filename || "image.png", {
        type: f.type,
      });
      formData.append("images", file);
    }



    // 4️⃣ Отправляем запрос на внешний API
    const response = await fetch(
      `https://devvoshod08.ru/api/interactivities/?x_key=${xKey}`,
      {
        method: "POST",
        body: formData,
      }
    );

    // 5️⃣ Обрабатываем ответ
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error("Ошибка от API:", response.status, data);
      return { success: false, error: data };
    }

    return { success: true, data:data.interactive_id };
  } catch (error) {
    console.error("Ошибка при отправке интерактива:", error);
    return { success: false, error: String(error) };
  }
});
