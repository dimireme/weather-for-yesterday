import { LocationOption } from '@/model/types';

interface ApiLocation {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export const fetchLocations = async (
  query: string
): Promise<LocationOption[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || 'Ошибка при поиске локации');
  }

  const data = await response.json();

  if (!data.locations || !Array.isArray(data.locations)) {
    return [];
  }

  return data.locations.map((loc: ApiLocation) => ({
    value: `${loc.name}, ${loc.region}, ${loc.country}`,
    label: `${loc.name}, ${loc.region}, ${loc.country}`,
    coordinates: {
      latitude: loc.lat,
      longitude: loc.lon,
    },
  }));
};
