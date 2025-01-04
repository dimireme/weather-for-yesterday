// import { FiSunrise, FiSunset } from "react-icons/fi";
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
        <h2 className="font-bold">{title}</h2>
        <div className="ml-auto">{temp.toFixed(1)}°</div>
        <div>{weather.condition.text}</div>
      </div>
      {/* <div className="flex justify-between gap-12 mt-4">
        <div className="flex items-end gap-2">
          <FiSunrise size={24} />
          <span>{weather.sunrise}</span>
        </div>
        <div>{temp.toFixed(1)}°</div>
        <div className="flex items-end gap-2">
          <FiSunset size={24} />
          <span>{weather.sunset}</span>
        </div>
      </div>   */}
    </div>
  )
}
