import React from "react";
import "../styles/HomePage.css";
import Header from "../components/Header";
import WeatherDisplay from "../components/WeatherDisplay";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <Header />
      <WeatherDisplay />
      <Sidebar />
    </div>
  );
};

export default HomePage;
