import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { useClinicSearch } from '../../../hooks/useClinicSearch';

// Мокаем хук useClinicSearch
jest.mock('../../../hooks/useClinicSearch');

// Мокаем Google Maps API
jest.mock('@react-google-maps/api', () => ({
  LoadScript: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Marker: () => <div>Marker</div>,
  Autocomplete: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Мокаем хук useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

const mockClinics = [
  {
    id: '1',
    name: 'ВетКлиника',
    address: 'ул. Пушкина, д. 10',
    rating: 4.5,
    reviewsCount: 100,
    isOpen: true,
    distance: 1500,
    services: ['Общая диагностика', 'Хирургия'],
    latitude: 55.7558,
    longitude: 37.6173,
    workingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '09:00', close: '18:00' }
    }
  }
];

describe('HomePage', () => {
  const mockSearchClinics = jest.fn();

  beforeEach(() => {
    (useClinicSearch as jest.Mock).mockReturnValue({
      clinics: mockClinics,
      loading: false,
      error: null,
      searchClinics: mockSearchClinics
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderHomePage = () => {
    render(<HomePage />);
  };

  it('renders without crashing', () => {
    renderHomePage();
    expect(screen.getByText('Поиск ветеринарных клиник')).toBeInTheDocument();
  });

  it('renders search bar', () => {
    renderHomePage();
    expect(screen.getByPlaceholderText('Введите адрес для поиска клиник')).toBeInTheDocument();
  });

  it('renders search filters', () => {
    renderHomePage();
    expect(screen.getByLabelText('Услуга')).toBeInTheDocument();
    expect(screen.getByLabelText('Ценовой диапазон')).toBeInTheDocument();
    expect(screen.getByLabelText('Минимальный рейтинг')).toBeInTheDocument();
    expect(screen.getByLabelText('Есть парковка')).toBeInTheDocument();
    expect(screen.getByLabelText('Круглосуточно')).toBeInTheDocument();
  });

  it('renders clinic list', () => {
    renderHomePage();
    expect(screen.getByText('ВетКлиника')).toBeInTheDocument();
  });

  it('handles filter changes', async () => {
    renderHomePage();
    const serviceSelect = screen.getByLabelText('Услуга');
    fireEvent.change(serviceSelect, { target: { value: '1' } });
    await waitFor(() => {
      expect(serviceSelect).toHaveValue('1');
    });
  });

  it('displays loading state while searching', () => {
    (useClinicSearch as jest.Mock).mockReturnValue({
      clinics: [],
      loading: true,
      error: null,
      searchClinics: mockSearchClinics
    });
    renderHomePage();
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('displays error message when search fails', () => {
    (useClinicSearch as jest.Mock).mockReturnValue({
      clinics: [],
      loading: false,
      error: 'Ошибка поиска',
      searchClinics: mockSearchClinics
    });
    renderHomePage();
    expect(screen.getByText('Ошибка поиска')).toBeInTheDocument();
  });

  it('displays empty state when no clinics found', () => {
    (useClinicSearch as jest.Mock).mockReturnValue({
      clinics: [],
      loading: false,
      error: null,
      searchClinics: mockSearchClinics
    });
    renderHomePage();
    expect(screen.getByText('Клиники не найдены')).toBeInTheDocument();
  });

  it('handles price range filter changes', async () => {
    renderHomePage();
    const priceRangeSelect = screen.getByLabelText('Ценовой диапазон');
    fireEvent.change(priceRangeSelect, { target: { value: '2' } });
    await waitFor(() => {
      expect(priceRangeSelect).toHaveValue('2');
    });
  });

  it('handles rating filter changes', async () => {
    renderHomePage();
    const ratingSelect = screen.getByLabelText('Минимальный рейтинг');
    fireEvent.change(ratingSelect, { target: { value: '4' } });
    await waitFor(() => {
      expect(ratingSelect).toHaveValue('4');
    });
  });

  it('handles parking filter changes', async () => {
    renderHomePage();
    const parkingCheckbox = screen.getByLabelText('Есть парковка');
    fireEvent.click(parkingCheckbox);
    await waitFor(() => {
      expect(parkingCheckbox).toBeChecked();
    });
  });

  it('handles 24h filter changes', async () => {
    renderHomePage();
    const isOpen24hCheckbox = screen.getByLabelText('Круглосуточно');
    fireEvent.click(isOpen24hCheckbox);
    await waitFor(() => {
      expect(isOpen24hCheckbox).toBeChecked();
    });
  });

  it('displays clinic distance correctly', () => {
    renderHomePage();
    expect(screen.getByText('1.5 км')).toBeInTheDocument();
  });

  it('displays clinic services correctly', () => {
    renderHomePage();
    expect(screen.getByText('Общая диагностика')).toBeInTheDocument();
    expect(screen.getByText('Хирургия')).toBeInTheDocument();
  });

  it('displays clinic working hours correctly', () => {
    renderHomePage();
    expect(screen.getByText('09:00 - 18:00')).toBeInTheDocument();
  });

  it('displays clinic rating and reviews count correctly', () => {
    renderHomePage();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('100 отзывов')).toBeInTheDocument();
  });

  it('navigates to clinic details when clicking on clinic card', () => {
    renderHomePage();
    const clinicCard = screen.getByText('Подробнее');
    if (clinicCard) {
      fireEvent.click(clinicCard);
      expect(mockNavigate).toHaveBeenCalledWith('/clinics/1');
    }
  });
}); 