import { Card } from 'antd';
import { HourForecast, TemperatureUnit } from '@/model/types';
import { useSettings } from './SettingsContext';

interface Props {
  weather: HourForecast;
  title: string;
}

export const HourWeatherCard: React.FC<Props> = ({ weather, title }) => {
  const { temperatureUnit } = useSettings();

  return (
    <Card title={title} className="w-full">
      <div className="flex flex-col gap-2">
        <div className="text-lg font-semibold">{weather.condition.text}</div>
        <div className="text-2xl">
          {temperatureUnit === TemperatureUnit.C
            ? `${weather.feelslike_c}°C`
            : `${weather.feelslike_f}°F`}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(weather.time).toLocaleString()}
        </div>
      </div>
    </Card>
  );
};
