import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useWeatherLocation } from '../hooks/useWeatherLocation';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { getWeatherVisual } from '../utils/weatherBackground';
import './weather.css';
export default function Weather() {
  useWeatherLocation();
  const { isOnline, showOnlineMsg } = useOnlineStatus();
  const { data, loading, error } = useSelector((s: RootState) => s.weather);
  const visual = useMemo(() => {
    if (!data)
      return {
        video: '/videos/day.mp4',
        bgColor: 'rgba(0, 0, 0, 0.5)',
      };
    return getWeatherVisual(data.description, data.isDay);
  }, [data]);
  const temperature = useMemo(() => {
    if (!data) return '';
    return data.temperature.toFixed(1);
  }, [data]);
  return (
    <div className="weather-body">
      {!isOnline && (
        <div className="net-status">
          <span className="offline">Offline</span>
        </div>
      )}
      {showOnlineMsg && (
        <div className="net-status">
          <span className="online">Back Online</span>
        </div>
      )}
      {loading && !data &&<span className="loading">Loading...</span>}
      {error && !data && <span className="error">{error}</span>}
      {!data && !error && !loading && <span className="not-exist">Weather not found!</span>}
      {data && (
        <>
          <video autoPlay muted loop preload="auto" className="weather-video">
            <source src={visual.video} type="video/mp4" />
          </video>
          <div style={{ backgroundColor: visual.bgColor }} className="weather-con">
            <div>
              {data?.isCached && <span className="off-badge">Offline Data</span>}
              <h1>Weather</h1>
              <h2>{data.location}</h2>
              <span className="weather-temp">
                {temperature}°{data.unit}
              </span>
              <span className="weather-desc">{data.description}</span>
              <span className="weather-time">
                Updated: {new Date(data.updatedAt || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
