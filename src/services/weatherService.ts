import { db } from './db';
import type { WeatherItem } from '../types/weather';
import { weatherMapping } from '../utils/weatherMapping';
import { getDefaultUnit, convertTemp } from '../utils/tempUtils';
import { apiClient } from './apiClient';
const CACHE_TTL = 1000 * 60 * 15;
interface OpenMeteoResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    is_day: number;
  };
}
export const fetchWeather = async (
  lat: number,
  lon: number,
  city: string,
  countryCode: string,
): Promise<WeatherItem> => {
  const cacheKey = `weather_${city.toLowerCase()}`;
  const cached = await db.weatherCache.get(cacheKey);
  if (!navigator.onLine) {
    if (cached) {
      return {
        ...(cached.data || cached),
        isCached: true,
      };
    }
    const last = await db.weatherCache.orderBy('cachedAt').last();
    if (last) return { ...(last.data || last), isCached: true };
    throw new Error('No internet connection & no offline data');
  }
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
    return { ...(cached.data || cached), isCached: false };
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  try {
    const data = await apiClient<OpenMeteoResponse>(url);
    const code = data.current_weather.weathercode;
    const baseTemp = data.current_weather.temperature;
    const unit = getDefaultUnit(countryCode);
    const convertedTemp = convertTemp(baseTemp, unit);
    const weather: WeatherItem = {
      id: cacheKey,
      location: city,
      temperature: convertedTemp,
      description: weatherMapping[code]?.description ?? 'Unknown weather',
      updatedAt: new Date().toISOString(),
      isDay: data.current_weather.is_day === 1,
      unit,
      isCached: false,
    };
    await db.weatherCache.put({
      id: cacheKey,
      data: weather,
      cachedAt: Date.now(),
    });
    return weather;
  } catch (err) {
    let errorMsg = 'Weather fetch failed';
    if (err instanceof Error) errorMsg = err.message;
    if (cached) {
      return { ...(cached.data || cached), isCached: true };
    }
    throw new Error(errorMsg);
  }
};