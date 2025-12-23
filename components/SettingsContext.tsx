'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface SettingsContextType {
  isDark: boolean;
  toggleTheme: () => void;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const THEME_KEY = 'w4y_theme';
const UNIT_KEY = 'w4y_temperature_unit';

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>('celsius');
  const [mounted, setMounted] = useState(false);

  // Загрузка настроек из localStorage при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedUnit = localStorage.getItem(UNIT_KEY) as TemperatureUnit | null;

    if (savedTheme === 'dark') {
      setIsDark(true);
    }
    if (savedUnit === 'fahrenheit') {
      setTemperatureUnit('fahrenheit');
    }
    setMounted(true);
  }, []);

  // Сохранение темы
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    }
  }, [isDark, mounted]);

  // Сохранение единиц измерения
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(UNIT_KEY, temperatureUnit);
    }
  }, [temperatureUnit, mounted]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleTemperatureUnit = () =>
    setTemperatureUnit((prev) =>
      prev === 'celsius' ? 'fahrenheit' : 'celsius'
    );

  return (
    <SettingsContext.Provider
      value={{ isDark, toggleTheme, temperatureUnit, toggleTemperatureUnit }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
