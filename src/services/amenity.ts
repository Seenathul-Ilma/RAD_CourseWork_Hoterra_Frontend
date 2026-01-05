import api from "./api"

export const getAllAmenity = async (page: number, limit: number) => {
    const res = await api.get(`/api/v1/service?page=${page}&limit=${limit}`)
    return res.data
}

export const createAmenity = async (data: any) => {
    const res = await api.post("/api/v1/service/create", data)
    return res.data
}

export const generateAmenityDesc = async (data: any) => {
    const res = await api.post("/api/v1/service/ai/generate", data)
    return res.data
}

export const updateAmenity = async (id: string, data: any) => {
    const res = await api.put(`/api/v1/service/update/${id}`, data)
    return res.data
}

export const deleteAmenity = async (id: string) => {
    const res = await api.delete(`/api/v1/service/delete/${id}`);
    return res.data;
};