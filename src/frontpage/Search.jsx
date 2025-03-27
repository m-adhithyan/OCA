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
  });

  const [userName, setUserName] = useState("Guest");

  // Arrays for different course categories
  const [popularCourses, setPopularCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load user name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName("Guest"); // Fallback if not found
    }
  }, []);

  // Fetch courses from your Flask endpoint whenever query or filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");

      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append("query", query);
        params.append("rating", filter.rating);
        params.append("price", filter.price);
        params.append("level", filter.level);
        params.append("page", 1);

        const response = await fetch(
          `http://localhost:5000/api/courses/search?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        const courses = data.courses;

        // Popular = rating > 4.5
        const popular = courses.filter((c) => Number(c.Rating) > 4.5);
        setPopularCourses(popular.slice(0, 4));

        // Free = price === "free"
        const free = courses.filter(
          (c) => c.Price && c.Price.toLowerCase() === "free"
        );
        setFreeCourses(free.slice(0, 4));

        // Recommended = random 4
        const shuffled = [...courses].sort(() => 0.5 - Math.random());
        setRecommendedCourses(shuffled.slice(0, 4));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      }

      setLoading(false);
    };

    fetchCourses();
  }, [query, filter]);

  // Optional: navigate on "Search" click
  const handleSearch = () => {
    navigate(
      `/result?query=${query}&rating=${filter.rating}&price=${filter.price}&level=${filter.level}`
    );
  };

  // Handle text search
  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  // Clicking a course card
  const handleCourseClick = (course) => {
    if (course.URL) {
      window.open(course.URL, "_blank");
    } else {
      alert("Course URL not available.");
    }
  };

  return (
    <div className="sp-overlay">
      {/* Header */}
      <header className="sp-header">
        <div>
          <h1>LEARN BRIDGE</h1>
          <p>YOUR JOURNEY TO KNOWLEDGE BEGINS HERE</p>
        </div>
        <div className="sp-profile">
          <div className="sp-profile-icon">👤</div>
          <span>{userName}</span>
        </div>
      </header>

      {/* Container */}
      <div className="sp-container">
        {/* Left Sidebar: Filter */}
        <aside className="udemy-sidebar">
          <h2 className="sidebar-title">Filter</h2>

          {/* Ratings */}
          <div className="filter-section">
            <h3 className="filter-heading">Ratings</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4.5"
                checked={filter.rating === "4.5"}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              />
              <span className="stars">★★★★★</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4"
                checked={filter.rating === "4"}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              />
              <span className="stars">★★★★☆</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="3.5"
                checked={filter.rating === "3.5"}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              />
              <span className="stars">★★★½</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="all"
                checked={filter.rating === "all"}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
              />
              <span className="stars">All Ratings</span>
            </label>
          </div>

          {/* Price */}
          <div className="filter-section">
            <h3 className="filter-heading">Price</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="all"
                checked={filter.price === "all"}
                onChange={(e) => handleFilterChange("price", e.target.value)}
              />
              All
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="free"
                checked={filter.price === "free"}
                onChange={(e) => handleFilterChange("price", e.target.value)}
              />
              Free
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="paid"
                checked={filter.price === "paid"}
                onChange={(e) => handleFilterChange("price", e.target.value)}
              />
              Paid
            </label>
          </div>

          {/* Level */}
          <div className="filter-section">
            <h3 className="filter-heading">Level</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="all"
                checked={filter.level === "all"}
                onChange={(e) => handleFilterChange("level", e.target.value)}
              />
              All Levels
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="beginner"
                checked={filter.level === "beginner"}
                onChange={(e) => handleFilterChange("level", e.target.value)}
              />
              Beginner
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="intermediate"
                checked={filter.level === "intermediate"}
                onChange={(e) => handleFilterChange("level", e.target.value)}
              />
              Intermediate
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="expert"
                checked={filter.level === "expert"}
                onChange={(e) => handleFilterChange("level", e.target.value)}
              />
              Expert
            </label>
          </div>
        </aside>

        {/* Right Side: Search + Course Lists */}
        <div className="sp-main">
          {/* Search Bar */}
          <div className="sp-search-bar">
            <input
              type="text"
              name="searchQuery"
              id="searchQuery"
              placeholder="Find Your Perfect Course In Seconds"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {loading && <p>Loading courses...</p>}
          {error && <p className="error">Error: {error}</p>}

          {/* Popular Picks */}
          <section className="sp-section">
            <h2>Popular Picks</h2>
            <div className="sp-grid">
              {popularCourses.length > 0 ? (
                popularCourses.map((course, index) => (
                  <div
                    key={course._id || course.id || course.Title + index}
                    className="sp-grid-item"
                    onClick={() => handleCourseClick(course)}
                  >
                    <h3>{course.Title}</h3>
                    <p>{course.Description}</p>
                    <span>⭐ {course.Rating} Stars</span>
                  </div>
                ))
              ) : (
                <p>No popular courses found.</p>
              )}
            </div>
          </section>

          {/* Free Courses */}
          <section className="sp-section">
            <h2>Free Courses</h2>
            <div className="sp-grid">
              {freeCourses.length > 0 ? (
                freeCourses.map((course, index) => (
                  <div
                    key={course._id || course.id || course.Title + index}
                    className="sp-grid-item"
                    onClick={() => handleCourseClick(course)}
                  >
                    <h3>{course.Title}</h3>
                    <p>{course.Description}</p>
                    <span>💸 Free</span>
                  </div>
                ))
              ) : (
                <p>No free courses available.</p>
              )}
            </div>
          </section>

          {/* Recommended For You */}
          <section className="sp-section">
            <h2>Recommended For You</h2>
            <div className="sp-grid">
              {recommendedCourses.length > 0 ? (
                recommendedCourses.map((course, index) => (
                  <div
                    key={course._id || course.id || course.Title + index}
                    className="sp-grid-item"
                    onClick={() => handleCourseClick(course)}
                  >
                    <h3>{course.Title}</h3>
                    <p>{course.Description}</p>
                    <span>⭐ {course.Rating} Stars</span>
                  </div>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Search;
