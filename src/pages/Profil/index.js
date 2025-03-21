import React, { useState, useEffect } from 'react';
import './Profil.css';
import logo from '../images/logo.png';
import lockImage from '../images/lock-image.png'; 
import api from '../../axios';// Utilisation d'axios


console.log('profil monté'); //test

const Profil = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState(''); // Nom de l'utilisateur
  //alert(String(localStorage.getItem('token')));
  // Vérifie l'état de l'utilisateur (authentification) au chargement du composant

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage.");
        handleLogout();
        return;
      }
  
      try {
        const response = await api.get('/auth/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.status === 200) {
          setIsUserLoggedIn(true);
          setUserName(`${response.data.prenom} ${response.data.nom}` || 'Utilisateur');
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        handleLogout();
      }
    };

   
  
    checkUserStatus();
  }, []);
  
  /*useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth//getuser', {
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
  }, []);*/

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Supprimer le token de l'utilisateur
    setIsUserLoggedIn(false);
    setUserName('Invité');
  };

  
  function showPopup(popupId) {
    document.getElementById(`popup${popupId}`).style.display = "block";
  }
  
  function closePopup(popupId) {
    document.getElementById(`popup${popupId}`).style.display = "none";
  }
  
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
      
      <div class="container">
      <div className="box" onClick={() => showPopup(1)}>Script Kiddie</div>
<div className="box" onClick={() => showPopup(2)}>Hacktivist</div>
<div className="box" onClick={() => showPopup(3)}>Insider Malveillant</div>
<div className="box" onClick={() => showPopup(4)}>Espion d'Etat</div>
<div className="box" onClick={() => showPopup(5)}>Cybercriminel Professionnel</div>

  </div>


  <div id="popup1" class="popup">
    <button class="close-btn" onClick={() => closePopup(1)}>Close</button>
    <h2>Popup 1</h2>
  <div className="popup-content">
    <div className="popup-item">
    <i class="fa-solid fa-bullseye"></i>
      <span>Défendre une cause ou dénoncer des abus
      </span>
    </div>
    <div className="popup-item">
      <i className="fa fa-shield-alt"></i>
      <span> DDoS (attaque pas déni de service distribué), défiguration de sites web, divulgation de données volées(doxing).</span>
    </div>
    <div className="popup-item">
      <i className="fa fa-users"></i>
      <span> Exploitation des vulnérabilités des systèmes web, utilisation d'outils comme Low orbit Ion Cannon pour coordonner des DDoS. Son impact est souvent médiatique, visant à attirer l'attention sur une cause.</span>
    </div>
  </div>
  </div>

  <div id="popup2" class="popup">
    <button class="close-btn" onClick={() => closePopup(2)}>Close</button>
    <h2>Popup 2</h2>
    <p>This is the content for the second popup.</p>
  </div>

  <div id="popup3" class="popup">
    <button class="close-btn" onClick={() => closePopup(3)}>Close</button>
    <h2>Popup 3</h2>
    <p>This is the content for the third popup.</p>
  </div>

  <div id="popup4" class="popup">
    <button class="close-btn" onClick={() => closePopup(4)}>Close</button>
    <h2>Popup 4</h2>
    <p>This is the content for the fourth popup.</p>
  </div>

  <div id="popup5" class="popup">
    <button class="close-btn" onClick={() => closePopup(5)}>Close</button>
    <h2>Popup 5</h2>
    <p>This is the content for the fifth popup.</p>
  </div>
 </>
  );
};

export default Profil;
