import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import { FaSearch, FaUser } from "react-icons/fa";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    rating: "all",
    price: "all",
    level: "all",
    duration: "all",
  });

  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({
      query,
      rating: filters.rating,
      price: filters.price,
      level: filters.level,
      duration: filters.duration,
      page: 1,
    });
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="search-overlay">
      <header className="search-header">
        <div className="logo">
          <h1>LEARN BRIDGE</h1>
          <p>Your Journey to Knowledge Begins Here</p>
        </div>
        <div className="profile">
          <FaUser className="profile-icon" />
          <span>{userName}</span>
        </div>
      </header>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Find Your Perfect Course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
        </div>
        <div className="filter-section">
          {Object.keys(filters).map((filter) => (
            <div key={filter} className="filter-group">
              <label>{filter.charAt(0).toUpperCase() + filter.slice(1)}:</label>
              <select
                value={filters[filter]}
                onChange={(e) => setFilters({ ...filters, [filter]: e.target.value })}
              >
                <option value="all">All</option>
                {filter === "rating" && <>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </>}
                {filter === "price" && <>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </>}
                {filter === "level" && <>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </>}
                {filter === "duration" && <>
                  <option value="short">0-5 hrs</option>
                  <option value="medium">5-20 hrs</option>
                  <option value="long">20+ hrs</option>
                </>}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
