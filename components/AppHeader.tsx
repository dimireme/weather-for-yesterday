'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useSettings } from './SettingsContext';
import { HeaderMenu } from './HeaderMenu';

export function AppHeader() {
  const { isDark } = useSettings();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-semibold no-underline"
        style={{ color: isDark ? '#fff' : '#1f2937' }}
      >
        <Image
          src="/favicon-32x32.png"
          alt="W4Y"
          width={32}
          height={32}
          className="flex-shrink-0"
        />
        Weather For Yesterday
      </Link>

      <HeaderMenu />
    </header>
  );
}
