'use client';

import { PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';

import { useSettings } from './SettingsContext';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { isDark } = useSettings();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
