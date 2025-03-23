import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ClinicInfo from '../components/clinics/ClinicInfo';
import WorkingHours from '../components/clinics/WorkingHours';
import ServicesList from '../components/clinics/ServicesList';
import SingleClinicMap from '../components/map/SingleClinicMap';
import FavoriteButton from '../components/ui/FavoriteButton';

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  services: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
  }>;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const ClinicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: clinic, isLoading, error } = useQuery<Clinic>({
    queryKey: ['clinic', id],
    queryFn: async () => {
      const response = await axios.get(`/api/clinics/${id}/`);
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (error || !clinic) {
    return <div className="flex justify-center items-center min-h-screen">Ошибка загрузки данных</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Левая колонка с основной информацией */}
        <div className="md:w-2/3 space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{clinic.name}</h1>
            <FavoriteButton clinicId={clinic.id} />
          </div>
          
          <ClinicInfo
            address={clinic.address}
            phone={clinic.phone}
            email={clinic.email}
          />
          
          <WorkingHours workingHours={clinic.workingHours} />
          
          <ServicesList services={clinic.services} />
        </div>

        {/* Правая колонка с картой */}
        <div className="md:w-1/3">
          <div className="sticky top-4">
            <SingleClinicMap
              coordinates={clinic.coordinates}
              clinicName={clinic.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailPage; 