import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
  Paper,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Pet, PetCreateData, PetUpdateData } from '../../types/pet';

const petSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  species: z.string().min(2, 'Вид должен содержать минимум 2 символа'),
  breed: z.string().min(2, 'Порода должна содержать минимум 2 символа'),
  birth_date: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Дата рождения не может быть в будущем',
  }),
  gender: z.enum(['male', 'female']),
  weight: z.number().min(0.1, 'Вес должен быть больше 0'),
});

interface PetFormProps {
  pet?: Pet;
  onSubmit: (data: PetCreateData | PetUpdateData) => Promise<void>;
  isLoading: boolean;
}

export const PetForm: React.FC<PetFormProps> = ({
  pet,
  onSubmit,
  isLoading,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(pet?.photo || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetCreateData>({
    resolver: zodResolver(petSchema),
    defaultValues: pet
      ? {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          birth_date: pet.birth_date.split('T')[0],
          gender: pet.gender,
          weight: pet.weight,
        }
      : {
          name: '',
          species: '',
          breed: '',
          birth_date: '',
          gender: 'male',
          weight: 0,
        },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitForm = async (data: PetCreateData) => {
    if (photoFile) {
      data.photo = photoFile;
    }
    await onSubmit(data);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={photoPreview || undefined}
          sx={{ width: 120, height: 120, mb: 2 }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="photo-upload"
          type="file"
          onChange={handlePhotoChange}
        />
        <label htmlFor="photo-upload">
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Имя"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Вид"
              {...register('species')}
              error={!!errors.species}
              helperText={errors.species?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Порода"
              {...register('breed')}
              error={!!errors.breed}
              helperText={errors.breed?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Дата рождения"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('birth_date')}
              error={!!errors.birth_date}
              helperText={errors.birth_date?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Пол"
              {...register('gender')}
              error={!!errors.gender}
              helperText={errors.gender?.message}
            >
              <MenuItem value="male">Мальчик</MenuItem>
              <MenuItem value="female">Девочка</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Вес (кг)"
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              error={!!errors.weight}
              helperText={errors.weight?.message}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : pet ? 'Сохранить изменения' : 'Добавить питомца'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}; 