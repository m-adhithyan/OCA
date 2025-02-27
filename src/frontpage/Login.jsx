import React from "react";
import './Login.css'
import logo from "../assets/learnbridge.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="lp-container">
      <div className="lp-section">
        <h2>LOGIN</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <div className="forgot-password">
          <button onClick={() => navigate('/forgot-password')}>Forgot password?</button>
        </div>
        <button className="lp-button" onClick={() => navigate('/search')}>LOGIN</button>
        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">REMEMBER ME</label>
        </div>
      </div>
      <div className="lp-logo-section">
        <img src={logo} alt="Learn Bridge Logo" />
      </div>
    </div>
  );
}

export default Login;
