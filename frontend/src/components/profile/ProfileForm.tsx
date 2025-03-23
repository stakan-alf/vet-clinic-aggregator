import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { User, UserUpdateData } from '../../types/user';

const profileSchema = z.object({
  first_name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  last_name: z.string().min(2, 'Фамилия должна содержать минимум 2 символа'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Некорректный номер телефона'),
});

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UserUpdateData) => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  isLoading,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = async (data: UserUpdateData) => {
    if (avatarFile) {
      data.avatar = avatarFile;
    }
    await onSubmit(data);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={avatarPreview || undefined}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="avatar-upload"
          type="file"
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-upload">
          <IconButton
            color="primary"
            component="span"
            sx={{ position: 'relative', bottom: 40, left: 40 }}
          >
            <PhotoCamera />
          </IconButton>
        </label>
      </Box>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <TextField
          fullWidth
          label="Имя"
          {...register('first_name')}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Фамилия"
          {...register('last_name')}
          error={!!errors.last_name}
          helperText={errors.last_name?.message}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Телефон"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          margin="normal"
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}; 