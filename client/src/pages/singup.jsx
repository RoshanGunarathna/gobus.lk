import React, { useState } from 'react';
import '../styles/auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi'; // Import the register function

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // For navigation after successful signup

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required.';
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validate()) {
        const response = await register(formData.name, formData.email, formData.password);
        // Show success message
        setErrors({});
        navigate('/'); // Redirect to login after successful signup
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Error during registration. Please try again.' });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container-login">
      <div className="left-section">
        <img src="https://i.imgur.com/ceOWZEe.png" alt="Side Image" className="side-image" />
      </div>
      <div className="right-section">
        <img src="https://i.imgur.com/fwCuriK.png" alt="Logo" className="logo" />
        <form onSubmit={handleSubmit}>
          <p className="signup-now">Sign Up Now..!</p>

          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            className="input"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

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
            Already have an account? <Link to="/"><span className="color">Login</span></Link>
          </p>
          {errors.general && <p className="error-text">{errors.general}</p>}
          <button type="submit" className="button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
