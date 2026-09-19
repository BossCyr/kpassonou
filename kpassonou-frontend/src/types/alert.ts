export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Alert {
  id: string;
  camera_id: string;
  lat: number;
  lng: number;
  water_level: number;
  status: 'safe' | 'warning' | 'alert';
  timestamp: string;
  address: string;
  confidence?: number;
  image_url?: string;
}

export interface AlertSummary {
  total_cameras: number;
  active_alerts: number;
  last_update: string;
}

export interface AlertResponse {
  alerts: Alert[];
  summary: AlertSummary;
}
