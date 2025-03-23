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
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Visit } from '../../types/pet';

const visitSchema = z.object({
  date: z.string(),
  clinic: z.string().min(2, 'Название клиники должно содержать минимум 2 символа'),
  doctor: z.string().min(2, 'Имя врача должно содержать минимум 2 символа'),
  diagnosis: z.string().min(2, 'Диагноз должен содержать минимум 2 символа'),
  treatment: z.string().min(2, 'Лечение должно содержать минимум 2 символа'),
  documents: z.array(z.any()).optional(),
});

interface VisitHistoryProps {
  visits: Visit[];
  onAdd: (data: Omit<Visit, 'id'>) => Promise<void>;
  onEdit: (id: number, data: Omit<Visit, 'id'>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const VisitHistory: React.FC<VisitHistoryProps> = ({
  visits,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Visit, 'id'>>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      date: '',
      clinic: '',
      doctor: '',
      diagnosis: '',
      treatment: '',
      documents: [],
    },
  });

  const handleOpen = (visit?: Visit) => {
    if (visit) {
      setEditingVisit(visit);
      reset({
        date: visit.date.split('T')[0],
        clinic: visit.clinic,
        doctor: visit.doctor,
        diagnosis: visit.diagnosis,
        treatment: visit.treatment,
        documents: visit.documents,
      });
    } else {
      setEditingVisit(null);
      reset({
        date: '',
        clinic: '',
        doctor: '',
        diagnosis: '',
        treatment: '',
        documents: [],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingVisit(null);
    reset();
  };

  const onSubmit = async (data: Omit<Visit, 'id'>) => {
    try {
      setError(null);
      if (editingVisit) {
        await onEdit(editingVisit.id, data);
      } else {
        await onAdd(data);
      }
      handleClose();
    } catch (err) {
      setError('Произошла ошибка при сохранении посещения');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись о посещении?')) {
      try {
        await onDelete(id);
      } catch (err) {
        setError('Произошла ошибка при удалении записи');
        console.error(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">История посещений</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Добавить посещение
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Клиника</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Лечение</TableCell>
              <TableCell>Документы</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>{new Date(visit.date).toLocaleDateString()}</TableCell>
                <TableCell>{visit.clinic}</TableCell>
                <TableCell>{visit.doctor}</TableCell>
                <TableCell>{visit.diagnosis}</TableCell>
                <TableCell>{visit.treatment}</TableCell>
                <TableCell>
                  {visit.documents.length > 0 ? (
                    <Button
                      size="small"
                      onClick={() => window.open(visit.documents[0], '_blank')}
                    >
                      Просмотр
                    </Button>
                  ) : (
                    'Нет'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpen(visit)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(visit.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingVisit ? 'Редактировать посещение' : 'Добавить посещение'}
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
              label="Дата посещения"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
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

            <TextField
              fullWidth
              label="Диагноз"
              multiline
              rows={3}
              {...register('diagnosis')}
              error={!!errors.diagnosis}
              helperText={errors.diagnosis?.message}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Лечение"
              multiline
              rows={3}
              {...register('treatment')}
              error={!!errors.treatment}
              helperText={errors.treatment?.message}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {editingVisit ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}; 