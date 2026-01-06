import api from "./api";

export interface StaffUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
}

export interface StaffResponse {
    message: string;
    data: StaffUser[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Fetch staff users (admin or receptionist)
export const getStaffUsers = async (
    role: "ADMIN" | "RECEPTIONIST",
    page: number = 1,
    limit: number = 10
) => {
    const response = await api.get<StaffResponse>(
        `/staff?role=${role}&page=${page}&limit=${limit}`
    );
    return response.data;
};

// Invite a new staff member
export const inviteStaff = async (email: string, role: "ADMIN" | "RECEPTIONIST") => {
    const response = await api.post("/staff", { email, inviterole: role });
    return response.data;
};

// Delete a staff member
export const deleteStaffUser = async (id: string) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
};
