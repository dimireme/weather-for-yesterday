interface WeatherCardProps {
  title: string;
  temp: number;
  time: string;
}

export const WeatherCard = ({ title, temp, time }: WeatherCardProps) => (
  <div className="space-y-2">
    <h2>{title}</h2>
    <p>Температура: {temp}°C</p>
    <p>Время: {time}</p>
  </div>
);

