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
export const getMenuItemById = async (id: string): Promise<MenuItem> => {
  const response = await axiosClient.get(`/menu/${id}`);
  return response.data;
};