import React from 'react';
import { isClinicOpen } from '../../utils/timeUtils';

interface WorkingHoursProps {
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

const WorkingHours: React.FC<WorkingHoursProps> = ({ workingHours }) => {
  const weekDays = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
  };

  const isOpen = isClinicOpen(workingHours);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Часы работы</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
            {isOpen ? 'Открыто' : 'Закрыто'}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(workingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center py-1">
            <span className="text-gray-600">{weekDays[day as keyof typeof weekDays]}</span>
            <span className="font-medium">
              {hours.open} - {hours.close}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHours; 