import React from 'react';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Filters } from '../../types/filters';

interface SearchFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const serviceOptions = [
  { value: 1, label: 'Общая диагностика' },
  { value: 2, label: 'Хирургия' },
  { value: 3, label: 'Вакцинация' },
  { value: 4, label: 'Стоматология' },
  { value: 5, label: 'УЗИ' },
  { value: 6, label: 'Рентген' },
  { value: 7, label: 'Лабораторные анализы' },
  { value: 8, label: 'Груминг' },
  { value: 9, label: 'Стационар' },
  { value: 10, label: 'Вызов на дом' }
];

const priceRangeOptions = [
  { value: 0, label: 'Все цены' },
  { value: 1, label: 'До 1000₽' },
  { value: 2, label: '1000₽ - 3000₽' },
  { value: 3, label: 'От 3000₽' }
];

const ratingOptions = [
  { value: 0, label: 'Любой рейтинг' },
  { value: 4, label: 'От 4 звезд' },
  { value: 4.5, label: 'От 4.5 звезд' }
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Услуга
        </label>
        <Select
          value={filters.service}
          onChange={(value) => onFilterChange({ ...filters, service: value })}
          options={serviceOptions}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ценовой диапазон
        </label>
        <Select
          value={filters.price_range}
          onChange={(value) => onFilterChange({ ...filters, price_range: value })}
          options={priceRangeOptions}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Минимальный рейтинг
        </label>
        <Select
          value={filters.rating}
          onChange={(value) => onFilterChange({ ...filters, rating: value })}
          options={ratingOptions}
        />
      </div>

      <div className="space-y-2">
        <Checkbox
          label="Есть парковка"
          checked={filters.has_parking}
          onChange={(checked) => onFilterChange({ ...filters, has_parking: checked })}
        />
        <Checkbox
          label="Круглосуточно"
          checked={filters.is_open_24h}
          onChange={(checked) => onFilterChange({ ...filters, is_open_24h: checked })}
        />
      </div>
    </div>
  );
}; 