import { useEffect } from 'react';
import { Coordinates } from '@/model/types';
import { useFetchWeather } from './useFetchWeather';

export const useWeather = (coordinates?: Coordinates | null) => {
  const weather = useFetchWeather();

  useEffect(() => {
    if (coordinates) {
      weather.fetchWeather(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates?.latitude, coordinates?.longitude]);

  return weather;
};
