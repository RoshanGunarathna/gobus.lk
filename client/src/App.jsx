// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./pages/singup";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RoutesManagement from "./pages/RoutesManagement";
import SchedulesManagement from "./pages/SchedulesManagement";
import BusManagement from "./pages/BusManagement";
import BookingManagement from "./pages/BookingManagement";
import ProfileManagement from "./pages/profileManagement";
import { useEffect } from "react";
import './App.css';



const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => {
    return state.user.user;
  });


  // Redirect based on the user state change
  useEffect(() => {
    if (user) {
      // navigate("/dashboard");
    } 
   else if(location.pathname != "/signup"){
      navigate("/login");
    } 
  }, [user, navigate]);

  
  return (
    <div className="app-container">
       
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        
        <Route path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/route-management" element={<RoutesManagement />} />
        <Route path="/schedules-management" element={<SchedulesManagement />} />
        <Route path="/bus-management" element={<BusManagement />} />
        <Route path="/booking-management" element={<BookingManagement />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;