import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");

  // Extract query params
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const rating = params.get("rating") || "all";
  const price = params.get("price") || "all";
  const level = params.get("level") || "all";
  const duration = params.get("duration") || "all";
  const page = parseInt(params.get("page") || 1);

  useEffect(() => {
    if (!query.trim()) {
      setCourses([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `http://localhost:5000/api/courses/search?query=${encodeURIComponent(
        query
      )}&rating=${rating}&price=${price}&level=${level}&duration=${duration}&page=${page}&sort=${sortBy}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setCourses(data.courses || []);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error fetching courses. Please try again later.");
      });
  }, [query, rating, price, level, duration, page, sortBy]);

  return (
    <div className="result-container">
      <header className="result-header">
        <a className="result-logo" href="/">LEARN BRIDGE</a>
        <input
          type="text"
          className="result-search"
          placeholder="Search"
          value={query}
          onChange={(e) => navigate(`?query=${e.target.value}`)}
        />
        <select
          className="result-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Highest Rated</option>
          <option value="price">Lowest Price</option>
        </select>
      </header>

      <main className="result-main">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div>
            <p style={{ color: "red" }}>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : courses.length === 0 ? (
          <p>No results found for "{query}"</p>
        ) : (
          <div className="result-course-list">
            {courses.map((course, index) => (
              <div
                className="result-preview"
                key={index}
                onClick={() => window.open(course.URL, "_blank")}
                style={{ cursor: "pointer" }}
              >
                <p><strong>{course.Title}</strong></p>
                <p>Price: {course.Price || "Free"}</p>
                <p>Rating: {course.Rating} ⭐</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => navigate(`?query=${query}&page=${currentPage - 1}`)}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => navigate(`?query=${query}&page=${currentPage + 1}`)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Result;
