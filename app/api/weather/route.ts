import { NextRequest, NextResponse } from 'next/server';

interface WeatherApiHistoryResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      date_epoch: number;
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        feelslike_c: number;
        feelslike_f: number;
      }>;
    }>;
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const unixdt = searchParams.get('unixdt');
  const unixend_dt = searchParams.get('unixend_dt');
  const hour = searchParams.get('hour');

  if (!q) {
    return NextResponse.json(
      { error: 'Параметр q обязателен' },
      { status: 400 }
    );
  }

  if (!unixdt || !unixend_dt || !hour) {
    return NextResponse.json(
      { error: 'Параметры unixdt, unixend_dt и hour обязательны' },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API ключ не настроен' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      key: apiKey,
      q,
      unixdt,
      unixend_dt,
      hour,
    });

    const response = await fetch(
      `https://api.weatherapi.com/v1/history.json?${params.toString()}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Ошибка API: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data: WeatherApiHistoryResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка при запросе к weatherapi.com:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении данных о погоде' },
      { status: 500 }
    );
  }
}
