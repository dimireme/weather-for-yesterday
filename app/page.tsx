import type { Metadata } from 'next';

import { HomeIntro } from '@/components/HomeIntro';
import { HomeWeather } from '@/components/HomeWeather';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'WeatherApplication',
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeIntro />
      <HomeWeather />
    </div>
  );
}
