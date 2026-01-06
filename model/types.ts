export interface HourForecast {
  time_epoch: number;
  time: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
}

export interface LocationInfo {
  name: string;
  region: string;
  country: string;
}

export interface DayForecast {
  date: string;
  date_epoch: number;
  hour: Array<HourForecast>;
}

export interface WeatherApiHistoryResponse {
  location: LocationInfo;
  forecast: {
    forecastday: Array<DayForecast>;
  };
}

export interface WeatherData {
  current: HourForecast | null;
  yesterday: HourForecast | null;
  location: LocationInfo | null;
}
