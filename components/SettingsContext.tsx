'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from 'react';
import { TemperatureUnit } from '@/model/types';
import { getCookie, setCookie } from '@/utils/cookies';

interface SettingsContextType {
  isDark: boolean;
  toggleTheme: () => void;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
  isUseMyLocation: boolean;
  toggleUseMyLocation: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const THEME_KEY = 'w4y_theme';
const UNIT_KEY = 'w4y_temperature_unit';
const USE_MY_LOCATION_KEY = 'w4y_use_my_location';

interface SettingsProviderProps extends PropsWithChildren {
  initialTheme?: boolean;
  initialTemperatureUnit?: TemperatureUnit;
  initialUseMyLocation?: boolean;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
  initialTheme = false,
  initialTemperatureUnit = TemperatureUnit.C,
  initialUseMyLocation = false,
}) => {
  const [isDark, setIsDark] = useState(initialTheme);
  const [temperatureUnit, setTemperatureUnit] = useState(
    initialTemperatureUnit
  );
  const [isUseMyLocation, setIsUseMyLocation] = useState(initialUseMyLocation);
  const [mounted, setMounted] = useState(false);

  // Загрузка настроек из cookies при монтировании (fallback для клиента)
  useEffect(() => {
    const savedTheme = getCookie(THEME_KEY);
    const savedUnit = getCookie(UNIT_KEY) as TemperatureUnit | null;
    const savedUseMyLocation = getCookie(USE_MY_LOCATION_KEY);

    if (savedTheme === 'dark') {
      setIsDark(true);
    }
    if (savedUnit === TemperatureUnit.F) {
      setTemperatureUnit(TemperatureUnit.F);
    }
    if (savedUseMyLocation === 'true') {
      setIsUseMyLocation(true);
    }
    setMounted(true);
  }, []);

  // Сохранение темы в cookies и установка класса на html
  useEffect(() => {
    if (mounted) {
      setCookie(THEME_KEY, isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark, mounted]);

  // Сохранение единиц измерения в cookies
  useEffect(() => {
    if (mounted) {
      setCookie(UNIT_KEY, temperatureUnit);
    }
  }, [temperatureUnit, mounted]);

  // Сохранение настройки геолокации в cookies
  useEffect(() => {
    if (mounted) {
      setCookie(USE_MY_LOCATION_KEY, isUseMyLocation ? 'true' : 'false');
    }
  }, [isUseMyLocation, mounted]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleTemperatureUnit = () =>
    setTemperatureUnit((prev) =>
      prev === TemperatureUnit.C ? TemperatureUnit.F : TemperatureUnit.C
    );
  const toggleUseMyLocation = () => setIsUseMyLocation((prev) => !prev);

  return (
    <SettingsContext.Provider
      value={{
        isDark,
        toggleTheme,
        temperatureUnit,
        toggleTemperatureUnit,
        isUseMyLocation,
        toggleUseMyLocation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
