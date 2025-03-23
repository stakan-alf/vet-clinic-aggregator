export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: File;
}

export interface FavoriteClinic {
  id: number;
  name: string;
  address: string;
  rating: number;
  image?: string;
  added_at: string;
} 