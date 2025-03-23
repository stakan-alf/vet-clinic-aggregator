import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from '../RegisterPage';
import authReducer from '../../../store/slices/authSlice';
import { authService } from '../../../services/authService';

// Мокаем сервис аутентификации
jest.mock('../../../services/authService');

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

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Фамилия')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Подтвердите пароль')).toBeInTheDocument();
    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
    expect(screen.getByText('Уже есть аккаунт?')).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    const mockToken = 'mock-token';
    (authService.register as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: mockToken
    });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText('Имя');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const confirmPasswordInput = screen.getByLabelText('Подтвердите пароль');
    const submitButton = screen.getByText('Зарегистрироваться');

    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(window.location.pathname).toBe('/');
    });
  });

  it('displays error message on registration failure', async () => {
    const errorMessage = 'Email уже используется';
    (authService.register as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText('Имя');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const confirmPasswordInput = screen.getByLabelText('Подтвердите пароль');
    const submitButton = screen.getByText('Зарегистрироваться');

    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByText('Зарегистрироваться');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Имя обязательно')).toBeInTheDocument();
      expect(screen.getByText('Фамилия обязательна')).toBeInTheDocument();
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Пароль обязателен')).toBeInTheDocument();
      expect(screen.getByText('Подтверждение пароля обязательно')).toBeInTheDocument();
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  it('validates email format', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText('Имя');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const confirmPasswordInput = screen.getByLabelText('Подтвердите пароль');
    const submitButton = screen.getByText('Зарегистрироваться');

    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  it('validates password match', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText('Имя');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const confirmPasswordInput = screen.getByLabelText('Подтвердите пароль');
    const submitButton = screen.getByText('Зарегистрироваться');

    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different-password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  it('validates password strength', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const firstNameInput = screen.getByLabelText('Имя');
    const lastNameInput = screen.getByLabelText('Фамилия');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const confirmPasswordInput = screen.getByLabelText('Подтвердите пароль');
    const submitButton = screen.getByText('Зарегистрироваться');

    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Пароль должен содержать минимум 8 символов')).toBeInTheDocument();
      expect(authService.register).not.toHaveBeenCalled();
    });
  });

  it('navigates to login page when clicking login link', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const loginLink = screen.getByText('Войти');
    fireEvent.click(loginLink);

    expect(window.location.pathname).toBe('/login');
  });

  it('redirects to home page when user is already authenticated', () => {
    const store = createMockStore({
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      },
      isAuthenticated: true
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/');
  });
}); 