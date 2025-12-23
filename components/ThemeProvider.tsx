'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext';

interface ThemeProviderProps {
  children: ReactNode;
}

function AntdThemeProvider({ children }: ThemeProviderProps) {
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
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <SettingsProvider>
      <AntdThemeProvider>{children}</AntdThemeProvider>
    </SettingsProvider>
  );
}
