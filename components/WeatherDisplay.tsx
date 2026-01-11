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
  const { current, yesterday, location } = weatherData;

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
      {location && (
        <Typography.Text strong>
          {location.name}, {location.region}, {location.country}
        </Typography.Text>
      )}

      {(current || yesterday) && (
        <div className="grid grid-cols-2 gap-4 w-full">
          {yesterday && (
            <HourWeatherCard weather={yesterday} title="Yesterday" />
          )}

          {current && <HourWeatherCard weather={current} title="Today" />}
        </div>
      )}
    </>
  );
};
