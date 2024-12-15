import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ userType }) {
  const getSidebarItems = () => {
    switch (userType) {
      case 'admin':
        return [
          { path: '/', label: 'Dashboard', icon: 'https://i.imgur.com/0o5A9BX.png' },
          { path: '/user-management', label: 'User Management', icon: 'https://i.imgur.com/wwPh09a.png' },
          { path: '/route-management', label: 'Route Management', icon: 'https://i.imgur.com/eq8qfsn.png' },
          { path: '/schedules-management', label: 'Schedules Management', icon: 'https://i.imgur.com/41jSlMi.png' },
          { path: '/bus-management', label: 'Bus Management', icon: 'https://i.imgur.com/0fyGwPD.png' },
        ];
      case 'operator':
        return [
          { path: '/', label: 'Dashboard', icon: 'https://i.imgur.com/0o5A9BX.png' },
          { path: '/booking-management', label: 'Booking Management', icon: 'https://i.imgur.com/VPo06lE.png' },
          { path: '/route-management', label: 'Route Management', icon: 'https://i.imgur.com/eq8qfsn.png' },
          { path: '/schedules-management', label: 'Schedules Management', icon: 'https://i.imgur.com/41jSlMi.png' },
          { path: '/bus-management', label: 'Bus Management', icon: 'https://i.imgur.com/0fyGwPD.png' },
        ];
      case 'commuter':
        return [
          { path: '/', label: 'Dashboard', icon: 'https://i.imgur.com/0o5A9BX.png' },
          { path: '/booking-management', label: 'My Booking', icon: 'https://i.imgur.com/VPo06lE.png' },
          { path: '/profile', label: 'Profile', icon: 'https://i.imgur.com/Xs88ZWL.png' },
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
        return 'Panel';
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
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <NavLink to={item.path} className="sidebar-link" activeClassName="active-link">
                <img src={item.icon} className="img-icon" alt={item.label} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
