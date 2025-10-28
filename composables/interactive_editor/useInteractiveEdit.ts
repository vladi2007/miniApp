import {
  FORM_STORAGE_KEY,
  CURRENT_INDEX_KEY,
  STEP_KEY,
  IMAGE_STATE_KEY,
} from "~/constants/interactiveKeys";
export function useEdit(
  mode?: string,
  userId?,
  id?,
  form,
  currentQuestionIndex,
  imageUrls
) {
  async function getOriginalFileNameFromMeta(url: string): Promise<string> {
    if (!url) return "";
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (!response.ok) return decodeURIComponent(url.split("/").pop() || "");
      
      const meta = response.headers.get("x-amz-meta-original-filename");
      return meta || decodeURIComponent(url.split("/").pop() || "");
    } catch (err) {
      return decodeURIComponent(url.split("/").pop() || "");
    }
  }

  async function loadFromBackend(userId) {
    if (!id || (mode !== "edit" && mode !== "duplicate")) return;

    try {
      const data = await $fetch(`/api/get_interactive`, {
        method: "GET",
        query: { telegram_id: userId.value, id: id.value },
      });

      // Преобразуем полученные данные в plain-структуру
      const plain = JSON.parse(JSON.stringify(data));

      form.value = {
      title: plain.title ?? "",
      description: plain.description ?? "",
      target_audience: plain.target_audience ?? "",
      location: plain.location ?? "",
      responsible_full_name: plain.responsible_full_name ?? "",
      answer_duration: plain.answer_duration ?? 10,
      discussion_duration: plain.discussion_duration ?? 5,
      countdown_duration: plain.countdown_duration ?? 5,
      questions: await Promise.all(
        (plain.questions ?? []).map(async (q: any, index: number) => {
          const imageUrl = q.image || "";
          let uploadedFileName = "";

          if (imageUrl) {
            uploadedFileName = await getOriginalFileNameFromMeta(imageUrl);
          }

          return {
            question: {
              type: q.type || "one",
              image: imageUrl,
              uploadedFileName: uploadedFileName, 
              score: q.score || 1,
              position: index + 1,
              text: q.text || "",
              answers:
                q.answers?.map((a: any) => ({
                  text: a.text || "",
                  is_correct: a.is_correct || false,
                })) ?? [],
            },
          };
        })
      ),
    };
      currentQuestionIndex.value = 0;
      imageUrls.value = data.questions.map((q: any) => q.image || null);
    } catch (err) {
      window.Telegram?.WebApp?.showAlert?.(
        "Не удалось загрузить данные интерактива."
      );
    }
  }
  return { loadFromBackend, getOriginalFileNameFromMeta };
}
