'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from '@/types/alert';
import StatusBadge from './StatusBadge';

// Custom markers for cameras
const cameraIcon = L.divIcon({
  html: '📷',
  className: 'text-2xl',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom markers for totems
const totemIcon = L.divIcon({
  html: '🚦',
  className: 'text-2xl',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Status-based background colors
const getStatusBg = (status: string) => {
  switch (status) {
    case 'alert': return 'bg-red-100 border-red-500';
    case 'warning': return 'bg-yellow-100 border-yellow-500';
    default: return 'bg-green-100 border-green-500';
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
            icon={alert.source_type === 'totem' ? totemIcon : cameraIcon}
          >
            <Popup>
              <div className={`p-3 min-w-[250px] rounded-lg border-2 ${getStatusBg(alert.status)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">
                    {alert.source_type === 'totem' ? '🚦' : '📷'}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">
                      {alert.camera_id}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.source_type === 'totem' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {alert.source_type === 'totem' ? 'TOTEM PUBLIC' : 'CAMÉRA PRIVÉE'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{alert.address}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Niveau d&apos;eau:</span>
                    <span className={`text-lg font-bold ${
                      alert.water_level > 0.6 ? 'text-red-600' : 
                      alert.water_level > 0.3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {(alert.water_level * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Statut:</span>
                    <StatusBadge status={alert.status} />
                  </div>
                  
                  {alert.source_type === 'totem' && alert.metrics && (
                    <div className="mt-2 p-2 bg-white rounded text-xs">
                      <p className="font-medium text-blue-600 mb-1">📊 Données capteur:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <span>💧 {alert.metrics.water_depth_cm} cm</span>
                        <span>🌊 {alert.metrics.flow_speed_ms} m/s</span>
                        <span>🌧️ {alert.metrics.rainfall_mm_h} mm/h</span>
                        <span>🌡️ {alert.metrics.temperature_c}°C</span>
                      </div>
                    </div>
                  )}
                  
                  {alert.source_type === 'totem' && alert.totem_state && (
                    <div className="mt-2 p-2 bg-white rounded text-xs">
                      <p className="font-medium text-blue-600 mb-1">🚦 État du totem:</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          alert.totem_state.led_color === 'red' ? 'bg-red-500' :
                          alert.totem_state.led_color === 'orange' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                        <span>LED {alert.totem_state.led_color?.toUpperCase()}</span>
                        <span>|</span>
                        <span>🔋 {alert.totem_state.battery_percent}%</span>
                        <span>|</span>
                        <span>📶 {alert.totem_state.signal_strength}%</span>
                      </div>
                    </div>
                  )}
                  
                  {alert.source_type === 'camera' && (
                    <div className="mt-2 p-2 bg-white rounded text-xs">
                      <p className="font-medium text-purple-600 mb-1">🤖 Edge AI:</p>
                      <span>Confiance: {((alert.confidence || 0) * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
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
