import React from 'react';
import { FaStethoscope } from 'react-icons/fa';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ServicesListProps {
  services: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FaStethoscope className="text-blue-500" />
        <h2 className="text-xl font-semibold">Услуги</h2>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{service.name}</h3>
                <p className="text-gray-600 mt-1">{service.description}</p>
              </div>
              <span className="font-semibold text-blue-600">
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList; 