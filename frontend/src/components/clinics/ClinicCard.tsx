import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
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

interface ClinicCardProps {
  clinic: Clinic;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const navigate = useNavigate();

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} м`;
    }
    return `${(meters / 1000).toFixed(1)} км`;
  };

  const getCurrentDayWorkingHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    return clinic.workingHours[currentDay as keyof WorkingHours];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
          <div className="flex items-center mt-1 text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{clinic.address}</span>
            <span className="mx-2">•</span>
            <span>{formatDistance(clinic.distance)}</span>
          </div>
        </div>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-gray-700">{clinic.rating.toFixed(1)}</span>
          <span className="ml-1 text-gray-500">({clinic.reviewsCount} отзывов)</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1" />
          <span>{getCurrentDayWorkingHours().open} - {getCurrentDayWorkingHours().close}</span>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Услуги:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {clinic.services.map((service, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {service}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate(`/clinics/${clinic.id}`)}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
}; 