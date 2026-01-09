'use client';

import { Typography, Spin } from 'antd';
import { useWeather } from '@/hooks/useWeather';
import { Coordinates } from '@/model/types';

import { HourWeatherCard } from './HourWeatherCard';

interface Props {
  coordinates?: Coordinates | null;
}

export const WeatherDisplay: React.FC<Props> = ({ coordinates }) => {
  const { loading, weatherData } = useWeather(coordinates);

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

  return (
    <>
      {weatherData.location && (
        <Typography.Text strong>
          {weatherData.location.name}, {weatherData.location.region},{' '}
          {weatherData.location.country}
        </Typography.Text>
      )}

      {(weatherData.current || weatherData.yesterday) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {weatherData.yesterday && (
            <HourWeatherCard
              weather={weatherData.yesterday}
              title="Yesterday"
            />
          )}

          {weatherData.current && (
            <HourWeatherCard weather={weatherData.current} title="Today" />
          )}
        </div>
      )}
    </>
  );
};
