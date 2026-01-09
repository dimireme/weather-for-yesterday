'use client';

import Link from 'next/link';
import Image from 'next/image';

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
