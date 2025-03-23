import React from 'react';
import { Container, Typography } from '@mui/material';

export const PetsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои питомцы
      </Typography>
      <Typography variant="body1">
        Здесь будет список ваших питомцев
      </Typography>
    </Container>
  );
}; 