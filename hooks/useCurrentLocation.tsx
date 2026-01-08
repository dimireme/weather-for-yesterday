'use client';

import { useEffect, useState } from 'react';
import { message } from 'antd';

import { Coordinates } from '@/model/types';
import {
  checkGeolocationPermission,
  requestGeolocation,
} from '@/services/geolocationService';

export const useCurrentLocation = (
  onSetCoordinates: (c: Coordinates) => void
) => {
  const [permissionState, setPermissionState] = useState<
    'granted' | 'prompt' | 'denied' | null
  >(null);

  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const permission = await checkGeolocationPermission();

      if (isMounted) {
        setPermissionState(permission);
      }

      if (permission === 'granted') {
        try {
          setRequesting(true);
          const coords = await requestGeolocation();

          if (isMounted) {
            onSetCoordinates(coords);
          }
        } catch (error) {
          if (!isMounted) return;

          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Не удалось получить геолокацию';

          message.error(`Не удалось получить геолокацию: ${errorMessage}`);
        } finally {
          if (isMounted) {
            setRequesting(false);
          }
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [onSetCoordinates]);

  const requestWithPrompt = async () => {
    try {
      setRequesting(true);
      const coords = await requestGeolocation();

      onSetCoordinates(coords);

      setPermissionState('granted');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Не удалось получить геолокацию';

      message.error(`Не удалось получить геолокацию: ${errorMessage}`);
    } finally {
      setRequesting(false);
    }
  };

  return {
    permissionState,
    requesting,
    requestWithPrompt,
  };
};
