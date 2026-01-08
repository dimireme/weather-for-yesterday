import { WeatherApiHistoryResponse, WeatherData } from '@/model/types';

export const EMPTY_WEATHER_DATA: WeatherData = {
  current: null,
  yesterday: null,
  location: null,
};

export interface FetchWeatherParams {
  latitude: number;
  longitude: number;
  signal?: AbortSignal;
}

export const fetchWeatherByCoordinates = async ({
  latitude,
  longitude,
  signal,
}: FetchWeatherParams): Promise<WeatherData> => {
  const today = Math.floor(Date.now() / 1000);
  const yesterday = today - 24 * 60 * 60;
  const currentHour = new Date().getHours();

  const params = new URLSearchParams({
    q: `${latitude},${longitude}`,
    unixdt: yesterday.toString(),
    unixend_dt: today.toString(),
    hour: currentHour.toString(),
  });

  const response = await fetch(`/api/weather?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error || 'Ошибка при получении данных о погоде');
  }

  const data: WeatherApiHistoryResponse = await response.json();

  const forecast = data.forecast?.forecastday;
  if (!forecast?.length) {
    throw new Error('Не удалось получить данные о погоде');
  }

  const firstDay = forecast[0];
  const lastDay = forecast[forecast.length - 1];

  return {
    location: data.location ?? null,
    current: lastDay.hour?.[0] ?? null,
    yesterday: firstDay.hour?.[0] ?? null,
  };
};
