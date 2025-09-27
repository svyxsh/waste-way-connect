import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface RequestMapProps {
  latitude: number;
  longitude: number;
}

const RequestMap: React.FC<RequestMapProps> = ({ latitude, longitude }) => {
  const position = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '200px', width: '100%', marginTop: '1rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Pickup Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RequestMap;
