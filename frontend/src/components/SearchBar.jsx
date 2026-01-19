import React from "react";
import "../styles/SearchBar.css";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, searchQuery, setSearchQuery, onFocus, onBlur }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit} className="searchbar-form">
        <div className="searchbar-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="searchbar-input"
            placeholder="Search city..."
            value={searchQuery}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        <button type="submit" className="searchbar-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
