import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Jeu from './pages/Jeu';
import Analyse from './pages/Analyse';
import Qcm from './pages/Qcm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/jeu" element={<Jeu />} />
        <Route path="/analyse" element={<Analyse />} />
        <Route path="/qcm" element={<Qcm />} />
      </Routes>
    </Router>
  );
}

export default App;
