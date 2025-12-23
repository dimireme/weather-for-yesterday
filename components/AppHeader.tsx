'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Dropdown, Switch } from 'antd';
import type { MenuProps } from 'antd';
import {
  TbMenu2,
  TbHome,
  TbInfoCircle,
  TbLock,
  TbMoon,
  TbTemperatureSnow,
} from 'react-icons/tb';
import { useSettings } from './SettingsContext';

// Предотвращает закрытие dropdown и вызывает callback
const stopPropagationAnd = (callback: () => void) => (e: React.MouseEvent) => {
  e.stopPropagation();
  callback();
};

export function AppHeader() {
  const router = useRouter();
  const { isDark, toggleTheme, temperatureUnit, toggleTemperatureUnit } =
    useSettings();

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
  ];

  return (
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
          icon={<TbMenu2 size={20} />}
          aria-label="Открыть меню"
        />
      </Dropdown>
    </header>
  );
}
