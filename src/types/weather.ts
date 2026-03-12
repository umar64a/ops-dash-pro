export interface WeatherItem {
  id: string;
  location: string;
  temperature: number;
  description: string;
  updatedAt: string;
  isDay: boolean;
  unit: 'C' | 'F';
  isCached?: boolean;
}
export interface WeatherState {
  data: WeatherItem | null;
  loading: boolean;
  error: string | null;
}