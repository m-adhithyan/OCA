import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";  // Updated import
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate(); // Using useNavigate for URL navigation
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  
  // Extract query parameters
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || ""; // Default to empty string if query is null

  useEffect(() => {
    if (query.trim() === "") {
      setCourses([]); // Reset if query is empty or just spaces
      return;
    }

    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    fetch(`http://localhost:5000/api/courses/search?query=${query}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false); // Stop loading
        if (data.error) {
          setCourses([]); // No results found or error
        } else {
          setCourses(data); // Set fetched courses
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading
        setError("Error fetching courses. Please try again later.");
        setCourses([]); // Optionally reset courses in case of an error
        console.error("Error fetching courses:", error);
      });
  }, [query]);

  // Handle input change
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    navigate(`?query=${newQuery}`); // Update query in the URL using useNavigate
  };

  return (
    <div className="result-container">
      <header className="result-header">
        <a className="result-logo" href="/">LEARN BRIDGE</a>
        <input
          type="text"
          className="result-search"
          placeholder="Search"
          value={query} // Bind query to input field
          onChange={handleSearchChange} // Handle search input changes
        />
      </header>

      <main className="result-main">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p> // Display error message if there's an error
        ) : courses.length === 0 ? (
          <p>No results found for "{query}"</p>
        ) : (
          <div className="result-course-list">
            {courses.map((course) => (
              <div className="result-preview" key={course.ID}>
                <div>
                  <p><strong>{course.Title}</strong></p>
                  <p>Price: {course.Price || "Free"}</p>
                  <p>Rating: {course.Rating} ⭐</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Result;