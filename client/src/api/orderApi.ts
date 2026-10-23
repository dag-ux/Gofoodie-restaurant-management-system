import axiosClient from './axiosClient';

export const createOrder = async (orderData: {
  customerName: string;
  phone: string;
  address: string;
  orderType: string;
  totalAmount: number;
  cartItems: any[];
}) => {
  const response = await axiosClient.post('/orders', orderData);
  return response.data;
};