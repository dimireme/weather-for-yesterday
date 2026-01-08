'use client';

import { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import Link from 'next/link';
import { useSettings } from '@/components/SettingsContext';
import { WeatherDisplay } from '@/components/WeatherDisplay';
import { SearchLocation } from '@/components/SearchLocation';
import { Coordinates } from '@/model/types';

const requestGeolocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (error) => reject(error)
    );
  });
};

export default function HomePage() {
  const { isUseMyLocation } = useSettings();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Проверяем разрешение на геолокацию и запрашиваем координаты при включении флага
  useEffect(() => {
    if (!isUseMyLocation) {
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
            setCoordinates(coords);
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
    const coords = await requestGeolocation();
    setCoordinates(coords);
  };

  const handleLocationModalCancel = () => {
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {!isUseMyLocation && (
          <SearchLocation onSetCoordinates={setCoordinates} />
        )}

        <WeatherDisplay coordinates={coordinates} />
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
