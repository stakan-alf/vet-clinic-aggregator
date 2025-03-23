import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Google as GoogleIcon, Visibility, VisibilityOff } from '@mui/icons-material';

const authSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onGoogleAuth: () => void;
  isLoading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  onGoogleAuth,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const getTitle = () => {
    switch (type) {
      case 'login':
        return 'Вход';
      case 'register':
        return 'Регистрация';
      case 'reset':
        return 'Восстановление пароля';
      default:
        return '';
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {getTitle()}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />

        {type !== 'reset' && (
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : getTitle()}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={onGoogleAuth}
          sx={{ mt: 2 }}
        >
          Войти через Google
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {type === 'login' && (
            <>
              <Link href="/register" variant="body2">
                Нет аккаунта? Зарегистрироваться
              </Link>
              <br />
              <Link href="/password-reset" variant="body2">
                Забыли пароль?
              </Link>
            </>
          )}
          {type === 'register' && (
            <Link href="/login" variant="body2">
              Уже есть аккаунт? Войти
            </Link>
          )}
          {type === 'reset' && (
            <Link href="/login" variant="body2">
              Вернуться к входу
            </Link>
          )}
        </Box>
      </Box>
    </Paper>
  );
}; 