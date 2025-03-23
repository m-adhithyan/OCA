import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";  
import "./Result.css";

function Result() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // Extract and decode query parameters
  const params = new URLSearchParams(location.search);
  const query = decodeURIComponent(params.get("query") || ""); 

  useEffect(() => {
    if (query.trim() === "") {
      setCourses([]); 
      return;
    }

    setLoading(true); 
    setError(null); 

    fetch(`http://localhost:5000/api/courses/search?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        setCourses(data.error ? [] : data); 
      })
      .catch((error) => {
        setLoading(false);
        setError("Error fetching courses. Please try again later.");
        setCourses([]); 
        console.error("Error fetching courses:", error);
      });
  }, [query]);

  // Handle input change and preserve spaces
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    navigate(`?query=${encodeURIComponent(newQuery)}`);
  };

  // Function to navigate to course link
  const handleCourseClick = (url) => {
    window.open(url, "_blank"); // Opens the course link in a new tab
  };

  return (
    <div className="result-container">
      <header className="result-header">
        <a className="result-logo" href="/">LEARN BRIDGE</a>
        <input
          type="text"
          className="result-search"
          placeholder="Search"
          value={query} 
          onChange={handleSearchChange} 
        />
      </header>

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
                onClick={() => handleCourseClick(course.URL)} // Make the div clickable
                style={{ cursor: "pointer" }} // Show pointer cursor on hover
              >
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
