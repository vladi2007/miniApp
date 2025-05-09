export default defineEventHandler(async (event) => {
  const { param } = event.context.params
  const response = await fetch(`https://carclicker.ru/hello/${param}`)
  const data = await response.json()
  
  return data
})
