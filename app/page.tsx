'use client';

import { useState, useRef, useEffect } from 'react';
import { AutoComplete, message, Spin } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { useSettings } from '@/components/SettingsContext';
import WeatherDisplay from '@/components/WeatherDisplay';

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

interface SelectedCoordinates {
  latitude: number;
  longitude: number;
}

export default function HomePage() {
  const { isUseMyLocation, coordinates } = useSettings();
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<SelectedCoordinates | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleSelect: AutoCompleteProps['onSelect'] = (value, option) => {
    const locationOption = option as LocationOption;
    if (locationOption.location) {
      message.success(
        `Выбрана локация: ${locationOption.location.name}, ${locationOption.location.country}`
      );
      setSelectedCoordinates({
        latitude: locationOption.location.lat,
        longitude: locationOption.location.lon,
      });
    }
  };

  // Сбрасываем выбранные координаты при включении геолокации
  useEffect(() => {
    if (isUseMyLocation) {
      setSelectedCoordinates(null);
    }
  }, [isUseMyLocation]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const isGeolocationActive = isUseMyLocation && coordinates;
  // Используем координаты из геолокации, если она активна, иначе из выбранной локации
  const activeCoordinates = isGeolocationActive
    ? coordinates
    : selectedCoordinates;

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

      <WeatherDisplay coordinates={activeCoordinates} />
    </div>
  );
}
