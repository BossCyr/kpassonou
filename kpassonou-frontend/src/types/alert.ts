export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface TotemMetrics {
  water_depth_cm?: number;
  flow_speed_ms?: number;
  rainfall_mm_h?: number;
  temperature_c?: number;
}

export interface TotemState {
  led_color?: 'green' | 'orange' | 'red';
  battery_percent?: number;
  signal_strength?: number;
}

export interface Alert {
  id: string;
  camera_id: string;
  source_type: 'camera' | 'totem';
  lat: number;
  lng: number;
  water_level: number;
  status: 'safe' | 'warning' | 'alert';
  timestamp: string;
  address: string;
  confidence?: number;
  image_url?: string;
  data_precision?: 'qualitative' | 'quantitative';
  metrics?: TotemMetrics;
  totem_state?: TotemState;
}

export interface AlertSummary {
  total_nodes: number;
  total_totems: number;
  total_cameras: number;
  active_alerts: number;
  last_update: string;
}

export interface AlertResponse {
  alerts: Alert[];
  summary: AlertSummary;
}
