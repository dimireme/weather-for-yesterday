'use client';

import { useState, useRef, useEffect } from 'react';
import { Typography, AutoComplete, message, Spin, Card } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { useSettings } from '@/components/SettingsContext';

const { Title, Paragraph, Text } = Typography;

interface LocationOption {
  value: string;
  label: string;
  location: {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
  };
}

interface WeatherData {
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  feelslike_c: number;
  feelslike_f: number;
  time: string;
  time_epoch: number;
}

interface LocationInfo {
  name: string;
  region: string;
  country: string;
}

export default function HomePage() {
  const { temperatureUnit, isUseMyLocation, coordinates } = useSettings();
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [weatherData, setWeatherData] = useState<{
    current: WeatherData | null;
    yesterday: WeatherData | null;
    location: LocationInfo | null;
  }>({ current: null, yesterday: null, location: null });
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadedCoordsRef = useRef<string | null>(null);

  const searchLocations = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const error = await response.json();
        message.error(error.error || 'Ошибка при поиске локации');
        setOptions([]);
        return;
      }

      const data = await response.json();

      if (data.locations && Array.isArray(data.locations)) {
        const locationOptions: LocationOption[] = data.locations.map(
          (loc: any) => ({
            value: `${loc.name}, ${loc.region}, ${loc.country}`,
            label: `${loc.name}, ${loc.region}, ${loc.country}`,
            location: {
              id: loc.id,
              name: loc.name,
              region: loc.region,
              country: loc.country,
              lat: loc.lat,
              lon: loc.lon,
            },
          })
        );
        setOptions(locationOptions);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Ошибка при поиске:', error);
      message.error('Не удалось выполнить поиск');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);
    try {
      const today = Math.floor(Date.now() / 1000);
      const yesterday = today - 24 * 60 * 60; // 24 часа назад
      const currentHour = new Date().getHours();

      const params = new URLSearchParams({
        q: `${lat},${lon}`,
        unixdt: yesterday.toString(),
        unixend_dt: today.toString(),
        hour: currentHour.toString(),
      });

      const response = await fetch(`/api/weather?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        message.error(error.error || 'Ошибка при получении данных о погоде');
        return;
      }

      const data = await response.json();

      // Извлекаем данные за текущий час и 24 часа назад
      let currentWeather: WeatherData | null = null;
      let yesterdayWeather: WeatherData | null = null;

      if (data.forecast?.forecastday && data.forecast.forecastday.length > 0) {
        // API возвращает данные за указанный час для каждого дня в диапазоне
        // Первый день - это 24 часа назад, последний - сегодня
        const firstDay = data.forecast.forecastday[0];
        const lastDay =
          data.forecast.forecastday[data.forecast.forecastday.length - 1];

        // Данные за 24 часа назад (первый день)
        if (firstDay.hour && firstDay.hour.length > 0) {
          const hourData = firstDay.hour[0];
          yesterdayWeather = {
            condition: hourData.condition,
            feelslike_c: hourData.feelslike_c,
            feelslike_f: hourData.feelslike_f,
            time: hourData.time,
            time_epoch: hourData.time_epoch,
          };
        }

        // Данные за текущий час (последний день)
        if (lastDay.hour && lastDay.hour.length > 0) {
          const hourData = lastDay.hour[0];
          currentWeather = {
            condition: hourData.condition,
            feelslike_c: hourData.feelslike_c,
            feelslike_f: hourData.feelslike_f,
            time: hourData.time,
            time_epoch: hourData.time_epoch,
          };
        }
      }

      // Сохраняем информацию о локации, если она есть в ответе
      const locationInfo: LocationInfo | null = data.location
        ? {
            name: data.location.name,
            region: data.location.region,
            country: data.location.country,
          }
        : null;

      setWeatherData({
        current: currentWeather,
        yesterday: yesterdayWeather,
        location: locationInfo,
      });
    } catch (error) {
      console.error('Ошибка при получении погоды:', error);
      message.error('Не удалось получить данные о погоде');
      return null;
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSelect: AutoCompleteProps['onSelect'] = (value, option) => {
    const locationOption = option as LocationOption;
    if (locationOption.location) {
      message.success(
        `Выбрана локация: ${locationOption.location.name}, ${locationOption.location.country}`
      );
      fetchWeather(locationOption.location.lat, locationOption.location.lon);
    }
  };

  // Автоматическая загрузка погоды при включённой геолокации
  useEffect(() => {
    if (isUseMyLocation && coordinates) {
      const coordsKey = `${coordinates.latitude},${coordinates.longitude}`;
      // Загружаем данные только если координаты изменились
      if (lastLoadedCoordsRef.current !== coordsKey) {
        lastLoadedCoordsRef.current = coordsKey;
        fetchWeather(coordinates.latitude, coordinates.longitude);
      }
    } else if (!isUseMyLocation) {
      // Сбрасываем при выключении геолокации
      lastLoadedCoordsRef.current = null;
      setWeatherData({ current: null, yesterday: null, location: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUseMyLocation, coordinates?.latitude, coordinates?.longitude]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const isGeolocationActive = isUseMyLocation && coordinates;

  return (
    <div className="flex flex-col gap-6">
      {!isGeolocationActive && (
        <div className="max-w-md">
          <AutoComplete
            style={{ width: '100%' }}
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Введите город или адрес..."
            value={searchValue}
            notFoundContent={loading ? <Spin size="small" /> : null}
            allowClear
          />
        </div>
      )}

      {weatherLoading && (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      )}

      {weatherData.location && (
        <Text strong>
          {weatherData.location.name}, {weatherData.location.region},{' '}
          {weatherData.location.country}
        </Text>
      )}

      {(weatherData.current || weatherData.yesterday) && !weatherLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {weatherData.current && (
            <Card title="Текущий час" className="w-full">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold">
                  {weatherData.current.condition.text}
                </div>
                <div className="text-2xl">
                  {temperatureUnit === 'celsius'
                    ? `${weatherData.current.feelslike_c}°C`
                    : `${weatherData.current.feelslike_f}°F`}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(weatherData.current.time).toLocaleString('ru-RU')}
                </div>
              </div>
            </Card>
          )}

          {weatherData.yesterday && (
            <Card title="24 часа назад" className="w-full">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold">
                  {weatherData.yesterday.condition.text}
                </div>
                <div className="text-2xl">
                  {temperatureUnit === 'celsius'
                    ? `${weatherData.yesterday.feelslike_c}°C`
                    : `${weatherData.yesterday.feelslike_f}°F`}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(weatherData.yesterday.time).toLocaleString('ru-RU')}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
