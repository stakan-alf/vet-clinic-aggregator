export interface Filters {
  service: number;
  price_range: number;
  rating: number;
  has_parking: boolean;
  is_open_24h: boolean;
}

export interface Location {
  lat: number;
  lng: number;
} 