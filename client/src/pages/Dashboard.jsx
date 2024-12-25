import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';


function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(removeUser());
    navigate('/login');
  };
  

  return (
    <div className="container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
        <button onClick={handleLogout} className="logoutButton">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
