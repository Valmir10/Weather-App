import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import WeatherDisplay from "../components/WeatherDisplay";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import { fetchWeatherData } from "../services/weatherApi";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Ladda favorites från localStorage vid mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
        // Uppdatera väderdata för alla favorites
        updateFavoritesWeather(parsed);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    }
  }, []);

  // Spara favorites till localStorage när de ändras
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const updateFavoritesWeather = async (favoritesList) => {
    const updatedFavorites = await Promise.all(
      favoritesList.map(async (favorite) => {
        try {
          const data = await fetchWeatherData(favorite.city);
          return {
            ...favorite,
            ...data,
            lastUpdated: new Date().toISOString(),
          };
        } catch (err) {
          console.error(`Error updating weather for ${favorite.city}:`, err);
          return favorite; // Behåll gamla data om uppdatering misslyckas
        }
      })
    );
    setFavorites(updatedFavorites);
  };

  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(data);

      // Lägg till i favorites om den inte redan finns
      const cityExists = favorites.some(
        (fav) => fav.city.toLowerCase() === cityName.toLowerCase()
      );

      if (!cityExists) {
        const newFavorite = {
          ...data,
          lastUpdated: new Date().toISOString(),
        };
        setFavorites((prev) => [...prev, newFavorite]);
      } else {
        // Uppdatera befintlig favorit
        setFavorites((prev) =>
          prev.map((fav) =>
            fav.city.toLowerCase() === cityName.toLowerCase()
              ? { ...data, lastUpdated: new Date().toISOString() }
              : fav
          )
        );
      }
    } catch (err) {
      setError(err.message || "Ett fel uppstod vid hämtning av väderdata.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = (favorite) => {
    setWeatherData(favorite);
  };

  const handleRemoveFavorite = (cityName) => {
    setFavorites((prev) =>
      prev.filter((fav) => fav.city.toLowerCase() !== cityName.toLowerCase())
    );
    // Om den borttagna favoriten är den som visas, rensa weatherData
    if (weatherData && weatherData.city.toLowerCase() === cityName.toLowerCase()) {
      setWeatherData(null);
    }
  };

  return (
    <div className="home-page-container">
      <WeatherDisplay weatherData={weatherData} loading={loading} error={error} />
      <Sidebar
        favorites={favorites}
        onFavoriteClick={handleFavoriteClick}
        onRemoveFavorite={handleRemoveFavorite}
        currentCity={weatherData?.city}
      />
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default HomePage;
