'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, Switch, Modal, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  TbMenu2,
  TbHome,
  TbInfoCircle,
  TbLock,
  TbMoon,
  TbTemperatureSnow,
  TbCurrentLocation,
} from 'react-icons/tb';
import { useSettings } from './SettingsContext';

// Предотвращает закрытие dropdown и вызывает callback
const stopPropagationAnd = (callback: () => void) => (e: React.MouseEvent) => {
  e.stopPropagation();
  callback();
};

export function AppHeader() {
  const router = useRouter();
  const {
    isDark,
    toggleTheme,
    temperatureUnit,
    toggleTemperatureUnit,
    isUseMyLocation,
    toggleUseMyLocation,
    requestGeolocation,
  } = useSettings();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const checkGeolocationPermission = async (): Promise<
    'granted' | 'prompt' | 'denied'
  > => {
    if (!navigator.permissions) {
      // Permissions API не поддерживается, возвращаем 'prompt' чтобы показать модалку
      return 'prompt';
    }

    try {
      const result = await navigator.permissions.query({
        name: 'geolocation' as PermissionName,
      });
      return result.state as 'granted' | 'prompt' | 'denied';
    } catch (error) {
      // Если не удалось проверить, возвращаем 'prompt'
      return 'prompt';
    }
  };

  const handleLocationToggle = async () => {
    if (isUseMyLocation) {
      // Если выключаем - просто выключаем
      toggleUseMyLocation();
    } else {
      // Проверяем разрешение на геолокацию
      const permission = await checkGeolocationPermission();

      if (permission === 'granted') {
        // Разрешение уже есть - сразу запрашиваем геолокацию без модалки
        await handleLocationModalOk();
      } else {
        // Разрешения нет или оно denied - показываем модальное окно
        setIsLocationModalOpen(true);
      }
    }
  };

  const handleLocationModalOk = async () => {
    setIsLocationModalOpen(false);
    try {
      await requestGeolocation();
      toggleUseMyLocation();
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

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <TbHome size={18} />,
      label: 'Home',
      onClick: () => router.push('/'),
    },
    {
      key: '/privacy',
      icon: <TbLock size={18} />,
      label: 'Privacy',
      onClick: () => router.push('/privacy'),
    },
    {
      key: '/about',
      icon: <TbInfoCircle size={18} />,
      label: 'About',
      onClick: () => router.push('/about'),
    },
    {
      type: 'divider',
    },
    {
      key: 'theme',
      icon: <TbMoon size={18} />,
      label: (
        <div
          className="flex items-center justify-between gap-4 w-full"
          onClick={stopPropagationAnd(toggleTheme)}
        >
          <span>Dark Theme</span>
          <Switch size="small" checked={isDark} />
        </div>
      ),
    },
    {
      key: 'unit',
      icon: <TbTemperatureSnow size={18} />,
      label: (
        <div
          className="flex items-center justify-between gap-4 w-full"
          onClick={stopPropagationAnd(toggleTemperatureUnit)}
        >
          <span>Use °F</span>
          <Switch size="small" checked={temperatureUnit === 'fahrenheit'} />
        </div>
      ),
    },
    {
      key: 'location',
      icon: <TbCurrentLocation size={18} />,
      label: (
        <div
          className="flex items-center justify-between gap-4 w-full"
          onClick={stopPropagationAnd(handleLocationToggle)}
        >
          <span>Use my location</span>
          <Switch size="small" checked={isUseMyLocation} />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="text-xl font-semibold no-underline"
          style={{ color: isDark ? '#fff' : '#1f2937' }}
        >
          Weather For Yesterday
        </Link>

        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<TbMenu2 size={24} />}
            aria-label="Открыть меню"
          />
        </Dropdown>
      </header>

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
