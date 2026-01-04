import api from "./api";

export const createBooking = async (bookingData: {
  roomid: string;
  checkin: string;
  checkout: string;
  guestname?: string;
  guestemail?: string;
  guestphone?: string;
}) => {
  const res = await api.post("/booking/create", bookingData);
  return res.data;
};

export const getAllBookings = async (page: number, limit: number) => {
  const response = await api.get(`/booking?page=${page}&limit=${limit}`);
  return response.data;
};

export const updateBookingStatus = async (bookingId: string, data: { status: string }) => {
  const response = await api.patch(`/booking/update/status/${bookingId}`, data);
  return response.data;
};
