export interface GeoLocation {
  country: string // "Thailand"
  name: string // "Pattaya"
  localtime_epoch: number // 1735970880
  localtime: string //	"2025-01-04 13:08"
}

export interface Astro {
  sunrise: string // "06:39 AM"
  sunset: string // "06:02 PM"
}

interface Condition {
  text: string // "Sunny"
}

export interface ForecastHour {
  feelslike_c: number // 26.2
  feelslike_f: number // 79.1
  condition: Condition
}

export interface ForecastDay {
  astro: Astro
  hour: ForecastHour[]
}

export interface ApiData {
  location: GeoLocation,
  forecast: {
    forecastday: ForecastDay[]
  }
}

export interface ApiError {
  error: {
    code: number
    message: string
  }
}
