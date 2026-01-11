'use client';

import { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import Link from 'next/link';

import { Coordinates, GeolocationPermission } from '@/model/types';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { useSettings } from './SettingsContext';

interface Props {
  onSetCoordinates: (coordinates: Coordinates) => void;
}

export const CurrentLocation: React.FC<Props> = ({ onSetCoordinates }) => {
  const { permissionState, requesting, requestWithPrompt } =
    useCurrentLocation(onSetCoordinates);
  const { toggleUseMyLocation } = useSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Модалка показывается только если:
    // 1. Проверка разрешения завершена (permissionState !== null)
    // 2. Разрешение не granted (prompt или denied)
    // 3. Пользователь включил использование геолокации
    if (
      permissionState !== null &&
      permissionState !== GeolocationPermission.Granted
    ) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [permissionState]);

  const handleOk = async () => {
    setIsModalOpen(false);
    await requestWithPrompt();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    toggleUseMyLocation();
  };

  if (requesting) {
    return <Spin size="small" />;
  }

  return (
    <Modal
      title="Geolocation Access Permission"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="OK"
      cancelText="Cancel"
    >
      <p>
        By clicking OK, you consent to the use of your geolocation for the
        purpose of displaying weather information, in accordance with the{' '}
        <Link href="/privacy" onClick={() => setIsModalOpen(false)}>
          privacy policy
        </Link>
        .
      </p>
    </Modal>
  );
};
