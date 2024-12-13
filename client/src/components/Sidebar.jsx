import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <img src="https://i.imgur.com/4SIV82G.png" className="img-logo" alt="Logo" />
      <h2 className="style">NTC Admin Panel</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className="sidebar-link" activeClassName="active-link">
              <img src="https://i.imgur.com/0o5A9BX.png" className="img-icon1" alt="Dashboard" />
              Dashboard
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/user-management" className="sidebar-link" activeClassName="active-link">
              <img src="https://i.imgur.com/wwPh09a.png" className="img-icon2" alt="User Management" />
              User Management
            </NavLink>
          </li>

          <li>
            <NavLink to="/route-management" className="sidebar-link" activeClassName="active-link">
              <img src="https://i.imgur.com/eq8qfsn.png" className="img-icon3" alt="Route Management" />
              Route Management
            </NavLink>
          </li>

          <li>
            <NavLink to="/schedules-management" className="sidebar-link" activeClassName="active-link">
              <img src="https://i.imgur.com/41jSlMi.png" className="img-icon4" alt="Schedules Management" />
              Schedules Management
            </NavLink>
          </li>

          <li>
            <NavLink to="/bus-management" className="sidebar-link" activeClassName="active-link">
              <img src="https://i.imgur.com/0fyGwPD.png" className="img-icon5" alt="Bus Management" />
              Bus Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
