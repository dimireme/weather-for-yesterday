import React from "react";

type WeatherCardProps = {
  temp: number;
  feelsLike: number;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ temp, feelsLike }) => (
  <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
    <p>Температура: {temp}°C</p>
    <p>Ощущается как: {feelsLike}°C</p>
  </div>
);

export default WeatherCard;
