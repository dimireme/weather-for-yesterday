'use client';

import { Typography } from 'antd';

export default function AboutPage() {
  return (
    <div>
      <Typography.Title level={2}>О приложении</Typography.Title>
      <Typography.Paragraph>
        Weather For Yesterday — простое приложение для просмотра погоды.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Позволяет узнать текущую погоду по адресу или геолокации.
      </Typography.Paragraph>
    </div>
  );
}
