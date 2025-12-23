'use client';

import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <div>
      <Title level={2}>Добро пожаловать в W4Y Weather</Title>
      <Paragraph>
        Здесь будет форма для ввода города или кнопка для определения
        геолокации.
      </Paragraph>
    </div>
  );
}
