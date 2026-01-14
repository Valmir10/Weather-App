require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.WEATHER_API_KEY || "demo_key";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0";

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/weather/:cityName", async (req, res) => {
  try {
    const { cityName } = req.params;

    if (API_KEY === "demo_key" || !API_KEY) {
      console.warn("API key missing. Using demo data.");
      return res.json(getDemoWeatherData(cityName));
    }

    const weatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=en`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 401) {
        console.warn("401 Unauthorized - API key is invalid. Using demo data instead.");
        return res.json(getDemoWeatherData(cityName));
      }
      if (weatherResponse.status === 404) {
        return res.status(404).json({ error: "City not found. Try again with a different name." });
      }
      const errorData = await weatherResponse.json().catch(() => ({}));
      console.error("API Error:", weatherResponse.status, errorData);
      return res.status(weatherResponse.status).json({ 
        error: `Could not fetch weather data (${weatherResponse.status}). Please try again later.` 
      });
    }

    const weatherData = await weatherResponse.json();

    let uvIndex = 0;
    try {
      uvIndex = await fetchUVIndex(weatherData.coord.lat, weatherData.coord.lon);
    } catch (uvError) {
      console.warn("Could not fetch UV index:", uvError);
      uvIndex = estimateUVIndex(weatherData);
    }

    const transformedData = transformWeatherData(weatherData, uvIndex);
    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "An error occurred while fetching weather data." });
  }
});

async function fetchUVIndex(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      return Math.round(data.value || 0);
    }

    const oneCallResponse = await fetch(
      `${ONE_CALL_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
    );

    if (oneCallResponse.ok) {
      const oneCallData = await oneCallResponse.json();
      return Math.round(oneCallData.current?.uvi || 0);
    }

    throw new Error("UV index API not available");
  } catch (error) {
    throw error;
  }
}

function estimateUVIndex(weatherData) {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;
  const isClear = weatherData.weather[0].main === "Clear";
  const cloudCover = weatherData.clouds?.all || 0;

  if (!isDaytime) return 0;
  if (!isClear) return Math.max(0, Math.round(5 * (1 - cloudCover / 100)));

  if (hour >= 10 && hour <= 14) {
    return Math.round(3 + Math.random() * 4);
  } else if (hour >= 8 && hour <= 16) {
    return Math.round(2 + Math.random() * 3);
  }

  return Math.round(1 + Math.random() * 2);
}

function transformWeatherData(data, uvIndex = 0) {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6),
    uvIndex: uvIndex,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    isDemoData: false,
  };
}

function getDemoWeatherData(cityName) {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;
  const estimatedUV = isDaytime ? Math.floor(Math.random() * 5) + 1 : 0;

  return {
    city: cityName || "London",
    country: "GB",
    temperature: Math.floor(Math.random() * 20) - 5,
    description: "Sunny",
    humidity: Math.floor(Math.random() * 30) + 50,
    windSpeed: Math.floor(Math.random() * 20) + 10,
    uvIndex: estimatedUV,
    icon: "01d",
    main: "Clear",
    isDemoData: true,
  };
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API key status: ${API_KEY === "demo_key" ? "Demo mode (no API key)" : "Activated"}`);
});
