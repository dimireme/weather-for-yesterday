import { NextRequest, NextResponse } from 'next/server';

interface LocationResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

interface WeatherApiSearchResponse extends Array<LocationResult> {}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: 'Parameter q is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const url = new URL('https://api.weatherapi.com/v1/search.json');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('q', query.trim());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data: WeatherApiSearchResponse = await response.json();

    return NextResponse.json({ locations: data });
  } catch (error) {
    console.error('Error requesting weatherapi.com:', error);
    return NextResponse.json(
      { error: 'Error searching for location' },
      { status: 500 }
    );
  }
}
