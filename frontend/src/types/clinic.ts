export interface WorkingHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewsCount: number;
  isOpen: boolean;
  distance: number;
  services: string[];
  latitude: number;
  longitude: number;
  workingHours: WorkingHours;
} 