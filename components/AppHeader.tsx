'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Drawer, Menu } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link href="/">Главная</Link>,
  },
  {
    key: '/about',
    icon: <InfoCircleOutlined />,
    label: <Link href="/about">О приложении</Link>,
  },
  {
    key: '/privacy',
    icon: <LockOutlined />,
    label: <Link href="/privacy">Конфиденциальность</Link>,
  },
];

export function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200">
      <Link
        href="/"
        className="text-xl font-semibold text-gray-800 no-underline"
      >
        Weather For Yesterday
      </Link>

      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        aria-label="Открыть меню"
      />

      <Drawer
        title="Меню"
        placement="right"
        onClose={closeDrawer}
        open={drawerOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={closeDrawer}
          selectable={false}
        />
      </Drawer>
    </header>
  );
}
