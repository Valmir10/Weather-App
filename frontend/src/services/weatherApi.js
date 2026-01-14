const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export const fetchWeatherData = async (cityNameOrLat, lon = null) => {
  try {
     let url;
    
    if (lon !== null) {
      url = `${BACKEND_URL}/api/weather/coordinates?lat=${cityNameOrLat}&lon=${lon}`;
    } else {
      url = `${BACKEND_URL}/api/weather/${encodeURIComponent(cityNameOrLat)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Could not fetch weather data (${response.status}). Please try again later.`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
