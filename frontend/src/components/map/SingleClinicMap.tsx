import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Coordinates {
  lat: number;
  lng: number;
}

interface SingleClinicMapProps {
  coordinates: Coordinates;
  clinicName: string;
}

const SingleClinicMap: React.FC<SingleClinicMapProps> = ({ coordinates, clinicName }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(coordinates);
      mapRef.current.fitBounds(bounds);
    }
  }, [coordinates]);

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={coordinates}
          zoom={15}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          <Marker
            position={coordinates}
            title={clinicName}
            animation={google.maps.Animation.DROP}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default SingleClinicMap; 