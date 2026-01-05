import api from "./api"

/* export const getAllRoom = async (page: number, limit: number) => {
    const res = await api.get(`/room?page=${page}&limit=${limit}`)
    return res.data
} */

/* export const getAllRoomsByRoomType = async (id: string, page: number, limit: number, floor?:number, availability?: string, sort?: string) => {
    const res = await api.get(`room/roomtype/${id}?floor=${floor}&availability=${availability}&sort=${sort}&page=${page}&limit=${limit}`)
    return res.data
} */

export const getAllRoomsByRoomType = async (
    id: string, 
    page: number, 
    limit: number, 
    //search?: string, 
    group?: string, 
    sort?: string
) => {
    const res = await api.get(`/api/v1/room/roomtype/${id}`, {
        params: {
            page,
            limit,
            //search,
            group,
            sort
        }
    });

    return res.data;
};


export const createRoom = async (data: any) => {
    const res = await api.post("/api/v1/room/create", data)
    return res.data
}


export const updateRoom = async (id: string, data: any) => {
    const res = await api.put(`/api/v1/room/update/${id}`, data)
    return res.data
}


export const deleteRoom = async (id: string) => {
    const res = await api.delete(`/api/v1/room/delete/${id}`);
    return res.data;
};