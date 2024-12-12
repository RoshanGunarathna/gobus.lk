import React, { useState } from 'react';
import '../styles/auth.css';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login successful', formData);
      // Proceed with form submission logic (e.g., API calls)
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="https://i.imgur.com/ceOWZEe.png" alt="Side Image" className="side-image" />
      </div>
      <div className="right-section">
        <img src="https://i.imgur.com/fwCuriK.png" alt="Logo" className="logo" />
        <form onSubmit={handleSubmit}>
          <p className="login-now">Login Now..!</p>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="input"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <p className="account-text">
            Don't have an account? <Link to="/"><span className="color">Sign Up</span></Link>
          </p>
          <button type="submit" className="button">Login</button>
        </form>
      </div>
    </div>
  );
}
