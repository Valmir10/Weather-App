import React from "react";
import "../styles/WeatherDisplay.css";

import { WiRaindrop, WiStrongWind, WiCloudy } from "react-icons/wi";
import { IoIosSunny, IoMdCloudy } from "react-icons/io";
import { BsCloudRain, BsSnow } from "react-icons/bs";

const WeatherDisplay = ({ weatherData, loading, error }) => {
  const getWeatherIcon = (main, icon) => {
    const iconClass = "weather-icon-img";

    switch (main) {
      case "Clear":
        return <IoIosSunny className={iconClass} />;
      case "Clouds":
        return <WiCloudy className={iconClass} />;
      case "Rain":
      case "Drizzle":
        return <BsCloudRain className={iconClass} />;
      case "Snow":
        return <BsSnow className={iconClass} />;
      case "Thunderstorm":
        return <BsCloudRain className={iconClass} />;
      default:
        return <IoMdCloudy className={iconClass} />;
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <main className="weather-display-container">
        <div className="weather-display-wrapper">
          <div className="loading-container">
            <p>Loading weather data...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="weather-display-container">
        <div className="weather-display-wrapper">
          <div className="error-container">
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!weatherData) {
    return (
      <main className="weather-display-container">
        <div className="weather-display-wrapper">
          <div className="no-data-container">
            <p>Search for a city to see weather data</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="weather-display-container">
      {weatherData.isDemoData && (
        <div className="demo-data-banner">
          <p>⚠️ Demo data displayed - API key is invalid or not activated</p>
        </div>
      )}
      <div className="weather-display-wrapper">
        <div className="information-card-1-container">
          <div className="information-card-1">
            <div className="city-name-container">
              <h1>{weatherData.city}</h1>
            </div>

            <div className="weather-type-image-container">
              <div className="weather-type-image">
                {getWeatherIcon(weatherData.main, weatherData.icon)}
              </div>
            </div>

            <div className="city-temperature-container">
              <h1>{weatherData.temperature}°</h1>
            </div>

            <div className="type-of-weather-container">
              <p>{capitalizeFirst(weatherData.description)}</p>
            </div>
          </div>
        </div>

        <div className="information-card-2-container">
          <div className="information-card-2">
            <div className="humidity-container">
              <div className="humidity-icon-container">
                <div className="humidity-icon">
                  <WiRaindrop className="humidity-icon-img" />
                </div>
              </div>
              <div className="humidity-result-container">
                <div className="humudity-result">
                  <p>{weatherData.humidity}%</p>
                </div>
                <div className="humitidy-text">
                  <p>Humidity</p>
                </div>
              </div>
            </div>

            <div className="wind-container">
              <div className="wind-icon-container">
                <div className="wind-icon">
                  <WiStrongWind className="wind-icon-img" />
                </div>
              </div>
              <div className="wind-result-container">
                <div className="wind-result">
                  <p>{weatherData.windSpeed} km/h</p>
                </div>
                <div className="wind-text">
                  <p>Wind</p>
                </div>
              </div>
            </div>

            <div className="uv-index-container">
              <div className="uv-index-icon-container">
                <div className="uv-index-icon">
                  <IoIosSunny className="uv-index-icon-img" />
                </div>
              </div>
              <div className="uv-index-result-container">
                <div className="uv-index-result">
                  <p>{weatherData.uvIndex}</p>
                </div>
                <div className="uv-index-text">
                  <p>UV-index</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WeatherDisplay;
