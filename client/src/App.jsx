import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import RoutesManagement from './pages/RoutesManagement';
import SchedulesManagement from './pages/SchedulesManagement';
import BusManagement from './pages/BusManagement';
import Signup from './pages/singup.jsx';
import Login from './pages/login.jsx'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/route-management" element={<RoutesManagement />} />
            <Route path="/schedules-management" element={<SchedulesManagement />} />
            <Route path="/bus-management" element={<BusManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
