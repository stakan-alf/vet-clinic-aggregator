import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResetPasswordPage from '../ResetPasswordPage';
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

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders reset password form correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Сброс пароля')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByText('Отправить инструкции')).toBeInTheDocument();
    expect(screen.getByText('Вернуться к входу')).toBeInTheDocument();
  });

  it('handles successful password reset request', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Отправить инструкции');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText('Инструкции по сбросу пароля отправлены на ваш email')).toBeInTheDocument();
    });
  });

  it('displays error message on password reset failure', async () => {
    const errorMessage = 'Пользователь не найден';
    (authService.resetPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Отправить инструкции');

    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required email field', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByText('Отправить инструкции');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('validates email format', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Отправить инструкции');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Введите корректный email')).toBeInTheDocument();
      expect(authService.resetPassword).not.toHaveBeenCalled();
    });
  });

  it('navigates to login page when clicking back link', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const backLink = screen.getByText('Вернуться к входу');
    fireEvent.click(backLink);

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
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/');
  });

  it('displays loading state while sending reset request', async () => {
    (authService.resetPassword as jest.Mock).mockImplementation(() => new Promise(() => {}));

    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Отправить инструкции');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Отправка...')).toBeInTheDocument();
  });
}); 