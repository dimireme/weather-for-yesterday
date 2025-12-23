'use client';

import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <div>
      <Title level={2}>О приложении</Title>
      <Paragraph>
        W4Y Weather — простое приложение для просмотра погоды.
      </Paragraph>
      <Paragraph>
        Позволяет узнать текущую погоду по адресу или геолокации.
      </Paragraph>
    </div>
  );
}
