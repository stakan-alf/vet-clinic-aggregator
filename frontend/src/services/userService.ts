import axios from 'axios';
import { User, UserUpdateData, FavoriteClinic } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const userService = {
  // Получение данных пользователя
  getProfile: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/auth/user/`);
    return response.data;
  },

  // Обновление данных пользователя
  updateProfile: async (data: UserUpdateData): Promise<User> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.put(`${API_URL}/auth/user/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Получение списка избранных клиник
  getFavoriteClinics: async (): Promise<FavoriteClinic[]> => {
    const response = await axios.get(`${API_URL}/favorites/`);
    return response.data;
  },

  // Добавление клиники в избранное
  addFavoriteClinic: async (clinicId: number): Promise<FavoriteClinic> => {
    const response = await axios.post(`${API_URL}/favorites/`, { clinic_id: clinicId });
    return response.data;
  },

  // Удаление клиники из избранного
  removeFavoriteClinic: async (clinicId: number): Promise<void> => {
    await axios.delete(`${API_URL}/favorites/${clinicId}/`);
  },
}; 