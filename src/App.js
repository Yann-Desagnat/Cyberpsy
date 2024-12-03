import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Jeu from './pages/Jeu';
import Analyse from './pages/Analyse';
import Qcm from './pages/Qcm';
import Simulation from './pages/Simulation'; 
import ForgotPassword from './pages/ForgotPassword'; 
import UserBoard from './pages/UserBoard';

console.log('App.js monté');// test
 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Vérifie si un token est présent
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/qcm" element={<Qcm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/userBoard" element={<UserBoard />} />

        {/* Route nécessitant une authentification */}
        <Route
          path="/simulation"
          element={isAuthenticated ? <Simulation /> : <Navigate to="/login" />}
        />
        

        {/* Autres routes publiques */}
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/jeu" element={<Jeu />} />
      </Routes>
    </Router>
  );
}

export default App;
