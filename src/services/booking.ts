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
