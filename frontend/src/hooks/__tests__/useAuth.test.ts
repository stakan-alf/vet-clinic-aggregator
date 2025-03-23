import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuth } from '../useAuth';
import authReducer from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

// Мокаем сервис аутентификации
jest.mock('../../services/authService');

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

describe('useAuth', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  };

  const mockToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('successfully logs in user', async () => {
    (authService.login as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: mockToken
    });

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('successfully registers user', async () => {
    (authService.register as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      token: mockToken
    });

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User'
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      firstName: 'Test',
      lastName: 'User'
    });
  });

  it('handles registration error', async () => {
    const errorMessage = 'Email already exists';
    (authService.register as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.register({
        email: 'existing@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User'
      });
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('successfully logs out user', async () => {
    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('handles logout error', async () => {
    const errorMessage = 'Logout failed';
    (authService.logout as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore({
      user: mockUser,
      isAuthenticated: true
    });
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('successfully resets password', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.resetPassword('test@example.com');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('handles password reset error', async () => {
    const errorMessage = 'User not found';
    (authService.resetPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const store = createMockStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )
    });

    await act(async () => {
      await result.current.resetPassword('nonexistent@example.com');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
}); 