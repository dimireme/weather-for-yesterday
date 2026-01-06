'use client';

import { useEffect } from 'react';
import { Typography, Spin, Card } from 'antd';

import { useFetchWeather } from '@/hooks/useFetchWeather';
import { HourWeatherCard } from './HourWeatherCard';

const { Text } = Typography;

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface WeatherDisplayProps {
  coordinates?: Coordinates | null;
}

export default function WeatherDisplay({ coordinates }: WeatherDisplayProps) {
  const { fetchWeather, loading, error, weatherData } = useFetchWeather();

  // Автоматическая загрузка погоды при изменении координат
  useEffect(() => {
    if (coordinates) {
      fetchWeather(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates?.latitude, coordinates?.longitude, fetchWeather]);

  if (!coordinates) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      {weatherData.location && (
        <Text strong>
          {weatherData.location.name}, {weatherData.location.region},{' '}
          {weatherData.location.country}
        </Text>
      )}

      {(weatherData.current || weatherData.yesterday) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {weatherData.current && (
            <HourWeatherCard weather={weatherData.current} />
          )}

          {weatherData.yesterday && (
            <HourWeatherCard weather={weatherData.yesterday} />
          )}
        </div>
      )}
    </>
  );
}
