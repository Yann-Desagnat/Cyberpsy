import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Jeu from './pages/Jeu';
import Analyse from './pages/Analyse';
import Qcm from './pages/Qcm';

// Fonction de vérification de l'authentification
const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');  // Vérifier si un token est stocké

  // Si l'utilisateur est authentifié (token présent), on rend le composant
  // sinon on redirige vers la page de login
  return token ? element : <Redirect to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);  // Met à jour l'état en fonction de la présence du token
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        
        {/* Routes privées protégées */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Redirect to="/login" />}
        />
        <Route
          path="/analyse"
          element={isAuthenticated ? <Analyse /> : <Redirect to="/login" />}
        />

        {/* Routes publiques */}
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/jeu" element={<Jeu />} />
        <Route path="/qcm" element={<Qcm />} />
      </Routes>
    </Router>
  );
}

export default App;
