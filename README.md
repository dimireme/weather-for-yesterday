# Weather For Yesterday

Приложение для просмотра погоды за вчерашний день.

https://weatherforyesterday.com/

## Технологии

- React 18
- TypeScript
- Vite
- TailwindCSS
- [WeatherAPI](https://www.weatherapi.com/)

## CI/CD

При билде фронт и бэк докеризуются отдельно и хостятся на GitHub Container Registry (GHCR).

При деплое происходит коннект к VPS и на VPS стартует скрипт `deploy.sh`.

Этот скрипт коннектится к GHCR, стягивает контейнеры и стартует их.

## Локальная разработка

Фронт и бэкенд запускаются в разных терминалах.

#### Фронт

```
cd fe
yarn install
yarn dev
```

#### Бэкенд

```
cd be
cp .env.example .env
ysrn install
node server.js
```

Приложение использует [WeatherAPI](https://www.weatherapi.com/) для получения данных о погоде. Для работы приложения необходим API ключ. Добавьте его в файле `.env`:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```
