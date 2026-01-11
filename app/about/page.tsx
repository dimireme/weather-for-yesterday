'use client';

import { Typography, Divider } from 'antd';

export default function AboutPage() {
  return (
    <div>
      <Typography.Title level={2}>About the App</Typography.Title>

      <Typography.Paragraph>
        <strong>Weather For Yesterday</strong> — a simple and convenient web
        application for viewing current weather information. The app allows you
        to quickly find current weather conditions for any location.
      </Typography.Paragraph>

      <Divider />

      <Typography.Title level={3}>Key Features</Typography.Title>

      <Typography.Paragraph>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Address Search</strong> — enter a city name or address to
            get weather information
          </li>
          <li>
            <strong>Geolocation</strong> — use your current location for
            automatic weather detection
          </li>
          <li>
            <strong>Theme Toggle</strong> — light and dark themes for
            comfortable viewing at any time of day
          </li>
          <li>
            <strong>Temperature Units</strong> — choose between Celsius and
            Fahrenheit
          </li>
          <li>
            <strong>Detailed Information</strong> — hourly weather view with
            detailed meteorological data
          </li>
        </ul>
      </Typography.Paragraph>

      <Divider />

      <Typography.Title level={3}>Technologies</Typography.Title>

      <Typography.Paragraph>
        The application is built using modern web technologies:
      </Typography.Paragraph>

      <Typography.Paragraph>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Next.js 15</strong> — React framework with App Router
          </li>
          <li>
            <strong>TypeScript</strong> — typed JavaScript
          </li>
          <li>
            <strong>Ant Design</strong> — UI component library
          </li>
          <li>
            <strong>TailwindCSS</strong> — utility-first CSS framework
          </li>
        </ul>
      </Typography.Paragraph>

      <Divider />

      <Typography.Title level={3}>Source Code</Typography.Title>

      <Typography.Paragraph>
        Open source project. Source code is available on GitHub:
      </Typography.Paragraph>

      <Typography.Paragraph>
        <a
          href="https://github.com/dimireme/weather-for-yesterday"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          GitHub Repository
        </a>
      </Typography.Paragraph>
    </div>
  );
}
