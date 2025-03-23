import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Clinic {
  id: number;
  name: string;
  address: string;
  rating: number;
}

export const HomePage: React.FC = () => {
  const { data: clinics, isLoading, error } = useQuery<Clinic[]>({
    queryKey: ['clinics'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/api/clinics/');
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom color="error">
          Ошибка загрузки данных
        </Typography>
        <Typography variant="body1">
          Не удалось загрузить список клиник. Пожалуйста, попробуйте позже.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Добро пожаловать в ВетКлиники
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь вы найдете лучшие ветеринарные клиники в вашем районе.
      </Typography>
      
      {clinics && clinics.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Доступные клиники:
          </Typography>
          {clinics.map((clinic: Clinic) => (
            <Box key={clinic.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="h6">{clinic.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Адрес: {clinic.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Рейтинг: {clinic.rating}/5
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          В данный момент нет доступных клиник.
        </Typography>
      )}
    </Box>
  );
}; 