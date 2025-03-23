import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Location } from '../../types/filters';

interface SearchBarProps {
  onSearch: (location: Location) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Временное решение: используем координаты Москвы
    onSearch({ lat: 55.7558, lng: 37.6173 });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Введите адрес для поиска клиник"
        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </form>
  );
}; 