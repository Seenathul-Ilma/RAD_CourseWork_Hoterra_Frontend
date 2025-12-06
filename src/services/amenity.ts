import api from "./api"

export const getAllAmenity = async (page: number, limit: number) => {
    const res = await api.get(`/service?page=${page}&limit=${limit}`)
    return res.data
}

export const createAmenity = async (data: any) => {
    const res = await api.post("/service/create", data)
    return res.data
}

export const generateAmenityDesc = async (data: any) => {
    const res = await api.post("/service/ai/generate", data)
    return res.data
}

export const updateAmenity = async (id: string, data: any) => {
    const res = await api.put(`/service/update/${id}`, data)
    return res.data
}

export const deleteAmenity = async (id: string) => {
    const res = await api.delete(`/service/delete/${id}`);
    return res.data;
};