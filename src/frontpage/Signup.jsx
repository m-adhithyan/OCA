import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setShowOtpPopup(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/verify-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setShowOtpPopup(false);
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setLoading(false);
      setError("Failed to verify OTP. Try again.");
    }
  };

  return (
    <div className="su-overlay">
      <div className="su-container">
        <div className="su-left-section">
          <p className="su-subtext">Join thousands of learners worldwide</p>
          <button className="su-get-started" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>

        <div className="su-right-section">
          <h2>Create an Account</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
            <button type="submit" className="su-btn">{loading ? "Processing..." : "Sign Up"}</button>
          </form>
        </div>
      </div>

      {showOtpPopup && (
        <div className="otp-overlay">
        <div className="otp-popup">
          <h3>Enter OTP sent to your email</h3>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default Signup;
