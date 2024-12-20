// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate} from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./pages/singup";
import Login from "./pages/login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";



const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const navigate = useNavigate();

  const user = useSelector((state) => {
    console.log(`State ??? :: ${JSON.stringify(state.user.user)}`);
    return state.user.user;
  });


  // Redirect based on the user state change
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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

  /* {user && <Sidebar />} */
