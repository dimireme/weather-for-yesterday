# Weather For Yesterday

Приложение для просмотра погоды за вчерашний день. Позволяет узнать исторические данные о погоде для текущей локации.

## Технологии

- React 18
- TypeScript
- Vite
- TailwindCSS
- WeatherAPI

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/weather-for-yesterday.git
cd weather-for-yesterday
```

2. Установите зависимости:
```bash
yarn install
```

3. Создайте файл `.env` в корневой директории и добавьте ваш API ключ:
```env
VITE_WEATHER_API_KEY=your_api_key_here
```

4. Запустите приложение в режиме разработки:
```bash
yarn dev
```

## Деплой на GitHub Pages

1. Убедитесь, что все изменения закоммичены:
```bash
git add .
git commit -m "Your commit message"
git push
```

2. Запустите команду деплоя:
```bash
yarn deploy
```

После успешного деплоя приложение будет доступно по адресу:
`https://[ваш-username].github.io/weather-for-yesterday/`

## API

Приложение использует [WeatherAPI](https://www.weatherapi.com/) для получения данных о погоде. Для работы приложения необходим API ключ.

## Лицензия

MIT
