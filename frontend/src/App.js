import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<div>Главная страница</div>} />
        <Route path="/clinics" element={<div>Список клиник</div>} />
        <Route path="/services" element={<div>Услуги</div>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 