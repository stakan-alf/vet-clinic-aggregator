import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete, Pets } from '@mui/icons-material';
import { Pet } from '../../types/pet';

interface PetCardProps {
  pet: Pet;
  onDelete: (id: number) => Promise<void>;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/pets/${pet.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого питомца?')) {
      await onDelete(pet.id);
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={pet.photo || '/placeholder-pet.jpg'}
        alt={pet.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="div">
            {pet.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={handleEdit}>
              <Edit />
            </IconButton>
            <IconButton size="small" color="error" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Pets sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {pet.species} • {pet.breed}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            label={`${pet.gender === 'male' ? 'Мальчик' : 'Девочка'}`}
            size="small"
            color={pet.gender === 'male' ? 'primary' : 'secondary'}
          />
          <Chip
            label={`${calculateAge(pet.birth_date)} лет`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${pet.weight} кг`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Добавлен: {new Date(pet.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}; 