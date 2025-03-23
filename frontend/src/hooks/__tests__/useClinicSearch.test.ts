import { renderHook, act } from '@testing-library/react';
import { useClinicSearch } from '../useClinicSearch';
import { api } from '../../services/api';

// Мокаем API
jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn()
  }
}));

describe('useClinicSearch', () => {
  const mockLocation = {
    lat: () => 55.7558,
    lng: () => 37.6173
  };

  const mockFilters = {
    service: 1,
    price_range: 2,
    rating: 4,
    has_parking: true,
    is_open_24h: false
  };

  const mockClinics = [
    {
      id: '1',
      name: 'Test Clinic',
      address: 'Test Address',
      rating: 4.5,
      reviewsCount: 10,
      isOpen: true,
      distance: 1000,
      services: ['Service 1', 'Service 2'],
      latitude: 55.7558,
      longitude: 37.6173,
      workingHours: {
        open: '09:00',
        close: '18:00'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useClinicSearch());

    expect(result.current.clinics).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('successfully searches clinics', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockClinics });

    const { result } = renderHook(() => useClinicSearch());

    await act(async () => {
      await result.current.searchClinics(mockLocation, mockFilters);
    });

    expect(api.get).toHaveBeenCalledWith('/clinics/search', {
      params: {
        lat: mockLocation.lat(),
        lng: mockLocation.lng(),
        ...mockFilters
      }
    });

    expect(result.current.clinics).toEqual(mockClinics);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles search error', async () => {
    const errorMessage = 'API Error';
    (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useClinicSearch());

    await act(async () => {
      await result.current.searchClinics(mockLocation, mockFilters);
    });

    expect(result.current.clinics).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Произошла ошибка при поиске клиник. Пожалуйста, попробуйте позже.');
  });

  it('sets loading state during search', async () => {
    (api.get as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const { result } = renderHook(() => useClinicSearch());

    act(() => {
      result.current.searchClinics(mockLocation, mockFilters);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
  });
}); 