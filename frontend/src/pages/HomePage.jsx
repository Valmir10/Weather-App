import React, { useState, useEffect, useRef } from "react";
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

  // keyboard state
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const searchRef = useRef(null);
  const keyboardRef = useRef(null);

  // ================================
  // LOAD FAVORITES
  // ================================
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        setFavorites(parsed);
        updateFavoritesWeather(parsed);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const updateFavoritesWeather = async (favoritesList) => {
    const updated = await Promise.all(
      favoritesList.map(async (fav) => {
        try {
          const data = await fetchWeatherData(fav.city);
          return { ...fav, ...data, lastUpdated: new Date().toISOString() };
        } catch {
          return fav;
        }
      }),
    );

    setFavorites(updated);
  };

  // ================================
  // SEARCH
  // ================================
  const handleSearch = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(cityName);
      setWeatherData(data);

      const exists = favorites.some(
        (f) => f.city.toLowerCase() === cityName.toLowerCase(),
      );

      if (!exists) {
        setFavorites((prev) => [
          ...prev,
          { ...data, lastUpdated: new Date().toISOString() },
        ]);
      } else {
        setFavorites((prev) =>
          prev.map((f) =>
            f.city.toLowerCase() === cityName.toLowerCase()
              ? { ...data, lastUpdated: new Date().toISOString() }
              : f,
          ),
        );
      }
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
      setKeyboardVisible(false);
    }
  };

  // ================================
  // LOCATION
  // ================================
  const handleLocationFound = async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const weather = await fetchWeatherData(lat, lon);
      if (!weather) return;

      const locationData = {
        ...weather,
        city: weather.city || "Your Location",
        lastUpdated: new Date().toISOString(),
      };

      setWeatherData(locationData);

      const exists = favorites.some(
        (f) => f.city.toLowerCase() === locationData.city.toLowerCase(),
      );

      if (!exists) setFavorites((prev) => [...prev, locationData]);
    } catch {
      setError("Could not retrieve weather data");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FAVORITES
  // ================================
  const handleFavoriteClick = (favorite) => {
    setWeatherData(favorite);
  };

  const handleRemoveFavorite = (cityName) => {
    setFavorites((prev) => {
      const updated = prev.filter(
        (f) => f.city.toLowerCase() !== cityName.toLowerCase(),
      );

      if (weatherData?.city.toLowerCase() === cityName.toLowerCase()) {
        if (updated.length > 0) {
          setWeatherData(updated[0]);
        } else {
          setWeatherData(null);
        }
      }
      return updated;
    });
  };

  // ================================
  // KEYBOARD INPUT
  // ================================
  const handleKeyPress = (key) => {
    if (key === "⌫") {
      setSearchQuery((prev) => prev.slice(0, -1));
    } else if (key === "SPACE") {
      setSearchQuery((prev) => prev + " ");
    } else if (key === "SEARCH") {
      if (searchQuery.trim()) {
        handleSearch(searchQuery.trim());
        setSearchQuery("");
      }
    } else {
      setSearchQuery((prev) => prev + key);
    }
  };

  // close keyboard outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        keyboardRef.current &&
        !keyboardRef.current.contains(e.target)
      ) {
        setKeyboardVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================================
  // UI
  // ================================
  return (
    <div className="home-page-container">
      <WeatherDisplay
        weatherData={weatherData}
        loading={loading}
        error={error}
      />

      <Sidebar
        favorites={favorites}
        onFavoriteClick={handleFavoriteClick}
        onRemoveFavorite={handleRemoveFavorite}
        currentCity={weatherData?.city}
      />

      <div className="search-section" ref={searchRef}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          onFocus={() => setKeyboardVisible(true)}
        />
        <CurrentLocationButton onLocationFound={handleLocationFound} />
      </div>

      <div
        className={`keyboard-container ${keyboardVisible ? "active" : ""}`}
        ref={keyboardRef}
      >
        <Keyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
};

export default HomePage;
