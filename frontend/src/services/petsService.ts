import axios from 'axios';
import {
  Pet,
  PetCreateData,
  PetUpdateData,
  Vaccination,
  Visit,
  PetDocument,
} from '../types/pet';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const petsService = {
  // Получение списка питомцев
  getPets: async (): Promise<Pet[]> => {
    const response = await axios.get(`${API_URL}/pets/`);
    return response.data;
  },

  // Получение информации о питомце
  getPet: async (id: number): Promise<Pet> => {
    const response = await axios.get(`${API_URL}/pets/${id}/`);
    return response.data;
  },

  // Создание нового питомца
  createPet: async (data: PetCreateData): Promise<Pet> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${API_URL}/pets/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Обновление информации о питомце
  updatePet: async (data: PetUpdateData): Promise<Pet> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.put(`${API_URL}/pets/${data.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление питомца
  deletePet: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/pets/${id}/`);
  },

  // Получение истории вакцинаций
  getVaccinations: async (petId: number): Promise<Vaccination[]> => {
    const response = await axios.get(`${API_URL}/pets/${petId}/vaccinations/`);
    return response.data;
  },

  // Добавление вакцинации
  addVaccination: async (petId: number, data: Omit<Vaccination, 'id'>): Promise<Vaccination> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${API_URL}/pets/${petId}/vaccinations/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Получение истории посещений
  getVisits: async (petId: number): Promise<Visit[]> => {
    const response = await axios.get(`${API_URL}/pets/${petId}/visits/`);
    return response.data;
  },

  // Добавление посещения
  addVisit: async (petId: number, data: Omit<Visit, 'id'>): Promise<Visit> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    const response = await axios.post(`${API_URL}/pets/${petId}/visits/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Загрузка документа
  uploadDocument: async (petId: number, data: Omit<PetDocument, 'id' | 'uploaded_at'>): Promise<PetDocument> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${API_URL}/pets/${petId}/documents/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Получение списка документов
  getDocuments: async (petId: number): Promise<PetDocument[]> => {
    const response = await axios.get(`${API_URL}/pets/${petId}/documents/`);
    return response.data;
  },
}; 