import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Booking from './pages/BookingManagement';
import Dashboard from './pages/Dashboard';
import Profile from './pages/profileManagement';
import UserManagement from './pages/UserManagement';
import RoutesManagement from './pages/RoutesManagement';
import SchedulesManagement from './pages/SchedulesManagement';
import BusManagement from './pages/BusManagement';
import Signup from './pages/singup';
import Login from './pages/login';
import './App.css';

function App() {
  const userType = 'commuter'; 

  return (
    <Router>
      <div className="app-container">
        <Sidebar userType={userType} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/route-management" element={<RoutesManagement />} />
            <Route path="/schedules-management" element={<SchedulesManagement />} />
            <Route path="/bus-management" element={<BusManagement />} />
            <Route path="/booking-management" element={<Booking userType={userType} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
