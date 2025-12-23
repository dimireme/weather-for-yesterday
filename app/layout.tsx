import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppHeader } from '@/components/AppHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'W4Y Weather',
  description: 'Приложение для просмотра погоды',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1">
                <div className="main-content">{children}</div>
              </main>
            </div>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
