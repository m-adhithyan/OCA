import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // Navigate to the results page with the search query as a URL parameter.
    navigate(`/result`);
  };

  return (
    <div className="sp-overlay">
      <header className="sp-header">
        <div>
          <h1>LEARN BRIDGE</h1>
          <p>YOUR JOURNEY TO KNOWLEDGE BEGINS HERE</p>
        </div>
        <div className="sp-profile">
          <div className="sp-profile-icon">👤</div>
          <span>PROFILE</span>
        </div>
      </header>

      <div className="sp-search-bar">
        <input
          type="text"
          placeholder="Find Your Perfect Course In Seconds"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Additional sections remain unchanged */}
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
  );
}

export default Search;
