import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { Filters, Location } from '../types/filters';

interface WorkingHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewsCount: number;
  isOpen: boolean;
  distance: number;
  services: string[];
  latitude: number;
  longitude: number;
  workingHours: WorkingHours;
}

export const useClinicSearch = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchClinics = useCallback(async (
    location: Location,
    filters: Filters
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Searching clinics with params:', {
        lat: location.lat,
        lng: location.lng,
        ...filters
      });

      const response = await api.get('/clinics/search', {
        params: {
          lat: location.lat,
          lng: location.lng,
          service: filters.service,
          price_range: filters.price_range,
          rating: filters.rating,
          has_parking: filters.has_parking,
          is_open_24h: filters.is_open_24h
        }
      });

      console.log('API response:', response.data);
      setClinics(response.data);
    } catch (err) {
      console.error('Error searching clinics:', err);
      setError('Произошла ошибка при поиске клиник. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clinics,
    loading,
    error,
    searchClinics
  };
}; 