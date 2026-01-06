import { useCallback, useState, useRef } from 'react';

import { WeatherApiHistoryResponse, WeatherData } from '@/model/types';

const EMPTY_WEATHER_DATA: WeatherData = {
  current: null,
  yesterday: null,
  location: null,
};

export const useFetchWeather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] =
    useState<WeatherData>(EMPTY_WEATHER_DATA);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    // Отменяем предыдущий запрос
    abortControllerRef.current?.abort();

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    try {
      const today = Math.floor(Date.now() / 1000);
      const yesterday = today - 24 * 60 * 60;
      const currentHour = new Date().getHours();

      const params = new URLSearchParams({
        q: `${lat},${lon}`,
        unixdt: yesterday.toString(),
        unixend_dt: today.toString(),
        hour: currentHour.toString(),
      });

      const response = await fetch(`/api/weather?${params.toString()}`, {
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) return;

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при получении данных о погоде');
        setWeatherData(EMPTY_WEATHER_DATA);
        return;
      }

      const data: WeatherApiHistoryResponse = await response.json();

      if (abortController.signal.aborted) return;

      const forecast = data.forecast?.forecastday;
      if (!forecast?.length) {
        setError('Не удалось получить данные о погоде');
        setWeatherData(EMPTY_WEATHER_DATA);
        return;
      }

      const firstDay = forecast[0];
      const lastDay = forecast[forecast.length - 1];

      setWeatherData({
        location: data.location ?? null,
        current: lastDay.hour?.[0] ?? null,
        yesterday: firstDay.hour?.[0] ?? null,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      setError(
        (err as Error).message || 'Ошибка при получении данных о погоде'
      );
      setWeatherData(EMPTY_WEATHER_DATA);
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  return { fetchWeather, loading, error, weatherData };
};
