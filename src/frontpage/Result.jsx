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
  const query = decodeURIComponent(params.get("query") || "")
    .toLowerCase()
    .trim();
  const rating = params.get("rating") || "";
  const price = params.get("price") || "";
  const level = params.get("level") || "";
  const duration = params.get("duration") || "";
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
    )}&rating=${rating}&price=${price}&level=${level}&duration=${duration}&page=${page}`;

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
          // Updated filter to allow partial matches instead of exact
          const filteredCourses = data.courses.filter(
            (course) =>
              course.Title.toLowerCase().includes(query) ||
              course.Description.toLowerCase().includes(query)
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
  }, [query, rating, price, level, duration, page]);

  // Handle input change and preserve spaces
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    navigate(
      `?query=${encodeURIComponent(
        newQuery
      )}&rating=${rating}&price=${price}&level=${level}&duration=${duration}&page=${page}`
    );
  };

  // Function to navigate to course link
  const handleCourseClick = (url) => {
    window.open(url, "_blank"); // Opens the course link in a new tab
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
                  <p>
                    <strong>{course.Title}</strong>
                  </p>
                  <p>Price: {course.Price || "Free"}</p>
                  <p>Rating: {course.Rating} ⭐</p>
                  <p>Level: {course.Level} </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
@app.route('/api/courses/recommended', methods=['GET'])
def get_recommended_courses():
    """
    Returns recommended courses based on search query or random selection.
    """
    query = request.args.get("query", "").lower().strip()
    df = load_course_data()
    
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500

    # **Basic recommendation logic**
    if query:
        recommended_courses = df[
            df['Title'].str.lower().str.contains(query) |
            df['Description'].str.lower().str.contains(query)
        ]
    else:
        recommended_courses = df  # If no query, consider all courses

    # **Pick 5 random recommended courses**
    recommended_courses = recommended_courses.sample(n=min(5, len(recommended_courses)))

    return jsonify(recommended_courses.to_dict(orient="records"))

@app.route('/api/courses/top-picks', methods=['GET'])
def get_top_picks():
    """
    Returns top-rated courses (sorted by rating).
    """
    df = load_course_data()
    
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500

    # **Convert rating to numeric and sort descending**
    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce')
    top_picks = df.sort_values(by='Rating', ascending=False).head(5)

    return jsonify(top_picks.to_dict(orient="records"))
export default Result;
