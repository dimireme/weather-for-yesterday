'use client';

import { ConfigProvider, theme } from 'antd';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Обёртка для antd ConfigProvider
 * Место для будущей логики переключения темы
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // TODO: добавить логику переключения темы (localStorage)
  const isDark = false;

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
