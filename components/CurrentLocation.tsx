'use client';

import { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import Link from 'next/link';

import { Coordinates, GeolocationPermission } from '@/model/types';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';

interface Props {
  onSetCoordinates: (coordinates: Coordinates) => void;
}

export const CurrentLocation: React.FC<Props> = ({ onSetCoordinates }) => {
  const { permissionState, requesting, requestWithPrompt } =
    useCurrentLocation(onSetCoordinates);

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
  };

  if (requesting) {
    return <Spin size="small" />;
  }

  return (
    <Modal
      title="Разрешение доступа к геолокации"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="ОК"
      cancelText="Отмена"
    >
      <p>
        Вам нужно разрешить доступ к вашей геолокации. Разрешите это в браузере.
      </p>
      <p>
        Если нажмёте ОК, вы соглашаетесь с{' '}
        <Link href="/privacy" onClick={() => setIsModalOpen(false)}>
          политикой конфиденциальности
        </Link>
        .
      </p>
    </Modal>
  );
};
