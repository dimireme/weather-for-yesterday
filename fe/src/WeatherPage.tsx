import { useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { TbTemperatureCelsius, TbTemperatureFahrenheit, TbRefresh } from "react-icons/tb";
import { useFetchWeather } from "./useFetchWeather";

export const WeatherPage = () => {
  const { weather, error, resetAndUpdate } = useFetchWeather()
  const [isCelsius, setIsCelsius] = useState(true)

  return (
    <div className="p-4">
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
                title={isCelsius ? "Переключить на Фаренгейты" : "Переключить на Цельсии"}
              >
                {isCelsius ? <TbTemperatureCelsius size={24} /> : <TbTemperatureFahrenheit size={24} />}
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
    </div>
  );
};
