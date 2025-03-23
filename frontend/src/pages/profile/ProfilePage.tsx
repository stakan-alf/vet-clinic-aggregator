import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { FavoriteClinics } from '../../components/profile/FavoriteClinics';
import { userService } from '../../services/userService';
import { User, UserUpdateData, FavoriteClinic } from '../../types/user';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [favoriteClinics, setFavoriteClinics] = useState<FavoriteClinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [userData, clinicsData] = await Promise.all([
        userService.getProfile(),
        userService.getFavoriteClinics(),
      ]);
      setUser(userData);
      setFavoriteClinics(clinicsData);
    } catch (err) {
      setError('Ошибка при загрузке данных профиля');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (data: UserUpdateData) => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      setSuccess('Профиль успешно обновлен');
    } catch (err) {
      setError('Ошибка при обновлении профиля');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (clinicId: number) => {
    try {
      await userService.removeFavoriteClinic(clinicId);
      setFavoriteClinics(favoriteClinics.filter(clinic => clinic.id !== clinicId));
      setSuccess('Клиника удалена из избранного');
    } catch (err) {
      setError('Ошибка при удалении клиники из избранного');
      console.error(err);
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Личный кабинет
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <ProfileForm
          user={user}
          onSubmit={handleProfileUpdate}
          isLoading={isLoading}
        />

        <FavoriteClinics
          clinics={favoriteClinics}
          onRemoveFavorite={handleRemoveFavorite}
        />
      </Box>
    </Container>
  );
}; 