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
      alert.status === 'alert' ? 'border-red-500 bg-red-50' :
      alert.status === 'warning' ? 'border-yellow-500 bg-yellow-50' :
      'border-green-500 bg-green-50'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-800">{alert.camera_id}</h3>
          <p className="text-sm text-gray-600">{alert.address}</p>
        </div>
        <StatusBadge status={alert.status} />
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
      
      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Confiance: {(alert.confidence || 0) * 100}%</span>
        <span>{new Date(alert.timestamp).toLocaleString('fr-FR')}</span>
      </div>
    </div>
  );
}
