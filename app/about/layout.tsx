import type { Metadata } from 'next';

import { SITE_NAME } from '@/config/site';

const description = `How ${SITE_NAME} shows yesterday's weather next to today for a city or your current location.`;

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About',
    description,
    url: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
