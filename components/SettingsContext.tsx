'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface SettingsContextType {
  isDark: boolean;
  toggleTheme: () => void;
  temperatureUnit: TemperatureUnit;
  toggleTemperatureUnit: () => void;
  isUseMyLocation: boolean;
  toggleUseMyLocation: () => void;
  coordinates: Coordinates | null;
  setCoordinates: (coords: Coordinates | null) => void;
  requestGeolocation: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const THEME_KEY = 'w4y_theme';
const UNIT_KEY = 'w4y_temperature_unit';
const USE_MY_LOCATION_KEY = 'w4y_use_my_location';
const COORDINATES_KEY = 'w4y_coordinates';

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [temperatureUnit, setTemperatureUnit] =
    useState<TemperatureUnit>('celsius');
  const [mounted, setMounted] = useState(false);
  const [isUseMyLocation, setIsUseMyLocation] = useState(false);
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(null);

  // Загрузка настроек из localStorage при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedUnit = localStorage.getItem(UNIT_KEY) as TemperatureUnit | null;
    const savedUseMyLocation = localStorage.getItem(USE_MY_LOCATION_KEY);
    const savedCoordinates = localStorage.getItem(COORDINATES_KEY);

    if (savedTheme === 'dark') {
      setIsDark(true);
    }
    if (savedUnit === 'fahrenheit') {
      setTemperatureUnit('fahrenheit');
    }
    if (savedUseMyLocation === 'true') {
      setIsUseMyLocation(true);
    }
    if (savedCoordinates) {
      try {
        const coords = JSON.parse(savedCoordinates);
        if (coords.latitude && coords.longitude) {
          setCoordinatesState(coords);
        }
      } catch (e) {
        console.error('Ошибка при загрузке координат:', e);
      }
    }
    setMounted(true);
  }, []);

  // Сохранение темы и установка класса на body
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      document.body.classList.toggle('dark', isDark);
    }
  }, [isDark, mounted]);

  // Сохранение единиц измерения
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(UNIT_KEY, temperatureUnit);
    }
  }, [temperatureUnit, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        USE_MY_LOCATION_KEY,
        isUseMyLocation ? 'true' : 'false'
      );
    }
  }, [isUseMyLocation, mounted]);

  // Сохранение координат
  useEffect(() => {
    if (mounted) {
      if (coordinates) {
        localStorage.setItem(COORDINATES_KEY, JSON.stringify(coordinates));
      } else {
        localStorage.removeItem(COORDINATES_KEY);
      }
    }
  }, [coordinates, mounted]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleTemperatureUnit = () =>
    setTemperatureUnit((prev) =>
      prev === 'celsius' ? 'fahrenheit' : 'celsius'
    );
  const toggleUseMyLocation = () => setIsUseMyLocation((prev) => !prev);

  const setCoordinates = (coords: Coordinates | null) => {
    setCoordinatesState(coords);
  };

  const requestGeolocation = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается вашим браузером'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinatesState(coords);
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        isDark,
        toggleTheme,
        temperatureUnit,
        toggleTemperatureUnit,
        isUseMyLocation,
        toggleUseMyLocation,
        coordinates,
        setCoordinates,
        requestGeolocation,
      }}
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
