import React from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export const ClinicDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Детали клиники {id}
      </Typography>
      <Typography variant="body1">
        Здесь будет подробная информация о клинике
      </Typography>
    </Container>
  );
}; 