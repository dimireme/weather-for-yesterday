'use client';

import { useState, useRef, useEffect } from 'react';
import { AutoComplete, message, Spin, Modal } from 'antd';
import type { AutoCompleteProps } from 'antd';
import Link from 'next/link';
import { useSettings } from '@/components/SettingsContext';
import WeatherDisplay from '@/components/WeatherDisplay';
import { requestGeolocation } from '@/model/lib/requestGeolocation';

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
  const { isUseMyLocation } = useSettings();
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<SelectedCoordinates | null>(null);
  const [geolocationCoordinates, setGeolocationCoordinates] =
    useState<SelectedCoordinates | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
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

  // Проверяем разрешение на геолокацию и запрашиваем координаты при включении флага
  useEffect(() => {
    if (!isUseMyLocation) {
      setGeolocationCoordinates(null);
      return;
    }

    let isMounted = true;

    const checkAndRequestGeolocation = async () => {
      const checkGeolocationPermission = async (): Promise<
        'granted' | 'prompt' | 'denied'
      > => {
        if (!navigator.permissions) {
          return 'prompt';
        }

        try {
          const result = await navigator.permissions.query({
            name: 'geolocation' as PermissionName,
          });
          return result.state as 'granted' | 'prompt' | 'denied';
        } catch (error) {
          return 'prompt';
        }
      };

      const permission = await checkGeolocationPermission();

      if (permission === 'granted') {
        // Разрешение уже есть - сразу запрашиваем геолокацию
        try {
          const coords = await requestGeolocation();
          if (isMounted) {
            setGeolocationCoordinates(coords);
            message.success('Геолокация успешно определена');
          }
        } catch (error) {
          if (isMounted) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : 'Не удалось получить геолокацию';
            message.error(`Не удалось получить геолокацию: ${errorMessage}`);
          }
        }
      } else {
        // Разрешения нет или оно denied - показываем модальное окно
        if (isMounted) {
          setIsLocationModalOpen(true);
        }
      }
    };

    checkAndRequestGeolocation();

    return () => {
      isMounted = false;
    };
  }, [isUseMyLocation, requestGeolocation]);

  const handleLocationModalOk = async () => {
    setIsLocationModalOpen(false);
    try {
      const coords = await requestGeolocation();
      setGeolocationCoordinates(coords);
      message.success('Геолокация успешно определена');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Не удалось получить геолокацию';
      message.error(`Не удалось получить геолокацию: ${errorMessage}`);
    }
  };

  const handleLocationModalCancel = () => {
    setIsLocationModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const isGeolocationActive = isUseMyLocation && geolocationCoordinates;
  // Используем координаты из геолокации, если она активна, иначе из выбранной локации
  const activeCoordinates = isGeolocationActive
    ? geolocationCoordinates
    : selectedCoordinates;

  return (
    <>
      <div className="flex flex-col gap-6">
        {!isGeolocationActive && (
          <AutoComplete
            className="w-full"
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Введите город или адрес..."
            value={searchValue}
            notFoundContent={loading ? <Spin size="small" /> : null}
            allowClear
          />
        )}

        <WeatherDisplay coordinates={activeCoordinates} />
      </div>

      <Modal
        title="Разрешение доступа к геолокации"
        open={isLocationModalOpen}
        onOk={handleLocationModalOk}
        onCancel={handleLocationModalCancel}
        okText="ОК"
        cancelText="Отмена"
      >
        <p>
          Вам нужно разрешить доступ к вашей геолокации. Разрешите это в
          браузере.
        </p>
        <p>
          Если нажмёте ОК, вы соглашаетесь с{' '}
          <Link href="/privacy" onClick={() => setIsLocationModalOpen(false)}>
            политикой конфиденциальности
          </Link>
          .
        </p>
      </Modal>
    </>
  );
}
