import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/singup";
import Login from "./pages/login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);



  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {user && <Sidebar userType={user.userType} />} {/* Pass userType as a prop */}
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />} /* Secure route */
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
