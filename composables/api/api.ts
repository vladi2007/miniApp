import axios from "axios";
const runtimeConfig = useRuntimeConfig()
export const api = axios.create({
    baseURL: runtimeConfig.app.baseURL,
    withCredentials: true,
})
