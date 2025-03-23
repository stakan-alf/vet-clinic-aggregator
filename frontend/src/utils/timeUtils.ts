interface WorkingHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

export const isClinicOpen = (workingHours: WorkingHours): boolean => {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // Преобразуем день недели в формат API (0 = sunday, 1 = monday, etc.)
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDayName = dayNames[currentDay];

  const todayHours = workingHours[currentDayName];
  if (!todayHours) return false;

  const [openHour, openMinute] = todayHours.open.split(':').map(Number);
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);

  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  return currentTime >= openTime && currentTime <= closeTime;
}; 