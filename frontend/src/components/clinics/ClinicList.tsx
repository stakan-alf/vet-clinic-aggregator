import React, { useState } from 'react';
import { ClinicCard } from './ClinicCard';
import { Select } from '../ui/Select';
import { Clinic } from '../../types/clinic';

interface WorkingHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

interface ClinicListProps {
  clinics: Clinic[];
  loading: boolean;
  error: string | null;
}

const sortOptions = [
  { value: 1, label: 'По расстоянию' },
  { value: 2, label: 'По рейтингу' },
  { value: 3, label: 'По количеству отзывов' }
];

export const ClinicList: React.FC<ClinicListProps> = ({ clinics, loading, error }) => {
  const [sortBy, setSortBy] = useState<number>(1);

  const sortedClinics = [...clinics].sort((a, b) => {
    switch (sortBy) {
      case 1:
        return a.distance - b.distance;
      case 2:
        return b.rating - a.rating;
      case 3:
        return b.reviewsCount - a.reviewsCount;
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (clinics.length === 0) {
    return <div className="text-center py-8">Клиники не найдены</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Найдено клиник: {clinics.length}
        </h2>
        <Select
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
          className="w-48"
        />
      </div>

      <div className="space-y-4">
        {sortedClinics.map(clinic => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </div>
  );
}; 