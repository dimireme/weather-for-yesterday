import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './main.css'
import { WeatherPage } from './WeatherPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherPage />
  </StrictMode>,
)
