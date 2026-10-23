import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsContext';
import { AppHeader } from '@/components/AppHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MessageProvider } from '@/components/MessageProvider';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site';
import { TemperatureUnit } from '@/model/types';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const themeCookie = cookieStore.get('w4y_theme');
  const unitCookie = cookieStore.get('w4y_temperature_unit');
  const locationCookie = cookieStore.get('w4y_use_my_location');

  const isDark = themeCookie?.value !== 'light';
  const temperatureUnit =
    unitCookie?.value === TemperatureUnit.F
      ? TemperatureUnit.F
      : TemperatureUnit.C;
  const isUseMyLocation = locationCookie?.value !== 'false';

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <body>
        <AntdRegistry>
          <SettingsProvider
            initialTheme={isDark}
            initialTemperatureUnit={temperatureUnit}
            initialUseMyLocation={isUseMyLocation}
          >
            <ThemeProvider>
              <MessageProvider>
                <div className="content-wrapper min-h-screen flex flex-col max-w-[1080px] mx-auto">
                  <AppHeader />
                  <main className="flex-1 p-4">{children}</main>
                  <SiteFooter />
                </div>
              </MessageProvider>
            </ThemeProvider>
          </SettingsProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
