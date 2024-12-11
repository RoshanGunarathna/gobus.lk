import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/singup.jsx';
import Login from './pages/login.jsx'; // Make sure this file exists and is correctly implemented

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} /> {/* Default route */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
