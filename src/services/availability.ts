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


export const getAllAvailablityByDate = async (
  checkinDate: Date,
  checkoutDate: Date,
  sort?: string
) => {
  const formatDateForAPI = (date: Date) =>
    date.toLocaleDateString("en-CA"); // YYYY-MM-DD (LOCAL)

  const res = await api.get(`available/`, {
    params: {
      checkin: formatDateForAPI(checkinDate),
      checkout: formatDateForAPI(checkoutDate),
      sort: sort
    },
  });

  return res.data;
};

/* 
export const getAllAvailableRooms = async (
  roomTypeId: string,
  checkIn: Date,
  checkOut: Date,
  page: number = 1,
  limit: number = 10
) => {
  const response = await api.get(`/rooms/available/${roomTypeId}`, {
    params: {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      page,
      limit
    }
  });
  return response.data;
}; */