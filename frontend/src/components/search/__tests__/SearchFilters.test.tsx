import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchFilters } from '../SearchFilters';

describe('SearchFilters', () => {
  const mockFilters = {
    service: 0,
    price_range: 0,
    rating: 0,
    has_parking: false,
    is_open_24h: false
  };

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders without crashing', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );
    expect(screen.getByText('Услуги')).toBeInTheDocument();
    expect(screen.getByText('Ценовой диапазон')).toBeInTheDocument();
    expect(screen.getByText('Рейтинг')).toBeInTheDocument();
  });

  it('renders all filter options', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Проверяем опции услуг
    expect(screen.getByText('Общая диагностика')).toBeInTheDocument();
    expect(screen.getByText('Хирургия')).toBeInTheDocument();
    expect(screen.getByText('Вакцинация')).toBeInTheDocument();

    // Проверяем опции ценового диапазона
    expect(screen.getByText('Все цены')).toBeInTheDocument();
    expect(screen.getByText('До 1000₽')).toBeInTheDocument();
    expect(screen.getByText('1000₽ - 3000₽')).toBeInTheDocument();
    expect(screen.getByText('От 3000₽')).toBeInTheDocument();

    // Проверяем опции рейтинга
    expect(screen.getByText('Любой рейтинг')).toBeInTheDocument();
    expect(screen.getByText('От 4 звезд')).toBeInTheDocument();
    expect(screen.getByText('От 4.5 звезд')).toBeInTheDocument();
  });

  it('handles service filter change', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const serviceSelect = screen.getByLabelText('Услуги');
    fireEvent.change(serviceSelect, { target: { value: '1' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      service: 1
    });
  });

  it('handles price range filter change', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const priceRangeSelect = screen.getByLabelText('Ценовой диапазон');
    fireEvent.change(priceRangeSelect, { target: { value: '2' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      price_range: 2
    });
  });

  it('handles rating filter change', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const ratingSelect = screen.getByLabelText('Рейтинг');
    fireEvent.change(ratingSelect, { target: { value: '4' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      rating: 4
    });
  });

  it('handles checkbox filter changes', () => {
    render(
      <SearchFilters
        filters={mockFilters}
        onFilterChange={mockOnFilterChange}
      />
    );

    const parkingCheckbox = screen.getByLabelText('Есть парковка');
    const open24hCheckbox = screen.getByLabelText('Круглосуточно');

    fireEvent.click(parkingCheckbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      has_parking: true
    });

    fireEvent.click(open24hCheckbox);
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockFilters,
      is_open_24h: true
    });
  });
}); 