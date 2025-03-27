import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/search");
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-overlay"> {/* Added login-overlay */}
      <div className="lp-container">
        <div className="lp-section">
          <h2>LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="lp-button" type="submit">
              LOGIN
            </button>
          </form>
        </div>

        <div className="lp-right-section">
          <h1>Welcome to Learn Bridge</h1>
          <p>Don't have an account?</p>
          <button className="signup-button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
