import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t p-4 text-center text-gray-600 text-sm flex justify-center gap-6">
      <a
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline flex items-center gap-1"
      >
        <span role="img" aria-label="GitHub">
          🐙
        </span>{' '}
        GitHub
      </a>
      <a
        href="https://t.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline flex items-center gap-1"
      >
        <span role="img" aria-label="Telegram">
          ✈️
        </span>{' '}
        Telegram
      </a>
      <Link to="/about" className="hover:underline flex items-center gap-1">
        <span role="img" aria-label="About">
          ℹ️
        </span>{' '}
        About
      </Link>
      <Link to="/pwa" className="hover:underline flex items-center gap-1">
        <span role="img" aria-label="PWA">
          📱
        </span>{' '}
        Simple Mode
      </Link>
    </footer>
  );
};
