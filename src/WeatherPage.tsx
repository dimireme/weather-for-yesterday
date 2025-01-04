import { useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
import { useFetchWeather } from "./useFetchWeather";

export const WeatherPage = () => {
  const { weather, error } = useFetchWeather()
  const [isCelsius, setIsCelsius] = useState(true)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center"></h1>
      {weather ? (
        <>
          <div className="flex gap-4 items-center justify-between">
            <p className="text-2xl">
              {weather.location.country}, {weather.location.name} 
            </p>
            <button
              className="p-2 bg-gray-500 text-white rounded-md flex items-center justify-center"
              onClick={() => setIsCelsius(!isCelsius)}
              title={isCelsius ? "Переключить на Фаренгейты" : "Переключить на Цельсии"}
            >
              {isCelsius ? <TbTemperatureCelsius size={24} /> : <TbTemperatureFahrenheit size={24} />}
            </button>
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
