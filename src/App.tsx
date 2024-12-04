import { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";

const App = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Запрашиваем геолокацию
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
      },
      (err) => setError("Не удалось получить геолокацию.")
    );
  }, []);

  useEffect(() => {
    if (coords) {
      const fetchWeather = async () => {
        try {
          const timestamp = Math.floor(Date.now() / 1000) - 24 * 60 * 60; // 24 часа назад
          const response = await fetch(
            // https://openweathermap.org/price
            `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&dt=${timestamp}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
            // `https://history.openweathermap.org/data/2.5/history/city?lat=${coords.lat}&lon=${coords.lon}&dt=${timestamp}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
          );
          const data = await response.json();
          if (data.cod !== 200) {
            setError(data.message)
          } else {
            setWeather(data.current);
          }
        } catch (err) {
          setError("Не удалось загрузить данные о погоде.");
        }
      };
      fetchWeather();
    }
  }, [coords]);

  return (
    <div>
      <h1>Погода 24 часа назад</h1>
      {error && <p>{error}</p>}
      {weather ? (
        <WeatherCard
          temp={weather.temp}
          feelsLike={weather.feels_like}
        />
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default App;
