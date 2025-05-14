// import { createError } from 'h3'
// import crypto from 'node:crypto'

// export default defineEventHandler(async (event) => {
//   const body = await readBody(event)
//   const { initData } = body

//   const BOT_TOKEN = '7751838357' // Укажи свой токен от BotFather

//   const params = new URLSearchParams(initData)
//   const receivedHash = params.get('hash')
//   console.log(receivedHash)
//   console.log(params)
//   if (!receivedHash) {
//     throw createError({ statusCode: 400, statusMessage: 'No hash provided' })
//   }

//   params.delete('hash')
//   params.delete('signature')
//   const dataCheckstr = '7751838357:'
//   const dataCheckArr = []

//   for (const [key, value] of params.entries()) {
//     dataCheckArr.push(`${key}=${value}`)
//   }

//   dataCheckArr.sort()
//   const dataCheckString = dataCheckstr + dataCheckArr.join('\n')

//   const secretKey = crypto
//     .createHash('sha256')
//     .update(BOT_TOKEN)
//     .digest()
//     console.log(params)
//   const computedHash = crypto
//     .createHmac('sha256', "40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec")
//     .update(dataCheckString)
//     .digest('hex')
//     console.log(computedHash)
//   if (computedHash !== receivedHash) {
//     throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
//   }

//   let dataCheckStrings = `7751838357:WebAppData`;

//   // Step 2: Add a line feed character
//   dataCheckStrings += '\n';

//   // Step 3: Sort the data fields alphabetically and add them
//   const keys = Object.keys(params).filter(key => key !== 'hash' && key !== 'signature');
//   keys.sort();
  
//   keys.forEach(key => {
//     dataCheckStrings += `${key}=${data[key]}\n`;
//   });
//   console.log(dataCheckStrings)
  
//   // валидный пользователь
//   const user = {
//     id: params.get('user_id'),
//     first_name: params.get('first_name'),
//     last_name: params.get('last_name'),
//     username: params.get('username'),
//     photo_url: params.get('photo_url'),
//   }

//   return {
//     authenticated: true,
//     user,
//   }
// })
import { createError } from 'h3'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { initData } = body

  const BOT_TOKEN = '7751838357' // Укажи свой токен от BotFather

  const params = new URLSearchParams(initData)
  const receivedHash = params.get('hash')
  console.log(receivedHash)
  console.log(params)

  if (!receivedHash) {
    throw createError({ statusCode: 400, statusMessage: 'No hash provided' })
  }

  // Удаляем hash и signature
  params.delete('hash')
  params.delete('signature')

  const dataCheckstr = `${BOT_TOKEN}:` // Формируем правильную строку
  const dataCheckArr = []

  // Собираем параметры в строку
  for (const [key, value] of params.entries()) {
    dataCheckArr.push(`${key}=${value}`)
  }

  dataCheckArr.sort() // Сортируем по ключу
  const dataCheckString = dataCheckstr + dataCheckArr.join('\n')

  // Создаем ключ для HMAC
  const secretKey = crypto
    .createHash('sha256')
    .update(BOT_TOKEN)
    .digest()

  const computedHash = crypto
    .createHmac('sha256', "e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d")
    .update(dataCheckString)
    .digest('hex')

  console.log(computedHash)

  if (computedHash !== receivedHash) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  // Проверка данных пользователя
  const user = {
    id: params.get('user_id'),
    first_name: params.get('first_name'),
    last_name: params.get('last_name'),
    username: params.get('username'),
    photo_url: params.get('photo_url'),
  }

  // Возвращаем ответ
  return {
    authenticated: true,
    user,
  }
})
