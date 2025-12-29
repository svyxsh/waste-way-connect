import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';

// Fix for default icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const initialCenter = {
    lat: 51.505,
    lng: -0.09,
  };
  const [position, setPosition] = useState(initialCenter);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 200);
    }
  }, [map]);

  const markerHandlers = useMemo(
    () => ({
      dragend(event: L.DragEndEvent) {
        const marker = event.target;
        const newPos = marker.getLatLng();
        setPosition(newPos);
        onLocationSelect(newPos);
      },
    }),
    [onLocationSelect],
  );

  const handleCenterOnUser = () => {
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        const newPos = { lat: latitude, lng: longitude };
        setPosition(newPos);
        map?.flyTo(newPos, 15);
        onLocationSelect(newPos);
      },
      () => {
        alert("Could not get your location. Please enable location services in your browser.");
      }
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%' }}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={true}
          eventHandlers={markerHandlers}
          position={position}
          ref={null}
        >
          <Popup>Drag to select pickup location</Popup>
        </Marker>
      </MapContainer>
      <Button
        type="button"
        size="icon"
        onClick={handleCenterOnUser}
        className="absolute top-2 right-2 z-[1000]"
        aria-label="Center map on your location"
        disabled={!map}
      >
        <LocateFixed className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LocationPicker;
