import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../Navbar';
import authReducer from '../../../store/slices/authSlice';

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

describe('Navbar', () => {
  const renderNavbar = (store = createMockStore()) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders without crashing', () => {
    renderNavbar();
    expect(screen.getByText('Vet Clinic Aggregator')).toBeInTheDocument();
  });

  it('renders navigation links for unauthenticated users', () => {
    renderNavbar();
    
    expect(screen.getByText('Клиники')).toBeInTheDocument();
    expect(screen.getByText('Войти')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    
    expect(screen.queryByText('Мои питомцы')).not.toBeInTheDocument();
  });

  it('renders navigation links for authenticated users', () => {
    const store = createMockStore({
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      },
      isAuthenticated: true
    });
    
    renderNavbar(store);
    
    expect(screen.getByText('Клиники')).toBeInTheDocument();
    expect(screen.getByText('Мои питомцы')).toBeInTheDocument();
    expect(screen.getByTestId('AccountCircleIcon')).toBeInTheDocument();
    
    expect(screen.queryByText('Войти')).not.toBeInTheDocument();
    expect(screen.queryByText('Регистрация')).not.toBeInTheDocument();
  });

  it('opens user menu when clicking account icon', () => {
    const store = createMockStore({
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      },
      isAuthenticated: true
    });
    
    renderNavbar(store);
    
    const accountIcon = screen.getByTestId('AccountCircleIcon');
    fireEvent.click(accountIcon);
    
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Выйти')).toBeInTheDocument();
  });

  it('navigates to home page when clicking logo', () => {
    renderNavbar();
    
    const logo = screen.getByText('Vet Clinic Aggregator');
    fireEvent.click(logo);
    
    expect(window.location.pathname).toBe('/');
  });

  it('navigates to clinics page when clicking clinics link', () => {
    renderNavbar();
    
    const clinicsLink = screen.getByText('Клиники');
    fireEvent.click(clinicsLink);
    
    expect(window.location.pathname).toBe('/clinics');
  });

  it('navigates to pets page when clicking pets link', () => {
    const store = createMockStore({
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      },
      isAuthenticated: true
    });
    
    renderNavbar(store);
    
    const petsLink = screen.getByText('Мои питомцы');
    fireEvent.click(petsLink);
    
    expect(window.location.pathname).toBe('/pets');
  });

  it('navigates to login page when clicking login link', () => {
    renderNavbar();
    
    const loginLink = screen.getByText('Войти');
    fireEvent.click(loginLink);
    
    expect(window.location.pathname).toBe('/login');
  });

  it('navigates to register page when clicking register link', () => {
    renderNavbar();
    
    const registerLink = screen.getByText('Регистрация');
    fireEvent.click(registerLink);
    
    expect(window.location.pathname).toBe('/register');
  });
}); 