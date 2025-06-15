import { useEffect, useState } from "react";
import { ApiData, ApiError, Astro, ForecastDay, ForecastHour, GeoLocation } from "./types";

export const useFetchWeather = () => {
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<{
    location: GeoLocation;
    yesterday: ForecastHour & Astro;
    today: ForecastHour & Astro;
  } | null>(null);

  const resetAndUpdate = () => {
    setCoords(null);
    setError(null);
    setWeather(null);
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords(position.coords),
      (error) => setError("Cant get your geolocation: " + error.message)
    );
  };

  useEffect(() => {
    resetAndUpdate();
  }, []);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          if (!navigator.onLine) {
            setError("No internet connection");
            return;
          }

          const today = Math.floor(Date.now() / 1000)
          const yesterday = today - 24 * 60 * 60; // 24 hours

          const params = new URLSearchParams({
            key: import.meta.env.VITE_WEATHERAPI_API_KEY,
            q: `${coords.latitude},${coords.longitude}`,
            unixdt: yesterday.toString(),
            unixend_dt: today.toString(),
            hour: new Date().getHours().toString(),
          });

          const response = await fetch(`https://api.weatherapi.com/v1/history.json?${params.toString()}`);
          const data = await response.json() as ApiError | ApiData;

          if (isApiError(data)) {
            setError(data.error.message)
          } else {
            setWeather({
              location: data.location,
              yesterday: parseWeather(data.forecast.forecastday[0]),
              today: parseWeather(data.forecast.forecastday[1]),
            });
          }
        } catch {
          setError("Cant fetch weather data");
        }
      };
      fetchWeather();
    }
  }, [coords]);

  return { weather, error, resetAndUpdate }
}

function isApiError(data: ApiError | ApiData): data is ApiError {
  return (data as ApiError).error !== undefined;
}

function parseWeather(forecast: ForecastDay) {
  return {
    ...forecast.hour[0],
    ...forecast.astro,
  }
}