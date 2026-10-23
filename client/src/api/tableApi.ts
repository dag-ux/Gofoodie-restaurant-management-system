import axiosClient from './axiosClient';

export const getAvailableTables = async () => {
  const response = await axiosClient.get('/tables');
  return response.data;
};

export const createReservation = async (data: {
  tableId: number;
  reservationTime: string;
  partySize: number;
}) => {
  const response = await axiosClient.post('/tables/reservations', data);
  return response.data;
};