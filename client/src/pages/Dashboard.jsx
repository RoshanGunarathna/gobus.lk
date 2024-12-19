import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored tokens
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    // Clear user data from localStorage
    localStorage.removeItem('user');

    // Redirect to login
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard!</p>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Dashboard;
