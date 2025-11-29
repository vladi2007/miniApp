export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event);
    if (!form) return { success: false, error: "Пустые данные" };
   
    const telegramField = form.find((f) => f.name === "telegram_id");
    const textField = form.find((f) => f.name === "text") || "";
    const interactiveFields = form.find((f) => f.name === "interactive_id");
    const fileField = form.find((f) => f.name === "file");
    let interactiveList;
    interactiveList = JSON.parse(interactiveFields.data.toString());
       console.log(textField.data.toString()==="")
    const fd = new FormData();

    fd.append("telegram_id", telegramField.data.toString());
    fd.append("text", textField.data.toString());
   
    for (const id of interactiveList) {
      fd.append("interactive_id", String(id));
    }

    if (fileField) {
      const blob = new Blob([fileField.data], {
        type: fileField.type || "application/octet-stream",
      });
      const file = new File([blob], fileField.filename || "file.bin", {
        type: fileField.type || "application/octet-stream",
      });
      fd.append("file", file);
    }

    // Отправка на внешний API
    const xKey = "super-secret-key";

    const response = await fetch(
      `https://carclicker.ru/api/broadcasts/send?x_key=${xKey}`,
      {
        method: "POST",
        body: fd,
      }
    );

    const textResp = await response.text();
    let data;
    try {
      data = JSON.parse(textResp);
    } catch {
      data = { raw: textResp };
    }

    if (!response.ok) {
      console.error("Ошибка внешнего API:", response.status, data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Ошибка в /api/broadcasts/send:", err);
    return { success: false, error: String(err) };
  }
});
