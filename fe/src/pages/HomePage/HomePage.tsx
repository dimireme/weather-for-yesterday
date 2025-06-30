import { useState, useRef } from 'react';
import { WeatherCard } from '../../WeatherCard';
import {
  TbTemperatureCelsius,
  TbTemperatureFahrenheit,
  TbRefresh,
} from 'react-icons/tb';
import { useFetchWeather } from '../../useFetchWeather';

export const HomePage = () => {
  const { weather, error, resetAndUpdate, fetchByLocation } = useFetchWeather();
  const [isCelsius, setIsCelsius] = useState(true);
  const [location, setLocation] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (location.trim()) {
      fetchByLocation(location.trim());
    }
  };

  const handleClear = () => {
    setLocation('');
    inputRef.current?.focus();
  };

  const handleUseMyLocation = () => {
    setLocation(''); // сбрасываем инпут для явного перехода в режим геолокации
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = `${position.coords.latitude},${position.coords.longitude}`;
        setLocation(loc);
        fetchByLocation(loc);
      },
      (error) => {
        alert('Не удалось получить геолокацию: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // всегда запрашивать новые координаты
    );
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          className="border rounded-md px-2 py-1 flex-1"
          placeholder="Введите город или координаты"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {location && (
          <button
            className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleClear}
            title="Очистить"
          >
            ×
          </button>
        )}
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleSearch}
        >
          Поиск
        </button>
        <button
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleUseMyLocation}
        >
          Use my location
        </button>
      </div>
      {weather ? (
        <>
          <div className="flex gap-4 items-center justify-between">
            <p className="text-2xl">
              {weather.location.country}, {weather.location.name}
            </p>
            <div className="flex gap-2">
              <button
                className="p-2 bg-gray-500 text-white rounded-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                onClick={resetAndUpdate}
                title="Обновить данные"
              >
                <TbRefresh size={24} />
              </button>
              <button
                className="p-2 bg-gray-500 text-white rounded-md flex items-center justify-center hover:bg-gray-600 transition-colors"
                onClick={() => setIsCelsius(!isCelsius)}
                title={
                  isCelsius
                    ? 'Переключить на Фаренгейты'
                    : 'Переключить на Цельсии'
                }
              >
                {isCelsius ? (
                  <TbTemperatureCelsius size={24} />
                ) : (
                  <TbTemperatureFahrenheit size={24} />
                )}
              </button>
            </div>
          </div>
          <div className="grid gap-4 mt-4">
            <WeatherCard
              title="Yesterday"
              isCelsius={isCelsius}
              weather={weather.yesterday}
            />
            <WeatherCard
              title="Today"
              isCelsius={isCelsius}
              weather={weather.today}
            />
          </div>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
