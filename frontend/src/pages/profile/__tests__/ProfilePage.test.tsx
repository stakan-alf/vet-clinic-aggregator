import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfilePage from '../ProfilePage';
import authReducer from '../../../store/slices/authSlice';
import { api } from '../../../services/api';

// Мокаем API
jest.mock('../../../services/api');

const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '+7 (999) 123-45-67',
  address: 'Test Address'
};

const mockPets = [
  {
    id: 1,
    name: 'Pet 1',
    type: 'dog',
    breed: 'Labrador',
    age: 3,
    weight: 15
  },
  {
    id: 2,
    name: 'Pet 2',
    type: 'cat',
    breed: 'Persian',
    age: 2,
    weight: 5
  }
];

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

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPets });

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Профиль')).toBeInTheDocument();
      expect(screen.getByText(mockUser.firstName)).toBeInTheDocument();
      expect(screen.getByText(mockUser.lastName)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
      expect(screen.getByText(mockUser.address)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('displays error message when data fetch fails', async () => {
    const errorMessage = 'Failed to fetch profile data';
    (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays user pets correctly', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPets });

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Мои питомцы')).toBeInTheDocument();
      mockPets.forEach(pet => {
        expect(screen.getByText(pet.name)).toBeInTheDocument();
        expect(screen.getByText(pet.breed)).toBeInTheDocument();
        expect(screen.getByText(`${pet.age} лет`)).toBeInTheDocument();
        expect(screen.getByText(`${pet.weight} кг`)).toBeInTheDocument();
      });
    });
  });

  it('opens add pet dialog when clicking add button', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPets });

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const addButton = screen.getByText('Добавить питомца');
      fireEvent.click(addButton);
    });

    expect(screen.getByText('Добавить нового питомца')).toBeInTheDocument();
  });

  it('successfully updates user profile', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPets });
    (api.put as jest.Mock).mockResolvedValueOnce({ data: { ...mockUser, firstName: 'Updated' } });

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const editButton = screen.getByText('Редактировать');
      fireEvent.click(editButton);
    });

    const firstNameInput = screen.getByLabelText('Имя');
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Профиль успешно обновлен')).toBeInTheDocument();
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  it('handles profile update error', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUser });
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPets });
    (api.put as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const editButton = screen.getByText('Редактировать');
      fireEvent.click(editButton);
    });

    const firstNameInput = screen.getByLabelText('Имя');
    fireEvent.change(firstNameInput, { target: { value: 'Updated' } });

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Ошибка при обновлении профиля')).toBeInTheDocument();
    });
  });

  it('redirects to login page when user is not authenticated', () => {
    const store = createMockStore({
      user: null,
      isAuthenticated: false
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/login');
  });
}); 