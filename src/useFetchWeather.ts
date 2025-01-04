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

  useEffect(() => {
    // Get geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords(position.coords),
      () => setError("Cant get your geolocation")
    );
  }, []);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const today = Math.floor(Date.now() / 1000)
          const yesterday = today - 24 * 60 * 60; // 24 hours
          const response = await fetch(
            `http://api.weatherapi.com/v1/history.json
              ?key=${import.meta.env.VITE_WEATHERAPI_API_KEY}
              &q=${coords.latitude},${coords.longitude}
              &unixdt=${yesterday}
              &unixend_dt=${today}
              &hour=${new Date().getHours()}
            `
          );
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

  return { weather, error }
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