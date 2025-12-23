'use client';

import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function PrivacyPage() {
  return (
    <div>
      <Title level={2}>Политика конфиденциальности</Title>
      <Paragraph>Мы уважаем вашу конфиденциальность.</Paragraph>
      <Paragraph>
        Данные геолокации используются только для определения погоды и не
        сохраняются на сервере.
      </Paragraph>
    </div>
  );
}
