import axiosClient from './axiosClient';

export const getAvailableTables = async () => {
  const response = await axiosClient.get('/tables');
  return response.data;
};

export const createReservation = async (data: {
  tableId: number;
  reservationTime: string;
  partySize: number;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  specialRequests?: string;
}) => {
  const response = await axiosClient.post('/tables/reservations', data);
  return response.data;
};