import React from "react";
import "./Page1.css";
import appImage from "../assets/app.jpg";
import cloudImage from "../assets/cloud.jpg";
import cybersecurityImage from "../assets/cybersecurity.jpg";
import graphImage from "../assets/graph.jpg";
import pythonImage from "../assets/python.jpg";
import webImage from "../assets/web.jpg";
import { useNavigate } from "react-router-dom";

function Page1() {
  const navigate = useNavigate(); // Initialize navigate function
  return (
    <div className="overlay-1">
      <div className="header">
        <div className="logo-text">
          <h2>Learn bridge</h2>
        </div>
        <div className="button-group">
          <button id="login-button" className="ls" onClick={() => {navigate('/login')}}>Login</button>
          <button id="signup-button" className="ls" >Signup</button>
        </div>
      </div>

      <div className="card-container">
        <div className="card">
          <div className="img-container" id="img1">
            <img src={appImage} alt="App Development" />
          </div>
          <div className="text">
            <h2>App Development</h2>
            <p>Learn to build mobile, web, and desktop applications using popular programming languages.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img2">
            <img src={cloudImage} alt="Cloud Computing" />
          </div>
          <div className="text">
            <h2>Cloud Computing</h2>
            <p>Learn about cloud platforms, storage, and virtual infrastructure.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img3">
           <img src={cybersecurityImage} alt="Cybersecurity" />
          </div>
          <div className="text">
            <h2>Cybersecurity</h2>
            <p>Understand security threats, vulnerabilities, and protection mechanisms.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img4">
           <img src={graphImage} alt="Graph Theory" />
          </div>
          <div className="text">
            <h2>Graph Theory</h2>
            <p>Explore graph algorithms, trees, and network structures.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img5">
           <img src={pythonImage} alt="Python Programming" />
          </div>
          <div className="text">
            <h2>Python Programming</h2>
            <p>Master Python syntax, libraries, and application development.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img6">
            <img src={webImage} alt="Web Development" />
          </div>
          <div className="text">
            <h2>Web Development</h2>
            <p>Build modern, responsive websites using HTML, CSS, and JavaScript.</p>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
    </div>
  );
}

export default Page1;
