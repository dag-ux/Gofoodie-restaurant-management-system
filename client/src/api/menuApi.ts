import axiosClient from './axiosClient';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await axiosClient.get('/menu');
  return response.data;
};