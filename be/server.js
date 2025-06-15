import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

app.get('/api/weather', async (req, res) => {
  try {
    const { q, unixdt, unixend_dt, hour } = req.query;

    const params = new URLSearchParams({
      key: process.env.WEATHERAPI_API_KEY,
      q,
      unixdt,
      unixend_dt,
      hour,
    });

    const response = await fetch(
      `https://api.weatherapi.com/v1/history.json?${params.toString()}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.listen(3000, () => console.log('Backend running on :3000'));
