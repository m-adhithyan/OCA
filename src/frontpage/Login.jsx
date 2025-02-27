import React from "react";
import './Login.css'

function Login() {
  return (
    <div class="container">
        <div class="login-section">
            <h2>LOGIN</h2>
            <input type="text" placeholder="Username"/>
            <input type="password" placeholder="Password"/>
                <div class="forgot-password">
                     <button onclick="location.href='forgot-password.html'">Forgot password?</button>
                </div>
                <button class="login-button">LOGIN</button>
                <div class="remember-me">
                    <input type="checkbox" id="remember"/>
                    <label for="remember">REMEMBER ME</label>
                </div>
        </div>
        <div class="logo-section">
            <img src="lb.jpg" alt="Learn Bridge Logo"/>
        </div>
    </div>
  );
}

export default Login;
