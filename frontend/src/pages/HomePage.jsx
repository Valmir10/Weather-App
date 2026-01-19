import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import WeatherDisplay from "../components/WeatherDisplay";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import { fetchWeatherData } from "../services/weatherApi";
import CurrentLocationButton from "../components/CurrentLocationButton";
import Keyboard from "../components/Keyboard";

const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
        updateFavoritesWeather(parsed);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    }
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  // Update all favorites with fresh weather data
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
          return favorite;
        }
      })
    );
    setFavorites(updatedFavorites);
  };

  // Search for weather data by city
  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(data);

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
        setFavorites((prev) =>
          prev.map((fav) =>
            fav.city.toLowerCase() === cityName.toLowerCase()
              ? { ...data, lastUpdated: new Date().toISOString() }
              : fav
          )
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching weather data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Search by user's current location
  const handleLocationFound = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(lat, lon);
      if (weather) {
        const locationData = {
          city: weather.city || "Your Location",
          country: weather.country,
          temperature: weather.temperature,
          main: weather.main,
          description: weather.description,
          icon: weather.icon,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          uvIndex: weather.uvIndex,
          isDemoData: weather.isDemoData || false,
          lastUpdated: new Date().toISOString(),
        };

        setWeatherData(locationData);

        const cityExists = favorites.some(
          (fav) => fav.city.toLowerCase() === locationData.city.toLowerCase()
        );

        if (!cityExists) {
          setFavorites((prev) => [...prev, locationData]);
        } else {
          setFavorites((prev) =>
            prev.map((fav) =>
              fav.city.toLowerCase() === locationData.city.toLowerCase()
                ? locationData
                : fav
            )
          );
        }
      }
    } catch (err) {
      setError("Could not retrieve weather data for your location");
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
    if (weatherData && weatherData.city.toLowerCase() === cityName.toLowerCase()) {
      setWeatherData(null);
    }
  };

  

  // Keyboard input handler kopplad till SearchBar och Weather API
  const handleKeyPress = (key) => {
    if (key === "SPACE") {
      setSearchQuery((prev) => prev + " ");
    } else if (key === "⌫") {
      setSearchQuery((prev) => prev.slice(0, -1));
    } else if (key === "SEARCH") {
      if (searchQuery.trim()) {
        handleSearch(searchQuery.trim());
        setSearchQuery("");
      }
    } else {
      setSearchQuery((prev) => prev + key);
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
      <div className="search-section">
        <SearchBar
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <CurrentLocationButton onLocationFound={handleLocationFound} />
      </div>

      {/* Mobil Keyboard overlay */}
      <div className="mobile-keyboard">
        <Keyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
};

export default HomePage;
