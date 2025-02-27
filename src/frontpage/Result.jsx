import React from "react";
import "./Result.css";
import cd from "../assets/cd.jpg";

function Result() {
    
  return (
    <div className="result-container">
      {/* Header */}
      <header className="result-header">
        <a className="result-logo" href="#">LEARN BRIDGE</a>
        <input type="text" className="result-search" placeholder="Search" />
        <nav className="result-navigation">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
          <button className="result-bttn-login">Log in</button>
        </nav>
      </header>

      {/* Main Section */}
      <main className="result-main">
        <div className="result-course-list">
          {/* Course Items */}
          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Full Tutorial" />
            </div>
            <div>
              <p><strong>Python Full Tutorial</strong></p>
              <p>Price: ₹699</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Data Structures" />
            </div>
            <div>
              <p><strong>Python Data Structures</strong></p>
              <p>Price: ₹599</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Programming" />
            </div>
            <div>
              <p><strong>Python Programming</strong></p>
              <p>Price: ₹800</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python for Backend" />
            </div>
            <div>
              <p><strong>Python for Backend</strong></p>
              <p>Price: ₹899</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Django" />
            </div>
            <div>
              <p><strong>Python Django</strong></p>
              <p>Price: ₹699</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Flask" />
            </div>
            <div>
              <p><strong>Python Flask</strong></p>
              <p>Price: ₹599</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python Machine Learning" />
            </div>
            <div>
              <p><strong>Python Machine Learning</strong></p>
              <p>Price: ₹800</p>
            </div>
          </div>

          <div className="result-preview">
            <div>
              <img className="result-thumbnail" src={cd} alt="Python for AI" />
            </div>
            <div>
              <p><strong>Python for AI</strong></p>
              <p>Price: ₹899</p>
            </div>
          </div>
        </div>
      </main>

      {/* Pagination */}
      <div className="result-pagination">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#">3</a>
        <a href="#">4</a>
        <a href="#">5</a>
        <a href="#">Next</a>
      </div>
    </div>
  );
}

export default Result;
