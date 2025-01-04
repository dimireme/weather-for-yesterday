import { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";

interface ApiError {
  error: {
    code: number
    message: string
  }
}

interface Location {
  country: string // "Thailand"
  name: string // "Pattaya"
}

interface Astro {
  sunrise: string // "06:39 AM"
  sunset: string // "06:02 PM"
}

interface ForecastHour {
  feelslike_c: number // 26.2
  feelslike_f: number // 79.1
  time: string // "2025-01-02 00:00"
  time_epoch: number // 1735750800
}

interface ForecastDay {
  astro: Astro
  hour: ForecastHour[]
}
interface ApiData {
  location: Location,
  forecast: {
    forecastday: ForecastDay[]
  }
}

function isApiError(data: ApiError | ApiData): data is ApiError {
  return (data as ApiError).error !== undefined;
}

export const WeatherPage = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{
    yesterday: ForecastHour | null;
    today: ForecastHour | null;
  } | null>(null);

  useEffect(() => {
    // Запрашиваем геолокацию
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
      },
      () => setError("Не удалось получить геолокацию")
    );
  }, []);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const today = Math.floor(Date.now() / 1000)
          const yesterday = today - 24 * 60 * 60; // 24 часа назад
          const response = await fetch(
            `http://api.weatherapi.com/v1/history.json
              ?key=${import.meta.env.VITE_WEATHERAPI_API_KEY}
              &q=${coords.lat},${coords.lon}
              &unixdt=${yesterday}
              &unixend_dt=${today}
            `
          );
          const data = await response.json() as ApiError | ApiData;
          
          if (isApiError(data)) {
            setError(data.error.message)
          } else {
            const currentHour = new Date().getHours();

            // Находим ближайший час
            const findClosestHour = (hours: ForecastHour[], targetHour: number) => {
              return hours.reduce((prev, curr) => {
                const prevDiff = Math.abs(new Date(prev.time).getHours() - targetHour);
                const currDiff = Math.abs(new Date(curr.time).getHours() - targetHour);
                return currDiff < prevDiff ? curr : prev;
              });
            };

            const yesterdayData = data.forecast.forecastday[0];
            const todayData = data.forecast.forecastday[1];

            const yesterdayHour = findClosestHour(yesterdayData.hour, currentHour);
            const todayHour = findClosestHour(todayData.hour, currentHour);

            setWeather({
              yesterday: yesterdayHour,
              today: todayHour,
            });
          }
        } catch {
          setError("Не удалось загрузить данные о погоде");
        }
      };
      fetchWeather();
    }
  }, [coords]);

  return (
    <div>
      <h1>Погода 24 часа назад</h1>
      {weather ? (
        <div className="flex gap-8">
          <WeatherCard
            title="Вчера"
            temp={weather.yesterday?.feelslike_c ?? 0}
            time={weather.yesterday?.time ?? ""}
          />
          <WeatherCard
            title="Сегодня"
            temp={weather.today?.feelslike_c ?? 0}
            time={weather.today?.time ?? ""}
          />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};
