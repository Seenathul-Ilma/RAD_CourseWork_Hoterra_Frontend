import api from "./api"

/* export const getAllRoom = async (page: number, limit: number) => {
    const res = await api.get(`/room?page=${page}&limit=${limit}`)
    return res.data
} */

export const getAllRoomsByRoomType = async (id: string, page?: number, limit?: number, floor?:number, availability?: string, sort?: string) => {
    const res = await api.get(`room/roomtype/${id}?floor=${floor}&availability=${availability}&sort=${sort}&page=${page}&limit=${limit}`)
    return res.data
}