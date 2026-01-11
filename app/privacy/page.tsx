'use client';

import { useState } from 'react';
import { Radio, Typography } from 'antd';

const privacyText = {
  en: {
    title: 'Privacy Policy',
    text: (
      <>
        This Privacy Policy describes how information is used when interacting
        with this website.
      </>
    ),
    geoTitle: '1.Geolocation',
    geoText: (
      <>
        The website may use the user’s geolocation data solely for the purpose
        of displaying weather information. Access to geolocation is requested
        only with the user’s explicit consent through the browser settings.
        <br />
        <br />
        Geolocation data is not stored, is not saved on the server, and is used
        only at the moment of making a request.
      </>
    ),
    thirdPartyTitle: '2. Third-Party Services',
    thirdPartyText: (
      <>
        Weather data is obtained using the OpenWeather service. As part of the
        request, only location coordinates are transmitted. No information that
        allows identification of the user is transferred.
      </>
    ),
    cookiesTitle: '3. Cookies',
    cookiesText: (
      <>
        The website uses cookies exclusively to store user preferences, such as
        the interface theme, temperature units, and the choice of location
        method.
        <br />
        <br />
        These cookies are not used for user tracking, analytics, or transferring
        data to third parties.
      </>
    ),
    dataStorageTitle: '4. Data Storage',
    dataStorageText: (
      <>
        The website does not collect, store, or process users’ personal data on
        the server.
      </>
    ),
  },
  ru: {
    title: 'Политика конфиденциальности',
    text: (
      <>
        Настоящая Политика конфиденциальности описывает порядок использования
        информации при работе с сайтом.
      </>
    ),
    geoTitle: '1. Геолокация',
    geoText: (
      <>
        Сайт может использовать данные о местоположении пользователя
        исключительно для отображения погодной информации. Доступ к геолокации
        запрашивается только с согласия пользователя через настройки браузера.
        <br />
        <br />
        Данные геолокации не сохраняются, не хранятся на сервере и используются
        только в момент выполнения запроса.
      </>
    ),
    thirdPartyTitle: '2. Сторонние сервисы',
    thirdPartyText: (
      <>
        Для получения данных о погоде используется сторонний сервис OpenWeather.
        В рамках запроса передаются только координаты местоположения, без
        передачи информации, позволяющей идентифицировать пользователя.
      </>
    ),
    cookiesTitle: '3. Файлы cookie',
    cookiesText: (
      <>
        Сайт использует файлы cookie исключительно для сохранения
        пользовательских настроек, таких как тема оформления, единицы измерения
        температуры и выбор способа определения местоположения.
        <br />
        <br />
        Эти файлы cookie не используются для отслеживания пользователей,
        аналитики или передачи данных третьим лицам.
      </>
    ),
    dataStorageTitle: '4. Хранение данных',
    dataStorageText: (
      <>
        Сайт не осуществляет сбор, хранение или обработку персональных данных
        пользователей на сервере.
      </>
    ),
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState<keyof typeof privacyText>('en');
  return (
    <div>
      <Radio.Group
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        optionType="button"
      >
        <Radio value="en">English</Radio>
        <Radio value="ru">Russian</Radio>
      </Radio.Group>

      <Typography.Title level={2}>{privacyText[lang].title}</Typography.Title>

      <Typography.Paragraph>{privacyText[lang].text}</Typography.Paragraph>

      <Typography.Title level={4}>
        {privacyText[lang].geoTitle}
      </Typography.Title>
      <Typography.Paragraph>{privacyText[lang].geoText}</Typography.Paragraph>

      <Typography.Title level={4}>
        {privacyText[lang].thirdPartyTitle}
      </Typography.Title>
      <Typography.Paragraph>
        {privacyText[lang].thirdPartyText}
      </Typography.Paragraph>

      <Typography.Title level={4}>
        {privacyText[lang].cookiesTitle}
      </Typography.Title>
      <Typography.Paragraph>
        {privacyText[lang].cookiesText}
      </Typography.Paragraph>

      <Typography.Title level={4}>
        {privacyText[lang].dataStorageTitle}
      </Typography.Title>
      <Typography.Paragraph>
        {privacyText[lang].dataStorageText}
      </Typography.Paragraph>
    </div>
  );
}
