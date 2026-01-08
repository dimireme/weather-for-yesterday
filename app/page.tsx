'use client';

import { useState } from 'react';
import { useSettings } from '@/components/SettingsContext';
import { WeatherDisplay } from '@/components/WeatherDisplay';
import { SearchLocation } from '@/components/SearchLocation';
import { Coordinates } from '@/model/types';
import { CurrentLocation } from '@/components/CurrentLocation';

export default function HomePage() {
  const { isUseMyLocation } = useSettings();
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {isUseMyLocation ? (
        <CurrentLocation onSetCoordinates={setCoordinates} />
      ) : (
        <SearchLocation onSetCoordinates={setCoordinates} />
      )}

      <WeatherDisplay coordinates={coordinates} />
    </div>
  );
}
