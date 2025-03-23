import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PetCard } from '../components/pets/PetCard';
import { VaccinationHistory } from '../components/pets/VaccinationHistory';
import { VisitHistory } from '../components/pets/VisitHistory';
import { DocumentUpload } from '../components/pets/DocumentUpload';
import { PetService } from '../services/petService';
import { Pet, PetDocument, PetVisit, PetVaccination } from '../types/pet';

export const PetPassportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (!id) return;
        const data = await PetService.getPet(parseInt(id));
        setPet(data);
      } catch (err) {
        setError('Не удалось загрузить данные питомца');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleVaccinationAdd = async (data: Omit<PetVaccination, 'id'>) => {
    if (!pet) return;
    const updatedPet = await PetService.addVaccination(pet.id, data);
    setPet(updatedPet);
  };

  const handleVaccinationDelete = async (vaccinationId: number) => {
    if (!pet) return;
    const updatedPet = await PetService.deleteVaccination(pet.id, vaccinationId);
    setPet(updatedPet);
  };

  const handleVisitAdd = async (data: Omit<PetVisit, 'id'>) => {
    if (!pet) return;
    const updatedPet = await PetService.addVisit(pet.id, data);
    setPet(updatedPet);
  };

  const handleVisitDelete = async (visitId: number) => {
    if (!pet) return;
    const updatedPet = await PetService.deleteVisit(pet.id, visitId);
    setPet(updatedPet);
  };

  const handleDocumentUpload = async (data: Omit<PetDocument, 'id' | 'uploaded_at'>) => {
    if (!pet) return;
    const updatedPet = await PetService.uploadDocument(pet.id, data);
    setPet(updatedPet);
  };

  const handleDocumentDelete = async (documentId: number) => {
    if (!pet) return;
    const updatedPet = await PetService.deleteDocument(pet.id, documentId);
    setPet(updatedPet);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !pet) {
    return (
      <Container>
        <Alert severity="error">{error || 'Питомец не найден'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <PetCard pet={pet} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <VaccinationHistory
              vaccinations={pet.vaccinations}
              onAdd={handleVaccinationAdd}
              onDelete={handleVaccinationDelete}
            />
          </Paper>
          <Paper sx={{ p: 3, mb: 3 }}>
            <VisitHistory
              visits={pet.visits}
              onAdd={handleVisitAdd}
              onDelete={handleVisitDelete}
            />
          </Paper>
          <Paper sx={{ p: 3 }}>
            <DocumentUpload
              documents={pet.documents}
              onUpload={handleDocumentUpload}
              onDelete={handleDocumentDelete}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 