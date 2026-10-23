import Link from 'next/link';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
] as const;

export function SiteFooter() {
  return (
    <footer
      className="flex justify-center gap-4 p-4 border-0 border-t border-solid"
      style={{ borderTopColor: 'var(--color-border)' }}
    >
      {footerLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="no-underline"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {link.label}
        </Link>
      ))}
    </footer>
  );
}
