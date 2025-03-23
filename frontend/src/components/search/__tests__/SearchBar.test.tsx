import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

// Мокаем Google Maps API
jest.mock('@react-google-maps/api', () => ({
  Autocomplete: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-autocomplete">{children}</div>
  ),
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders without crashing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Введите адрес для поиска клиник')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Введите адрес для поиска клиник');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('handles input changes', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Введите адрес для поиска клиник');
    fireEvent.change(input, { target: { value: 'Test Address' } });
    expect(input).toHaveValue('Test Address');
  });

  it('renders with correct styling', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Введите адрес для поиска клиник');
    expect(input).toHaveClass('w-full', 'p-3', 'border', 'rounded-lg', 'shadow-sm');
  });
}); 