'use client';

import { Typography } from 'antd';

import { SITE_DESCRIPTION } from '@/config/site';

export function HomeIntro() {
  return (
    <section>
      <Typography.Title level={1} className="!text-2xl !mt-0 !mb-2">
        Yesterday&apos;s weather
      </Typography.Title>
      <Typography.Paragraph className="!mb-0">
        {SITE_DESCRIPTION} Hourly details are shown for both days.
      </Typography.Paragraph>
    </section>
  );
}
