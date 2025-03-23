import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Link, Typography, Box } from '@mui/material';
import { AuthForm } from '../../components/auth/AuthForm';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading } = useAuth();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await register(data.email, data.password);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка регистрации через Google:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AuthForm
          type="register"
          onSubmit={handleSubmit}
          onGoogleAuth={handleGoogleAuth}
          isLoading={isLoading}
        />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Уже есть аккаунт?{' '}
            <Link component={RouterLink} to="/login">
              Войти
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}; 