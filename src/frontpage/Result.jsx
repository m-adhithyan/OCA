import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const query = decodeURIComponent(params.get("query") || "")
    .toLowerCase()
    .trim();
  const rating = params.get("rating") || "all";
  const price = params.get("price") || "all";
  const level = params.get("level") || "all";
  const page = params.get("page") || 1;

  useEffect(() => {
    if (query === "") {
      setCourses([]);
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = `http://localhost:5000/api/courses/search?query=${encodeURIComponent(
      query
    )}&rating=${rating}&price=${price}&level=${level}&page=${page}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.error) {
          setCourses([]);
        } else {
          // Filter courses based on title only (if needed)
          const filteredCourses = data.courses.filter((course) =>
            course.Title.toLowerCase().includes(query)
          );
          setCourses(filteredCourses);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError("Error fetching courses. Please try again later.");
        setCourses([]);
        console.error("Error fetching courses:", error);
      });
  }, [query, rating, price, level, page]);

  // Update search query in URL while preserving filters
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    const params = new URLSearchParams(location.search);
    params.set("query", newQuery);
    navigate(`?${params.toString()}`);
  };

  // Update filter query parameters
  const handleFilterChange = (filterName, value) => {
    const params = new URLSearchParams(location.search);
    params.set(filterName, value);
    navigate(`?${params.toString()}`);
  };

  // Open course link in new tab
  const handleCourseClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="result-container">
      <header className="result-header">
        <a className="result-logo" href="/">
          LEARN BRIDGE
        </a>
        <input
          type="text"
          className="result-search"
          placeholder="Search"
          value={query}
          onChange={handleSearchChange}
        />
      </header>

      <div className="result-content">
        {/* Left Sidebar: Udemy‑style Filter */}
        <aside className="udemy-sidebar">
          <h2 className="sidebar-title">Filter</h2>

          {/* Ratings Filter */}
          <div className="filter-section">
            <h3 className="filter-heading">Ratings</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4.5"
                checked={rating === "4.5"}
                onChange={(e) =>
                  handleFilterChange("rating", e.target.value)
                }
              />
              <span className="stars">★★★★★</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4"
                checked={rating === "4"}
                onChange={(e) =>
                  handleFilterChange("rating", e.target.value)
                }
              />
              <span className="stars">★★★★☆</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="3.5"
                checked={rating === "3.5"}
                onChange={(e) =>
                  handleFilterChange("rating", e.target.value)
                }
              />
              <span className="stars">★★★½</span>
              <span className="and-up"> &amp; up</span>
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="all"
                checked={rating === "all"}
                onChange={(e) =>
                  handleFilterChange("rating", e.target.value)
                }
              />
              <span className="stars">All Ratings</span>
            </label>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h3 className="filter-heading">Price</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="all"
                checked={price === "all"}
                onChange={(e) =>
                  handleFilterChange("price", e.target.value)
                }
              />
              All
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="free"
                checked={price === "free"}
                onChange={(e) =>
                  handleFilterChange("price", e.target.value)
                }
              />
              Free
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="price"
                value="paid"
                checked={price === "paid"}
                onChange={(e) =>
                  handleFilterChange("price", e.target.value)
                }
              />
              Paid
            </label>
          </div>

          {/* Level Filter */}
          <div className="filter-section">
            <h3 className="filter-heading">Level</h3>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="all"
                checked={level === "all"}
                onChange={(e) =>
                  handleFilterChange("level", e.target.value)
                }
              />
              All Levels
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="beginner"
                checked={level === "beginner"}
                onChange={(e) =>
                  handleFilterChange("level", e.target.value)
                }
              />
              Beginner
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="intermediate"
                checked={level === "intermediate"}
                onChange={(e) =>
                  handleFilterChange("level", e.target.value)
                }
              />
              Intermediate
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="level"
                value="advanced"
                checked={level === "advanced"}
                onChange={(e) =>
                  handleFilterChange("level", e.target.value)
                }
              />
              Advanced
            </label>
          </div>
        </aside>

        {/* Right Side: Course Listings */}
        <main className="result-main">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : courses.length === 0 ? (
            <p>No results found for "{query}"</p>
          ) : (
            <div className="result-course-list">
              {courses.map((course, index) => (
                <div
                  className="result-preview"
                  key={course.ID || index}
                  onClick={() => handleCourseClick(course.URL)}
                  style={{ cursor: "pointer" }}
                >
                  {/*<div className="course-image">
                    <img
                      src={course.Image || "default-image.png"}
                      alt={course.Title}
                    />
                  </div>*/}
                  <div className="course-info">
                    <p>
                      <strong>{course.Title}</strong>
                    </p>
                    <p>Price: {course.Price || "Free"}</p>
                    <p>Rating: {course.Rating}</p>
                    <p>Level: {course.Level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Result;
