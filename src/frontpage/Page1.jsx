import React from "react";
import "./Page1.css";
import appImage from "../assets/app.jpg";
import cloudImage from "../assets/cloud.jpg";
import cybersecurityImage from "../assets/cybersecurity.jpg";
import graphImage from "../assets/graph.jpg";
import pythonImage from "../assets/python.jpg";
import webImage from "../assets/web.jpg";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Page1() {
  const navigate = useNavigate(); 
  return (
    <div className="overlay-1">
      <div className="ftp-header">
        <div className="logo-text">
          <h2>Learn bridge</h2>
        </div>
        <div className="button-group">
          <button id="login-button" className="ls" onClick={() => {navigate('/login')}}>Login</button>
          <button id="signup-button" className="ls" onClick={() => {navigate('/Signup')}} >Signup</button>
        </div>
      </div>

      <div className="card-container">
        <div className="card">
          <div className="img-container" id="img1" onClick={() => {navigate('/login')}} >
            <img src={appImage} alt="App Development" onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>App Development</h2>
            <p>Learn to build mobile, web, and desktop applications using popular programming languages.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img2"onClick={() => {navigate('/login')}}>
            <img src={cloudImage} alt="Cloud Computing"onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>Cloud Computing</h2>
            <p>Learn about cloud platforms, storage, and virtual infrastructure.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img3"onClick={() => {navigate('/login')}}>
           <img src={cybersecurityImage} alt="Cybersecurity"onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>Cybersecurity</h2>
            <p>Understand security threats, vulnerabilities, and protection mechanisms.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img4"onClick={() => {navigate('/login')}}>
           <img src={graphImage} alt="Graph Theory"onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>Graph Theory</h2>
            <p>Explore graph algorithms, trees, and network structures.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img5"onClick={() => {navigate('/login')}}>
           <img src={pythonImage} alt="Python Programming"onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>Python Programming</h2>
            <p>Master Python syntax, libraries, and application development.</p>
          </div>
        </div>
        <div className="card">
          <div className="img-container" id="img6"onClick={() => {navigate('/login')}}>
            <img src={webImage} alt="Web Development"onClick={() => {navigate('/login')}} />
          </div>
          <div className="text">
            <h2>Web Development</h2>
            <p>Build modern, responsive websites using HTML, CSS, and JavaScript.</p>
          </div>
        </div>
      </div>

      

<div className="search-bar">
  <button onClick={() => navigate('/login')}>
    Try Now <FaArrowRight className="icon" />
  </button>
</div>

    </div>
  );
}

export default Page1;
