import React from "react";
import "../styles/Sidebar.css";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ favorites, onFavoriteClick, onRemoveFavorite, currentCity }) => {

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-content">
        <h1 className="sidebar-title">Favorites</h1>
        <div className="favorites-list">
          {favorites.length === 0 ? (
            <p className="no-favorites">Inga favoriter ännu. Sök efter en stad för att lägga till den.</p>
          ) : (
            favorites.map((favorite, index) => {
              const isActive = currentCity?.toLowerCase() === favorite.city?.toLowerCase();
              return (
                <div
                  key={`${favorite.city}-${index}`}
                  className={`favorite-item ${isActive ? "active" : ""}`}
                  onClick={() => onFavoriteClick(favorite)}
                >
                  <div className="favorite-header">
                    <h2 className="favorite-city">{favorite.city}</h2>
                    <button
                      className="remove-favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(favorite.city);
                      }}
                      aria-label="Ta bort favorit"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="favorite-weather">
                    <p className="favorite-description">
                      {capitalizeFirst(favorite.description)}
                    </p>
                    <div className="favorite-right-side">
                      <p className="favorite-temperature">{favorite.temperature}°</p>
                      <p className="favorite-date">
                        {formatDate(favorite.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
