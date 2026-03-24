import type { AxiosInstance } from "axios"

// обертка, которая прокидывает ошибку через try catch
export async function safeRequest<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    throw error
  }
}
