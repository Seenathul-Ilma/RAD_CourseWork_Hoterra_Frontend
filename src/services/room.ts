import api from "./api"

export const createRoom = async (data: any) => {
    const res = await api.post("/room/create", data)
    return res.data
}

export const updateRoom = async (data: any) => {
    const res = await api.post("/room/update", data)
    return res.data
}

export const deleteRoom = async (data: any) => {
    const res = await api.post("/room/delete", data)
    return res.data
}

export const getRoomById = async (data: any) => {
    // Incomplete for now - should complete this
    const res = await api.post("/room/get", data)
    return res.data
}

export const getAllRoom = async (page: number, limit: number) => {
    const res = await api.get(`/room?page=${page}&limit=${limit}`)
    return res.data
}