import type { Metadata } from 'next';

const description =
  'How Weather For Yesterday uses geolocation, cookies, and weather data.';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy',
    description,
    url: '/privacy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
