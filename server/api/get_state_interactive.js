export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const {id} = query;

  try {
    // Тип явно указываем
    const response = await fetch(
      `https://voshod08.ru/api/interactivities/is_running/${id}?x_key=super-secret-key`
    );
    

    const data = await response.json();
    return { success: true, data };
  } 
  catch (error) {
    return { success: false, error };
  }
});
