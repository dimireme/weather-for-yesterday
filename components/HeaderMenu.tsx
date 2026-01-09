import { Dropdown, Switch, Button } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import {
  TbMenu2,
  TbHome,
  TbInfoCircle,
  TbLock,
  TbMoon,
  TbTemperatureSnow,
  TbCurrentLocation,
} from 'react-icons/tb';

import { TemperatureUnit } from '@/model/types';
import { useSettings } from './SettingsContext';

// Предотвращает закрытие dropdown и вызывает callback
const stopPropagationAnd = (callback: () => void) => (e: React.MouseEvent) => {
  e.stopPropagation();
  callback();
};

export const HeaderMenu = () => {
  const router = useRouter();
  const {
    isDark,
    toggleTheme,
    temperatureUnit,
    toggleTemperatureUnit,
    isUseMyLocation,
    toggleUseMyLocation,
  } = useSettings();

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
          <Switch
            size="small"
            checked={temperatureUnit === TemperatureUnit.F}
          />
        </div>
      ),
    },
    {
      key: 'location',
      icon: <TbCurrentLocation size={18} />,
      label: (
        <div
          className="flex items-center justify-between gap-4 w-full"
          onClick={stopPropagationAnd(toggleUseMyLocation)}
        >
          <span>Use my location</span>
          <Switch size="small" checked={isUseMyLocation} />
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Button type="text" icon={<TbMenu2 size={24} />} aria-label="Open menu" />
    </Dropdown>
  );
};
