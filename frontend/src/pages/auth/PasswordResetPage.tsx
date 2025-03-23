import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Link, Typography, Box, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const resetSchema = z.object({
  email: z.string().email('Введите корректный email'),
});

type ResetFormData = z.infer<typeof resetSchema>;

export const PasswordResetPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Ошибка восстановления пароля:', error);
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
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Восстановление пароля
        </Typography>

        {isSubmitted ? (
          <>
            <Typography variant="body1" align="center" gutterBottom>
              Инструкции по восстановлению пароля отправлены на ваш email.
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Вернуться к входу
            </Button>
          </>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <TextField
              {...register('email')}
              label="Email"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Восстановить пароль'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                <Link component={RouterLink} to="/login">
                  Вернуться к входу
                </Link>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}; 