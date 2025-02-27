import React, { useState } from 'react';
import './Signup.css';
import logo from '../assets/learnbridge.png';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Redirect after successful signup
        navigate('/login');
    };

    return (
        <div className="su-overlay">
            <div className="su-container">
                {/* Left Section */}
                <div className="su-left-section">
                    <div className="su-logo-title">
                        <img src={logo} alt="Logo" className="su-logo" />
                        <h1>Learn Bridge</h1>
                    </div>
                    <p className="su-subtext">Join thousands of learners worldwide</p>
                    <button className="su-get-started" onClick={() => navigate('/login')}>
                        Get Started
                    </button>
                </div>

                {/* Right Section */}
                <div className="su-right-section">
                    <h2>Create an Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="su-input-group">
                            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="su-input-group">
                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="su-btn">Sign Up</button>
                    </form>
                    <p className="su-login-text">
                        Already have an account? <button className="su-login-btn" onClick={() => navigate('/login')}>Login</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;

