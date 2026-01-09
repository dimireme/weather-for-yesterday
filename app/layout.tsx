import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsContext';
import { AppHeader } from '@/components/AppHeader';
import { MessageProvider } from '@/components/MessageProvider';
import { TemperatureUnit } from '@/model/types';

import './globals.css';

export const metadata: Metadata = {
  title: 'Weather For Yesterday',
  description: 'Приложение для просмотра погоды',
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

  const isDark = themeCookie?.value === 'dark';
  const temperatureUnit =
    unitCookie?.value === TemperatureUnit.F
      ? TemperatureUnit.F
      : TemperatureUnit.C;
  const isUseMyLocation = locationCookie?.value === 'true';

  return (
    <html lang="ru" className={isDark ? 'dark' : ''}>
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
                </div>
              </MessageProvider>
            </ThemeProvider>
          </SettingsProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
