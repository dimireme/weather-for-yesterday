import dayjs, { type Dayjs } from 'dayjs';
import { WeatherData } from '@/model/types';

export const EMPTY_WEATHER_DATA: WeatherData = {
  current: null,
  yesterday: null,
  location: null,
};

export interface FetchWeatherParams {
  latitude: number;
  longitude: number;
  signal: AbortSignal;
}

export const fetchWeatherByCoordinates = async ({
  latitude,
  longitude,
  signal,
}: FetchWeatherParams): Promise<WeatherData> => {
  const fetchForecast = createForecastFetcher(
    `${latitude},${longitude}`,
    signal,
  );

  const today = dayjs().startOf('hour').add(1, 'hour');
  const yesterday = today.subtract(1, 'day');

  const [todayData, yesterdayData] = await Promise.all([
    fetchForecast(today),
    fetchForecast(yesterday),
  ]);

  const todayHour = todayData.forecast?.forecastday?.[0]?.hour?.[0] ?? null;

  const yesterdayHour =
    yesterdayData.forecast?.forecastday?.[0]?.hour?.[0] ?? null;

  return {
    location: todayData.location ?? yesterdayData.location ?? null,
    current: todayHour,
    yesterday: yesterdayHour,
  };
};

function createForecastFetcher(location: string, signal: AbortSignal) {
  return async (date: Dayjs) => {
    const params = new URLSearchParams({
      q: location,
      dt: date.format('YYYY-MM-DD'),
      hour: date.hour().toString(),
    });

    const response = await fetch(`/api/weather?${params.toString()}`, {
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Error fetching weather data');
    }

    return response.json();
  };
}
