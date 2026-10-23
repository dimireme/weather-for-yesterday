const rawSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://weatherforyesterday.com';

export const SITE_URL = rawSiteUrl.replace(/\/$/, '');

export const SITE_NAME = 'Weather For Yesterday';

export const SITE_DESCRIPTION =
  "Look up yesterday's weather for any city or your current location, and compare it with today.";
