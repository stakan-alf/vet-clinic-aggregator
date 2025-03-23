import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Rating,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { FavoriteClinic } from '../../types/user';

interface FavoriteClinicsProps {
  clinics: FavoriteClinic[];
  onRemoveFavorite: (clinicId: number) => Promise<void>;
}

export const FavoriteClinics: React.FC<FavoriteClinicsProps> = ({
  clinics,
  onRemoveFavorite,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Избранные клиники
      </Typography>
      <Grid container spacing={3}>
        {clinics.map((clinic) => (
          <Grid item xs={12} sm={6} md={4} key={clinic.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={clinic.image || '/placeholder-clinic.jpg'}
                alt={clinic.name}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {clinic.name}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => onRemoveFavorite(clinic.id)}
                    size="small"
                  >
                    <Favorite />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {clinic.address}
                </Typography>
                <Rating value={clinic.rating} readOnly size="small" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 