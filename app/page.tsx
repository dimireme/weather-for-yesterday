'use client';

import { useState, useRef, useEffect } from 'react';
import { Typography, AutoComplete, message, Spin } from 'antd';
import type { AutoCompleteProps } from 'antd';

const { Title, Paragraph } = Typography;

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

export default function HomePage() {
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
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
      // Здесь можно добавить логику для получения погоды
      console.log('Выбранная локация:', locationOption.location);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Title level={2}>Добро пожаловать в W4Y Weather</Title>
      <Paragraph>
        Введите название города или адрес для поиска локации и просмотра погоды.
      </Paragraph>

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
    </div>
  );
}
