export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const {id} = query;
const config = useRuntimeConfig().public
  const apiBase =config.apiBase
  try {
    // Тип явно указываем
    const response = await fetch(
      `${apiBase}/api/interactivities/is_running/${id}?x_key=super-secret-key`
    );
    

    const data = await response.json();
    return { success: true, data };
  } 
  catch (error) {
    return { success: false, error };
  }
});
