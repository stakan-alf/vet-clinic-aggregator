import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../LoginPage';
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

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Забыли пароль?')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };
    const mockToken = 'mock-token';
    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: mockToken
    });

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByText('Войти');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(window.location.pathname).toBe('/');
    });
  });

  it('displays error message on login failure', async () => {
    const errorMessage = 'Неверный email или пароль';
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByText('Войти');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
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
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByText('Войти');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Пароль обязателен')).toBeInTheDocument();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  it('validates email format', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');
    const submitButton = screen.getByText('Войти');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  it('navigates to registration page when clicking register link', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const registerLink = screen.getByText('Регистрация');
    fireEvent.click(registerLink);

    expect(window.location.pathname).toBe('/register');
  });

  it('navigates to password reset page when clicking forgot password link', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const forgotPasswordLink = screen.getByText('Забыли пароль?');
    fireEvent.click(forgotPasswordLink);

    expect(window.location.pathname).toBe('/reset-password');
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
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/');
  });
}); 