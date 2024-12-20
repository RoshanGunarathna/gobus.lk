// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./pages/singup";
import Login from "./pages/login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ user, children }) => {
//   if (!user) return <Navigate to="/login" />;
//   return children;
// };

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const user = useSelector((state) => {
    console.log(`State ??? :: ${JSON.stringify(state.user)}`);
    return state.user.user;
  });

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


// function AppContent() {
//   const user = useSelector(state =>{
//     console.log(`State ??? :: ${state.user}`);
//    return state.user;
//   } );

//   return (
//     <div className="app-container">
    
//       <Routes>
//         <Route
//           path="/"
//           element={ user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
//         />
//         <Route path="/dashboard" element={
//             <ProtectedRoute user={user}>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }

// function AppContent() {
//   const user = useSelector((state) => {
//     console.log(`State ??? :: ${JSON.stringify(state.user)}`);
//     return state.user;
//   });

//   return (
//     <div className="app-container">
//       <Routes>
//         <Route
//           path="/"
//           element={
//             user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute user={user}>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </div>
//   );
// }


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

  /* {user && <Sidebar />} */
