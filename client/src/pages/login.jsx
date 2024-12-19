import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import Cookies from "js-cookie";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setUser } = useContext(AuthContext); // Access setUser from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const userData = {
        email: response.data.email,
        userType: response.data.userType,
      };

      // Set user state globally
      setUser(userData);

      // Store access token in cookie and persist user data in localStorage
      Cookies.set("accessToken", response.data.accessToken, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="https://i.imgur.com/ceOWZEe.png" alt="Bus" className="side-image" />
      </div>
      <div className="right-section">
        <img src="https://i.imgur.com/fwCuriK.png" alt="Logo" className="logo" />

        {error && <p className="error-message">{error}</p>}
        <form className="form" onSubmit={handleLogin}>
          <h2 className="signup-now">Login Now!</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button">
            Login
          </button>
        </form>
        <p className="signup-text">
          You do not have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
