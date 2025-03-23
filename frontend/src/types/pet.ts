export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  gender: 'male' | 'female';
  weight: number;
  photo?: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface Vaccination {
  id: number;
  name: string;
  date: string;
  next_date: string;
  clinic: string;
  doctor: string;
  document?: string;
}

export interface Visit {
  id: number;
  date: string;
  clinic: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  documents: string[];
}

export interface PetDocument {
  id: number;
  title: string;
  type: 'vaccination' | 'visit' | 'other';
  file: string;
  uploaded_at: string;
}

export interface PetCreateData {
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  gender: 'male' | 'female';
  weight: number;
  photo?: File;
}

export interface PetUpdateData extends Partial<PetCreateData> {
  id: number;
} 