'use client';

import Link from 'next/link';

import { HeaderMenu } from './HeaderMenu';

export function AppHeader() {
  return (
    <header
      className="flex items-center justify-between p-4 border-0 border-b border-solid"
      style={{ borderBottomColor: 'var(--color-border)' }}
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-semibold no-underline"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Weather For Yesterday
      </Link>

      <HeaderMenu />
    </header>
  );
}
