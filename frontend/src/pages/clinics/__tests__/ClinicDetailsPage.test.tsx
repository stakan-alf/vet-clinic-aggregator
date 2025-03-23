import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ClinicDetailsPage from '../ClinicDetailsPage';
import authReducer from '../../../store/slices/authSlice';
import { api } from '../../../services/api';

// Мокаем API
jest.mock('../../../services/api');

const mockClinic = {
  id: 1,
  name: 'Test Clinic',
  address: 'Test Address',
  rating: 4.5,
  reviewsCount: 100,
  isOpen: true,
  distance: 1.5,
  services: ['Service 1', 'Service 2'],
  workingHours: {
    monday: { open: '09:00', close: '18:00' },
    tuesday: { open: '09:00', close: '18:00' },
    wednesday: { open: '09:00', close: '18:00' },
    thursday: { open: '09:00', close: '18:00' },
    friday: { open: '09:00', close: '18:00' },
    saturday: { open: '10:00', close: '16:00' },
    sunday: { open: '10:00', close: '16:00' }
  },
  phone: '+7 (999) 123-45-67',
  email: 'test@clinic.com',
  website: 'https://test-clinic.com',
  description: 'Test clinic description',
  photos: ['photo1.jpg', 'photo2.jpg'],
  location: {
    lat: 55.7558,
    lng: 37.6173
  }
};

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState: {
      auth: initialState
    }
  });
};

describe('ClinicDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders clinic details correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(mockClinic.name)).toBeInTheDocument();
      expect(screen.getByText(mockClinic.address)).toBeInTheDocument();
      expect(screen.getByText(`${mockClinic.rating} (${mockClinic.reviewsCount} отзывов)`)).toBeInTheDocument();
      expect(screen.getByText('Открыто')).toBeInTheDocument();
      expect(screen.getByText(`${mockClinic.distance} км`)).toBeInTheDocument();
      expect(screen.getByText(mockClinic.description)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching clinic data', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('displays error message when clinic data fetch fails', async () => {
    const errorMessage = 'Failed to fetch clinic data';
    (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays working hours correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Режим работы')).toBeInTheDocument();
      expect(screen.getByText('Понедельник - Пятница: 09:00 - 18:00')).toBeInTheDocument();
      expect(screen.getByText('Суббота - Воскресенье: 10:00 - 16:00')).toBeInTheDocument();
    });
  });

  it('displays clinic services correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Услуги')).toBeInTheDocument();
      mockClinic.services.forEach(service => {
        expect(screen.getByText(service)).toBeInTheDocument();
      });
    });
  });

  it('displays clinic contact information correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Контакты')).toBeInTheDocument();
      expect(screen.getByText(mockClinic.phone)).toBeInTheDocument();
      expect(screen.getByText(mockClinic.email)).toBeInTheDocument();
      expect(screen.getByText(mockClinic.website)).toBeInTheDocument();
    });
  });

  it('displays closed status when clinic is closed', async () => {
    const closedClinic = { ...mockClinic, isOpen: false };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: closedClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Закрыто')).toBeInTheDocument();
    });
  });

  it('displays map with clinic location', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinic });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('clinic-map')).toBeInTheDocument();
    });
  });
}); 