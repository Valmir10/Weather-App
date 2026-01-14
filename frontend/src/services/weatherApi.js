// OpenWeatherMap API - Gratis tier
// Du behöver skapa ett konto på https://openweathermap.org/api och få en API-nyckel
// Lägg till din API-nyckel i en .env-fil: VITE_WEATHER_API_KEY=din_nyckel_här

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "demo_key";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0";

// Debug: Kontrollera att API-nyckeln läses korrekt (ta bort detta i produktion)
if (import.meta.env.DEV) {
  console.log("API_KEY loaded:", API_KEY ? `${API_KEY.substring(0, 10)}...` : "NOT FOUND");
}

export const fetchWeatherData = async (cityName) => {
  try {
    // Om ingen API-nyckel är satt, returnera demo-data
    if (API_KEY === "demo_key" || !API_KEY) {
      console.warn("API-nyckel saknas. Använd demo-data. Lägg till VITE_WEATHER_API_KEY i .env-filen.");
      return getDemoWeatherData(cityName);
    }

    const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=sv`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        console.warn("401 Unauthorized - API-nyckel är ogiltig. Använder demo-data istället.", errorData);
        // Fallback till demo-data om API-nyckeln är ogiltig
        return getDemoWeatherData(cityName);
      }
      if (response.status === 404) {
        throw new Error("Staden kunde inte hittas. Försök igen med ett annat namn.");
      }
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", response.status, errorData);
      throw new Error(`Kunde inte hämta väderdata (${response.status}). Försök igen senare.`);
    }

    const data = await response.json();
    
    // Hämta UV-index från One Call API om möjligt
    let uvIndex = 0;
    try {
      uvIndex = await fetchUVIndex(data.coord.lat, data.coord.lon);
    } catch (uvError) {
      console.warn("Kunde inte hämta UV-index:", uvError);
      // Använd uppskattning baserat på väderdata om API-anropet misslyckas
      uvIndex = estimateUVIndex(data);
    }
    
    return transformWeatherData(data, uvIndex);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Hämta UV-index från UV Index API
const fetchUVIndex = async (lat, lon) => {
  try {
    // Använd det gamla UV Index API:et (fungerar med gratis tier)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return Math.round(data.value || 0);
    }
    
    // Om det gamla API:et inte fungerar, försök med One Call API 3.0
    const oneCallResponse = await fetch(
      `${ONE_CALL_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
    );
    
    if (oneCallResponse.ok) {
      const oneCallData = await oneCallResponse.json();
      return Math.round(oneCallData.current?.uvi || 0);
    }
    
    throw new Error("UV-index API inte tillgängligt");
  } catch (error) {
    throw error;
  }
};

// Uppskatta UV-index baserat på väderdata (fallback)
const estimateUVIndex = (weatherData) => {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;
  const isClear = weatherData.weather[0].main === "Clear";
  const cloudCover = weatherData.clouds?.all || 0;
  
  if (!isDaytime) return 0;
  if (!isClear) return Math.max(0, Math.round(5 * (1 - cloudCover / 100)));
  
  // Under dagtid med klart väder, uppskatta baserat på tid på dygnet
  if (hour >= 10 && hour <= 14) {
    return Math.round(3 + Math.random() * 4); // 3-7 under middagstid
  } else if (hour >= 8 && hour <= 16) {
    return Math.round(2 + Math.random() * 3); // 2-5 annars
  }
  
  return Math.round(1 + Math.random() * 2); // 1-3 tidigt/sent
};

const transformWeatherData = (data, uvIndex = 0) => {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Konvertera från m/s till km/h
    uvIndex: uvIndex,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    isDemoData: false, // Markera att detta är riktig data från API
  };
};

// Demo-data som fallback om API-nyckel saknas
const getDemoWeatherData = (cityName) => {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;
  const estimatedUV = isDaytime ? Math.floor(Math.random() * 5) + 1 : 0;
  
  const demoData = {
    city: cityName || "Lund",
    country: "SE",
    temperature: Math.floor(Math.random() * 20) - 5,
    description: "Soligt",
    humidity: Math.floor(Math.random() * 30) + 50,
    windSpeed: Math.floor(Math.random() * 20) + 10,
    uvIndex: estimatedUV,
    icon: "01d",
    main: "Clear",
    isDemoData: true, // Markera att detta är demo-data
  };
  return demoData;
};

