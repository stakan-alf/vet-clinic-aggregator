import React from 'react';
import { Container, Typography } from '@mui/material';

export const ClinicsPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Ветеринарные клиники
      </Typography>
      <Typography variant="body1">
        Здесь будет список ветеринарных клиник
      </Typography>
    </Container>
  );
}; 