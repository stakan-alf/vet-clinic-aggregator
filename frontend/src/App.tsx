import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PasswordResetPage } from './pages/auth/PasswordResetPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { HomePage } from './pages/home/HomePage';
import { ClinicsPage } from './pages/clinics/ClinicsPage';
import { ClinicDetailsPage } from './pages/clinics/ClinicDetailsPage';
import { PetsPage } from './pages/pets/PetsPage';
import { PetDetailsPage } from './pages/pets/PetDetailsPage';
import { PetPassportPage } from './pages/PetPassportPage';

// Components
import Navbar from './components/layout/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />
          } />
          <Route path="/password-reset" element={
            isAuthenticated ? <Navigate to="/profile" /> : <PasswordResetPage />
          } />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/clinics/:id" element={<ClinicDetailsPage />} />

          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/pets" element={
            <ProtectedRoute>
              <PetsPage />
            </ProtectedRoute>
          } />
          <Route path="/pets/:id" element={
            <ProtectedRoute>
              <PetDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/pets/:id/passport" element={
            <ProtectedRoute>
              <PetPassportPage />
            </ProtectedRoute>
          } />

          {/* Default route */}
          <Route path="/" element={<HomePage />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App; 