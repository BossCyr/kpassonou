'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from '@/types/alert';
import StatusBadge from './StatusBadge';

// Fix for default marker icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Custom markers by status
const getMarkerColor = (status: string) => {
  switch (status) {
    case 'alert': return '🔴';
    case 'warning': return '🟡';
    default: return '🟢';
  }
};

interface MapProps {
  alerts: Alert[];
}

export default function Map({ alerts }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    );
  }

  // Center on Cotonou
  const center: [number, number] = [6.3654, 2.4183];

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.lat, alert.lng]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">
                  {getMarkerColor(alert.status)} {alert.camera_id}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{alert.address}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Niveau d&apos;eau:</span>{' '}
                    <span className={alert.water_level > 0.6 ? 'text-red-600 font-bold' : ''}>
                      {(alert.water_level * 100).toFixed(0)}%
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Statut:</span>{' '}
                    <StatusBadge status={alert.status} />
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
