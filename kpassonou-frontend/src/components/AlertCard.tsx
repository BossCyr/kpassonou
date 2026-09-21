import { Alert } from '@/types/alert';
import StatusBadge from './StatusBadge';

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const waterLevelPercent = (alert.water_level * 100).toFixed(0);
  
  const getWaterLevelColor = () => {
    if (alert.water_level >= 0.6) return 'bg-red-500';
    if (alert.water_level >= 0.3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border-l-4 ${
      alert.source_type === 'totem' ? 'border-blue-500' :
      alert.status === 'alert' ? 'border-red-500' :
      alert.status === 'warning' ? 'border-yellow-500' :
      'border-green-500'
    } ${
      alert.source_type === 'totem' ? 'bg-blue-50' :
      alert.status === 'alert' ? 'bg-red-50' :
      alert.status === 'warning' ? 'bg-yellow-50' :
      'bg-green-50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {alert.source_type === 'totem' ? '🚦' : '📷'}
          </span>
          <div>
            <h3 className="font-bold text-gray-800">{alert.camera_id}</h3>
            <p className="text-sm text-gray-600">{alert.address}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={alert.status} />
          <span className={`text-xs px-2 py-1 rounded ${
            alert.source_type === 'totem' 
              ? 'bg-blue-500 text-white' 
              : 'bg-purple-500 text-white'
          }`}>
            {alert.source_type === 'totem' ? 'TOTEM' : 'CAMÉRA'}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Niveau d&apos;eau</span>
          <span className="font-medium">{waterLevelPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getWaterLevelColor()}`}
            style={{ width: `${waterLevelPercent}%` }}
          ></div>
        </div>
      </div>
      
      {alert.source_type === 'totem' && alert.metrics && (
        <div className="mt-3 p-2 bg-white rounded text-xs">
          <p className="font-medium text-blue-600 mb-1">📊 Capteur:</p>
          <div className="grid grid-cols-2 gap-1">
            <span>💧 {alert.metrics.water_depth_cm} cm</span>
            <span>🌊 {alert.metrics.flow_speed_ms} m/s</span>
            <span>🌧️ {alert.metrics.rainfall_mm_h} mm/h</span>
            <span>🌡️ {alert.metrics.temperature_c}°C</span>
          </div>
        </div>
      )}
      
      {alert.source_type === 'totem' && alert.totem_state && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className={`w-3 h-3 rounded-full ${
            alert.totem_state.led_color === 'red' ? 'bg-red-500' :
            alert.totem_state.led_color === 'orange' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}></span>
          <span>LED {alert.totem_state.led_color?.toUpperCase()}</span>
          <span>|</span>
          <span>🔋 {alert.totem_state.battery_percent}%</span>
        </div>
      )}
      
      {alert.source_type === 'camera' && (
        <div className="mt-2 text-xs text-purple-600">
          🤖 Edge AI | Confiance: {((alert.confidence || 0) * 100).toFixed(0)}%
        </div>
      )}
      
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>{alert.data_precision === 'quantitative' ? 'Précis' : 'Estimé'}</span>
        <span>{new Date(alert.timestamp).toLocaleString('fr-FR')}</span>
      </div>
    </div>
  );
}
