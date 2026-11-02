import type { NextConfig } from 'next';

import { SITE_URL } from './config/site';

const siteHost = new URL(SITE_URL).host;
const wwwHostPattern = `www\\.${siteHost.replace(/\./g, '\\.')}`;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: wwwHostPattern,
          },
        ],
        destination: `${SITE_URL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
