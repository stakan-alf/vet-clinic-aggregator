import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete, Warning } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Vaccination } from '../../types/pet';

const vaccinationSchema = z.object({
  name: z.string().min(2, 'Название вакцины должно содержать минимум 2 символа'),
  date: z.string(),
  next_date: z.string(),
  clinic: z.string().min(2, 'Название клиники должно содержать минимум 2 символа'),
  doctor: z.string().min(2, 'Имя врача должно содержать минимум 2 символа'),
  document: z.any().optional(),
});

interface VaccinationHistoryProps {
  vaccinations: Vaccination[];
  onAdd: (data: Omit<Vaccination, 'id'>) => Promise<void>;
  onEdit: (id: number, data: Omit<Vaccination, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const VaccinationHistory: React.FC<VaccinationHistoryProps> = ({
  vaccinations,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState<Vaccination | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Vaccination, 'id'>>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      name: '',
      date: '',
      next_date: '',
      clinic: '',
      doctor: '',
    },
  });

  const handleOpen = (vaccination?: Vaccination) => {
    if (vaccination) {
      setEditingVaccination(vaccination);
      reset({
        name: vaccination.name,
        date: vaccination.date.split('T')[0],
        next_date: vaccination.next_date.split('T')[0],
        clinic: vaccination.clinic,
        doctor: vaccination.doctor,
      });
    } else {
      setEditingVaccination(null);
      reset({
        name: '',
        date: '',
        next_date: '',
        clinic: '',
        doctor: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVaccination(null);
    reset();
  };

  const onSubmit = async (data: Omit<Vaccination, 'id'>) => {
    try {
      setError(null);
      if (editingVaccination) {
        await onEdit(editingVaccination.id, data);
      } else {
        await onAdd(data);
      }
      handleClose();
    } catch (err) {
      setError('Произошла ошибка при сохранении вакцинации');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись о вакцинации?')) {
      try {
        await onDelete(id);
      } catch (err) {
        setError('Произошла ошибка при удалении записи');
        console.error(err);
      }
    }
  };

  const getUpcomingVaccinations = () => {
    const today = new Date();
    return vaccinations.filter((vaccination) => {
      const nextDate = new Date(vaccination.next_date);
      return nextDate > today && nextDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">История вакцинаций</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Добавить вакцинацию
        </Button>
      </Box>

      {getUpcomingVaccinations().length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Warning sx={{ mr: 1 }} />
          У вас есть предстоящие вакцинации в течение следующих 30 дней
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Следующая дата</TableCell>
              <TableCell>Клиника</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccinations.map((vaccination) => (
              <TableRow key={vaccination.id}>
                <TableCell>{vaccination.name}</TableCell>
                <TableCell>{new Date(vaccination.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(vaccination.next_date).toLocaleDateString()}</TableCell>
                <TableCell>{vaccination.clinic}</TableCell>
                <TableCell>{vaccination.doctor}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(vaccination)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(vaccination.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingVaccination ? 'Редактировать вакцинацию' : 'Добавить вакцинацию'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Название вакцины"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Дата вакцинации"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Следующая дата"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('next_date')}
              error={!!errors.next_date}
              helperText={errors.next_date?.message}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Клиника"
              {...register('clinic')}
              error={!!errors.clinic}
              helperText={errors.clinic?.message}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Врач"
              {...register('doctor')}
              error={!!errors.doctor}
              helperText={errors.doctor?.message}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {editingVaccination ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 