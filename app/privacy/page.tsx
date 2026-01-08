'use client';

import { Typography } from 'antd';

export default function PrivacyPage() {
  return (
    <div>
      <Typography.Title level={2}>Политика конфиденциальности</Typography.Title>
      <Typography.Paragraph>
        Мы уважаем вашу конфиденциальность.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Данные геолокации используются только для определения погоды и не
        сохраняются на сервере.
      </Typography.Paragraph>
    </div>
  );
}
