import api from "./api"

/* export const getAllRoomType = async (page: number, limit: number) => {
    const res = await api.get(`/roomtype?page=${page}&limit=${limit}`)
    return res.data
} */

export const getRoomTypeById = async (id: string) => {
    const res = await api.get(`/roomtype/${id}`)
    return res.data
}

/* export const getAllRoomType = async (page: number, limit: number, group?: string, sort?: string) => {
    const res = await api.get(`/roomtype?group=${group}&sort=${sort}&page=${page}&limit=${limit}`)
    return res.data
} */

export const getAllRoomType = async (page: number, limit: number, group?: string, sort?: string) => {
    const res = await api.get("/roomtype", {
        params: {
            page,
            limit,
            group,
            sort
        }
    });

    return res.data;
};


export const createRoomType = async (data: any) => {
    const res = await api.post("/roomtype/create", data)
    return res.data
}

export const generateRoomTypeDesc = async (data: any) => {
    const res = await api.post("/roomtype/ai/generate", data)
    return res.data
}

export const updateRoomType = async (id: string, data: any) => {
    const res = await api.put(`/roomtype/update/${id}`, data)
    return res.data
}

export const deleteRoomType = async (id: string) => {
    const res = await api.delete(`/roomtype/delete/${id}`);
    return res.data;
};