import React, { useState } from 'react';
import './Jeu.css';
import logo from '../images/logo.png';
import phoneImage from '../images/phone-image.png';

const Jeu = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // État de connexion utilisateur

  // Fonction de déconnexion
  const handleLogout = () => {
    setIsUserLoggedIn(false);
    // Exemple : suppression d'un token d'authentification
    // localStorage.removeItem('authToken');
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
          <li><a href="/home">Accueil</a></li>
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

          {/* Menu déroulant "Utilisateur" */}
          {isUserLoggedIn ? (
            <li
              className="dropdown"
              onMouseEnter={() => setIsProfilOpen(true)}
              onMouseLeave={() => setIsProfilOpen(false)}
            >
              <a href="/" onClick={(e) => e.preventDefault()}>Utilisateur</a>
              {isProfilOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/userBoard">Mon tableau de bord</a></li>
                  <li><a href="/parametreCompte">Paramètre de mon compte</a></li>
                  <li><a href="/" onClick={handleLogout}>Se déconnecter</a></li>
                </ul>
              )}
            </li>
          ) : (
            <div className="nav-right">
              <li><a href="/login">Se connecter</a></li>
              <li><a href="/register" className="btn-open-account">Créer un compte</a></li>
            </div>
          )}
        </ul>
      </nav>

      {/* Contenu principal */}
      <div className="contenair-jeu">
        <div className="content-wrapper">
          <div className="text-container">
            <h1 className="description">Notre application socio-éducatif</h1>
            <p className="description">
              Ce jeu est une simulation de cyberattaque afin d’expliquer les vulnérabilités du quotidien.
              C’est un contenu socio-éducatif et ludique pour tout type de personne.
            </p>
            <button className="download-btn">DOWNLOAD</button>
          </div>
          <div className="image-container">
            <img src={phoneImage} alt="Phone Mockup" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Jeu;
