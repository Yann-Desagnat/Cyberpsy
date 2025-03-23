import React, { useState, useEffect } from 'react';
import './Home.css';
import logo from '../images/logo.png';
import lockImage from '../images/lock-image.png'; 
import api from '../../axios';// Utilisation d'axios

const Home = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState(''); // Nom de l'utilisateur

  // Vérifie l'état de l'utilisateur (authentification) au chargement du composant
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage.");
        setIsUserLoggedIn(false);
        return; // Si pas de token, l'utilisateur n'est pas connecté
      }

      try {
        const response = await api.get('/auth/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsUserLoggedIn(true);
          setUserName(`${response.data.prenom} ${response.data.nom}` || 'Utilisateur');
        } else {
          setIsUserLoggedIn(false); // Si la réponse est incorrecte, l'utilisateur n'est pas connecté
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setIsUserLoggedIn(false);  // En cas d'erreur, l'utilisateur n'est pas connecté
      }
    };

    checkUserStatus();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
    localStorage.removeItem("userId");
    setIsUserLoggedIn(false);
    setUserName('Invité');
  };

  return (
    <>
      {/* Barre de navigation */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="CyberPsy Logo" className="logo-image" />
          <span className="site-title">CyberPsy</span>
        </div>

        <ul className="nav-links">
          <li><a href="/">Accueil</a></li>
          <li><a href="/profil">Profil</a></li>
          <li><a href="/analyse">Analyse</a></li>
          <li><a href="/simulation">Simulation</a></li>

          {/* Menu déroulant "À propos de nous" */}
          <li
            className="dropdown"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
            <a href="/about" onClick={(e) => e.preventDefault()}>À propos de nous</a>
            {isAboutOpen && (
              <ul className="dropdown-menu">
                <li><a href="/aboutus">En savoir plus sur les créateurs de CyberPsy</a></li>
                <li><a href="/jeu">Découvrir notre jeu Android</a></li>
              </ul>
            )}
          </li>

          {/* Menu déroulant "Utilisateur" (affiché si l'utilisateur est connecté) */}
          {isUserLoggedIn && (
            <li
              className="dropdown"
              onMouseEnter={() => setIsProfilOpen(true)}
              onMouseLeave={() => setIsProfilOpen(false)}
            >
              <a href="/" onClick={(e) => e.preventDefault()}>{userName}</a>
              {isProfilOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/userBoard">Mon tableau de bord</a></li>
                  <li><a href="/parametreCompte">Paramètre de mon compte</a></li>
                  <li><a href="/" onClick={handleLogout}>Se déconnecter</a></li>
                </ul>
              )}
            </li>
          )}

          {/* Si l'utilisateur n'est pas connecté */}
          {!isUserLoggedIn && (
            <div className="nav-right">
              <li><a href="/login">Se connecter</a></li>
              <li><a href="/register" className="btn-open-account">Créer un compte</a></li>
            </div>
          )}
        </ul>
      </nav>

      {/* Contenu principal */}
      <main className="home-container">
        <div className="content-wrapper">
          <div className="text-container">
            <h1> {isUserLoggedIn ? userName : ''} CyberPsy</h1>
            <p className="description">
              Ce site a pour but de vous aider à comprendre le risque de la
              CyberAttaque et de pouvoir vous aider à analyser et comprendre vos attaques.
            </p>
            <div className="button-group">
              <a href="/analyse" className="btn-analyser">Lancer une analyse</a>
              <a href="/profil" className="btn-profil">Consulter les profils en cybersécurité</a>
            </div>
          </div>
          <div className="image-container">
            <img src={lockImage} alt="Cadenas" className="lock-image" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
