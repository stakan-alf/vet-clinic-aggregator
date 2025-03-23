import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface ClinicInfoProps {
  address: string;
  phone: string;
  email: string;
}

const ClinicInfo: React.FC<ClinicInfoProps> = ({ address, phone, email }) => {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{address}</span>
        </div>

        <div className="flex items-center space-x-3">
          <FaPhone className="text-gray-500" />
          <button
            onClick={handleCall}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {phone}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-gray-500" />
          <button
            onClick={handleEmail}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {email}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo; 