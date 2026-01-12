import axiosConfig from "./api"

type registerDataType = {
    firstname: string    // firstName: firstName
    lastname: string
    email: string
    phone: string
    password: string
    role: string
    token?: string | null
}


export const refreshAccessToken = async (refreshToken: string) => {
    const res = await axiosConfig.post("/api/v1/auth/refresh", { refreshToken: refreshToken})
    return res.data
}

export const register = async (data: registerDataType) => {
    const res = await axiosConfig.post("/api/v1/auth/register", data)
    return res.data
}

export const login = async (email:string, password: string) => {
    const res = await axiosConfig.post("/api/v1/auth/login", {email, password})
    return res.data
}

export const getMyDetail = async () => {
    const res = await axiosConfig.get("/api/v1/auth/me")
    return res.data
}

export const staffRegister = async (data: registerDataType) => {
    const res = await axiosConfig.post("/api/v1/auth/staff/register", data)
    return res.data
}