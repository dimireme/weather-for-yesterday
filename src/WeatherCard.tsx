import { Astro, ForecastHour } from "./types";

interface WeatherCardProps {
  title: string;
  isCelsius: boolean;
  weather: ForecastHour & Astro;
}

export const WeatherCard = ({ title, isCelsius, weather }: WeatherCardProps) => {
  const temp = isCelsius ? weather.feelslike_c : weather.feelslike_f

  return (
    <div className="p-4 border rounded-md shadow-md">
      <div className="flex gap-12">
        <h2 className="font-bold w-20">{title}</h2>
        <div>{weather.condition.text}</div>
        <div className="ml-auto">{temp.toFixed(1)}°</div>
      </div>
    </div>
  )
}
