import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClinicCard } from '../ClinicCard';

const mockClinic = {
  id: '1',
  name: 'Test Clinic',
  address: 'Test Address',
  rating: 4.5,
  reviewsCount: 10,
  isOpen: true,
  distance: 1000,
  services: ['Service 1', 'Service 2'],
  workingHours: {
    open: '09:00',
    close: '18:00'
  }
};

describe('ClinicCard', () => {
  it('renders without crashing', () => {
    render(<ClinicCard clinic={mockClinic} />);
    expect(screen.getByText('Test Clinic')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
  });

  it('displays clinic information correctly', () => {
    render(<ClinicCard clinic={mockClinic} />);
    
    // Проверяем основную информацию
    expect(screen.getByText('Test Clinic')).toBeInTheDocument();
    expect(screen.getByText('Test Address')).toBeInTheDocument();
    expect(screen.getByText('1 км')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
    
    // Проверяем статус работы
    expect(screen.getByText('Открыто')).toBeInTheDocument();
    expect(screen.getByText('09:00 - 18:00')).toBeInTheDocument();
    
    // Проверяем услуги
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
  });

  it('displays closed status correctly', () => {
    const closedClinic = {
      ...mockClinic,
      isOpen: false
    };
    render(<ClinicCard clinic={closedClinic} />);
    expect(screen.getByText('Закрыто')).toBeInTheDocument();
  });

  it('formats distance correctly', () => {
    const nearbyClinic = {
      ...mockClinic,
      distance: 500
    };
    render(<ClinicCard clinic={nearbyClinic} />);
    expect(screen.getByText('500 м')).toBeInTheDocument();
  });

  it('navigates to clinic details on button click', () => {
    const { window } = global;
    delete global.window;
    global.window = { ...window, location: { href: '' } };

    render(<ClinicCard clinic={mockClinic} />);
    
    const button = screen.getByText('Подробнее');
    fireEvent.click(button);
    
    expect(global.window.location.href).toBe('/clinics/1');
  });

  it('renders with correct styling', () => {
    render(<ClinicCard clinic={mockClinic} />);
    
    // Проверяем основные стили
    expect(screen.getByText('Test Clinic').closest('div')).toHaveClass('bg-white', 'rounded-lg', 'shadow-md');
    
    // Проверяем стили кнопки
    expect(screen.getByText('Подробнее')).toHaveClass('bg-blue-600', 'text-white', 'rounded-lg');
  });
}); 