import React, { useState, useEffect } from 'react';
import './Home.css';
import logo from '../images/logo.png';
import lockImage from '../images/lock-image.png'; 
import api from '../../axios';// Utilisation d'axios
console.log('home monté'); //test

const Home = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState('invité'); // Nom de l'utilisateur

  // Vérifie l'état de l'utilisateur (authentification) au chargement du composant
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/secure/user', {
            headers: {
              Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
            },
          }); // endpoint sécurisé

          if (response.status === 200) {
            setIsUserLoggedIn(true);
            setUserName(response.data.name || 'Utilisateur'); // Le backend retourne le nom de l'utilisateur
          } else {
            handleLogout(); // Si la réponse n'est pas valide, on se déconnecte
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'utilisateur:', error);
          handleLogout(); // En cas d'erreur, on déconnecte l'utilisateur
        }
      }
    };

    checkUserStatus();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Supprimer le token de l'utilisateur
    setIsUserLoggedIn(false);
    setUserName('Invité');
    window.location.href = '/login'; // Rediriger vers la page de login
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
            <h1>Bienvenue {isUserLoggedIn ? userName : 'invité'} ! CyberPsy</h1>
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
