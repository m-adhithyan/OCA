import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({
    rating: "all",
    price: "all",
    level: "all",
    duration: "all",
  });

  // Store user name from localStorage
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleSearch = () => {
    navigate(`/result?query=${query}&rating=${filter.rating}&price=${filter.price}&level=${filter.level}&duration=${filter.duration}`);
  };

  return (
    <div className="sp-overlay">
      <header className="sp-header">
        <div>
          <h1>LEARN BRIDGE</h1>
          <p>YOUR JOURNEY TO KNOWLEDGE BEGINS HERE</p>
        </div>

        {/* Profile section */}
        <div className="sp-profile">
          <div className="sp-profile-icon">👤</div>
          <span>{userName}</span> 
        </div>
      </header>

      <div className="sp-container">
      <aside className="sp-filters">
  <h3>Filter Courses</h3>
  <label>
    Duration:
    <select value={filter.duration} onChange={(e) => setFilter({ ...filter, duration: e.target.value })}>
      <option value="all">All Durations</option>
      <option value="short">Short </option>
      <option value="medium">Medium </option>
      <option value="long">Long </option>
    </select>
  </label>
  <label>
    Level:
    <select value={filter.level} onChange={(e) => setFilter({ ...filter, level: e.target.value })}>
      <option value="all">All Levels</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="expert">Expert</option>
    </select>
  </label>
  <label>
    Rating:
    <select value={filter.rating} onChange={(e) => setFilter({ ...filter, rating: e.target.value })}>
      <option value="all">All Ratings</option>
      <option value="4">4 Stars</option>
      <option value="3">3 Stars</option>
      <option value="2">2 Stars</option>
    </select>
  </label>
  <label>
    Price:
    <select value={filter.price} onChange={(e) => setFilter({ ...filter, price: e.target.value })}>
      <option value="all">All Prices</option>
      <option value="free">Free</option>
      <option value="paid">Paid</option>
    </select>
  </label>
</aside>

        <div className="sp-main">
          <div className="sp-search-bar">
            <input
              type="text"
              placeholder="Find Your Perfect Course In Seconds"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <section className="sp-section">
            <h2>Popular Picks</h2>
            <div className="sp-grid">
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
            </div>
          </section>

          <section className="sp-section">
            <h2>Best Seller</h2>
            <div className="sp-grid">
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
            </div>
          </section>

          <section className="sp-section">
            <h2>Recommended For You</h2>
            <div className="sp-grid">
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
              <div className="sp-grid-item"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Search;
