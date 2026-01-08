import { useCallback, useRef, useState } from 'react';

import { WeatherData } from '@/model/types';
import {
  fetchWeatherByCoordinates,
  EMPTY_WEATHER_DATA,
} from '@/services/weatherService';

export const useFetchWeather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] =
    useState<WeatherData>(EMPTY_WEATHER_DATA);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(
    async (latitude: number, longitude: number) => {
      abortControllerRef.current?.abort();

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeatherByCoordinates({
          latitude,
          longitude,
          signal: abortController.signal,
        });

        if (!abortController.signal.aborted) {
          setWeatherData(data);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Ошибка при получении данных о погоде'
        );
        setWeatherData(EMPTY_WEATHER_DATA);
      } finally {
        if (abortControllerRef.current === abortController) {
          setLoading(false);
          abortControllerRef.current = null;
        }
      }
    },
    []
  );

  return { fetchWeather, loading, error, weatherData };
};
