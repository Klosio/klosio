import axios from "axios"
import { getUserSession } from "~core/session"

export const httpRequest = axios.create({
    baseURL: `${process.env.PLASMO_PUBLIC_SERVER_URL}/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

httpRequest.interceptors.request.use(async (config) => {
    const userSession = await getUserSession()
    if (userSession) {
        config.headers["Authorization"] = `Bearer ${userSession.token}`
    }
    return config
})

httpRequest.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        //console.error(error)
        return Promise.reject(error)
    }
)
