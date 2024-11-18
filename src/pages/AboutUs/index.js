import React, { useState } from 'react';
import './AboutUs.css';
import logo from '../images/logo.png';
import Avatar1 from '../images/avatar1.png'; 
import Avatar2 from '../images/avatar2.png'; 
import Avatar3 from '../images/avatar3.png'; 

const AboutUs = () => {
    const [isAboutOpen, setIsAboutOpen] = useState(false); // Ajout de l'état pour le menu déroulant
    const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté
  
    // voir quand yann aura fini back Fonction de déconnexion (peut être adaptée selon la logique de votre application)
    const handleLogout = () => {
      setIsUserLoggedIn(false);
      // Vous pouvez aussi supprimer un token d'authentification ou rediriger l'utilisateur ici
      // Exemple : localStorage.removeItem('authToken');
      // Exemple : history.push('/login');
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
        {isUserLoggedIn && (
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
                  <li><a href="/" onClick={handleLogout}>Se déconnecter</a></li> {/* Bouton de déconnexion */}
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

      <div className="about-us">
        <h1>About Us</h1>
        <div className="team-members">
          <div className="team-member">
            <img src={Avatar2} alt="Avatar2" className="avatar" />
            <h3>Fatima Imam</h3>
            <p>Fatima est une designer talentueuse, experte en interfaces modernes et intuitives.</p>
          </div>
          <div className="team-member">
            <img src={Avatar1} alt="Avatar1" className="avatar" />
            <h3>Yann Desagnat</h3>
            <p>Yann est un développeur passionné, spécialisé en backend. Il adore résoudre des problèmes complexes</p>
          </div>
          <div className="team-member">
            <img src={Avatar3} alt="Avatar3" className="avatar" />
            <h3>Johana Lumoni</h3>
            <p>Johana est une cheffe de projet IT, experte en gestion d’équipes et de délais.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
