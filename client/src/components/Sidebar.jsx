// Sidebar.js
import { useNavigate } from 'react-router-dom';
import { removeUser } from '../redux/userSlice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../api/authApi'; 
import '../styles/Sidebar.css';

const formatRole = (role) => {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';
};

function Sidebar() {
  const userType = useSelector((state) => state.user?.user?.role || 'guest');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();    
      dispatch(removeUser());
      localStorage.removeItem('accessToken');  
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const getSidebarItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: 'https://i.imgur.com/0o5A9BX.png' },
          { path: '/booking-management', label: 'Booking Management', icon: 'https://i.imgur.com/VPo06lE.png' },
          { path: '/user-management', label: 'User Management', icon: 'https://i.imgur.com/wwPh09a.png' },
          { path: '/route-management', label: 'Route Management', icon: 'https://i.imgur.com/eq8qfsn.png' },
          { path: '/schedules-management', label: 'Schedules Management', icon: 'https://i.imgur.com/41jSlMi.png' },
          { path: '/bus-management', label: 'Bus Management', icon: 'https://i.imgur.com/0fyGwPD.png' },
        ];
      case 'operator':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: 'https://i.imgur.com/0o5A9BX.png' },
          { path: '/booking-management', label: 'Booking Management', icon: 'https://i.imgur.com/VPo06lE.png' },
          { path: '/route-management', label: 'Route Management', icon: 'https://i.imgur.com/eq8qfsn.png' },
          { path: '/schedules-management', label: 'Schedules Management', icon: 'https://i.imgur.com/41jSlMi.png' },
          { path: '/bus-management', label: 'Bus Management', icon: 'https://i.imgur.com/0fyGwPD.png' },
        ];
      case 'commuter':
        return [
          { path: '/booking-management', label: 'My Booking', icon: 'https://i.imgur.com/VPo06lE.png' },
          { path: '/profile-management', label: 'Profile', icon: 'https://i.imgur.com/Xs88ZWL.png' },
        ];
      default:
        return [];
    }
  };

  const getPanelLabel = () => {
    switch (userType) {
      case 'admin':
        return 'NTC Admin Panel';
      case 'operator':
        return 'Bus Operator Panel';
      case 'commuter':
        return 'Commuter Section';
      default:
        return 'Guest Panel';
    }
  };

  const sidebarItems = getSidebarItems();
  const panelLabel = getPanelLabel();

  return (
    <div className="sidebar">
      <img src="https://i.imgur.com/4SIV82G.png" className="img-logo" alt="Logo" />
      <h2 className="style">{panelLabel}</h2>
      <nav>
        <ul>
          {sidebarItems?.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-link${isActive ? ' active-link' : ''}`}
              >
                <img src={item.icon} className="img-icon" alt={item.label} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="logout-section">
        <button onClick={handleLogout} className="logout-btn">
          <img src="https://i.imgur.com/gRILelJ.png" alt="Logout" className="logout-icon" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;