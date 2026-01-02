import api from "./api"

export const getAllAvailableRoomsByRoomType = async (
  id: string,
  checkinDate: Date,
  checkoutDate: Date,
  page: number, 
  limit: number
) => {
  const formatDateForAPI = (date: Date) =>
    date.toLocaleDateString("en-CA"); // YYYY-MM-DD (LOCAL)

  const res = await api.get(`available/roomtype/${id}`, {
    params: {
      checkin: formatDateForAPI(checkinDate),
      checkout: formatDateForAPI(checkoutDate),
      page,
      limit
    },
  });

  return res.data;
};