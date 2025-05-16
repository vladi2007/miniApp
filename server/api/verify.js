import crypto from "crypto";

export default defineEventHandler(async (event) => {

    const body = await readBody(event)

    const unsafeData = new URLSearchParams(body.unsafeData)
    const hash = unsafeData.get("hash")

    const contact = body.contactData
    const order = body.order
    let res = true
    const dataToCheck = []

    const {telegramBotToken} = useRuntimeConfig()

    unsafeData.sort()
    unsafeData.forEach((val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`))

    const secret = crypto
        .createHmac("sha256", "WebAppData")
        .update(telegramBotToken)
        .digest();
    
    const _hash = crypto
        .createHmac("sha256", secret)
        .update(dataToCheck.join("\n"))
        .digest("hex");
    
    if(hash == _hash) {
        return {status: "success"};
    }
    else{
      return {status: "not_success"};
    }


  
})

