import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../api/authApi';
import { updateUser } from '../redux/userSlice';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
   const { loading, error, isAuthenticated, user } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    

    try {
     // dispatch(loading());
      const user = await login(email, password);
    

    
      // Extract user data from the nested structure
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      navigate("/dashboard");

      // Update Redux store directly
      dispatch(updateUser(userData));
    } catch (err) {
      console.error('Login Error:', err);
      //dispatch(loginFailure(err.message || 'Login failed'));
      showToast(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container-login">
      {toastMessage && <div className="toast">{toastMessage}</div>}
      <div className="left-section">
        <img src="https://i.imgur.com/ceOWZEe.png" alt="Bus" className="side-image" />
      </div>
      <div className="right-section">
        <img src="https://i.imgur.com/fwCuriK.png" alt="Logo" className="logo" />
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
          <p className="signup-text">
            You do not have an account? <a href="/signup">Sign Up</a>
          </p>
          <button 
            type="submit" 
            className="button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
