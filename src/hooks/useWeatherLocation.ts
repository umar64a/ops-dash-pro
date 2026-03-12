import { useEffect } from 'react';
import { loadWeather } from '../store/weatherSlice';
import { reverseGeocode } from '../utils/locationUtils';
import { useAppDispatch } from '../hooks/reduxHooks';
export const useWeatherLocation = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch(
        loadWeather({
          lat: 31.5204,
          lon: 74.3587,
          city: 'Lahore',
          countryCode: 'PK',
        }),
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        const { city, countryCode } = await reverseGeocode(latitude, longitude);
        dispatch(
          loadWeather({
            lat: latitude,
            lon: longitude,
            city,
            countryCode,
          }),
        );
      },
      () => {
        dispatch(
          loadWeather({
            lat: 31.5204,
            lon: 74.3587,
            city: 'Lahore',
            countryCode: 'PK',
          }),
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [dispatch]);
};
