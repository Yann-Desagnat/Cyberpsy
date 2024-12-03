import React, { useState } from 'react';
import './Analyse.css';
import logo from '../images/logo.png';


const Analyse = () => {

  

 

  const [isAboutOpen, setIsAboutOpen] = useState(false); // Ajout de l'état pour le menu déroulant
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // État pour vérifier si l'utilisateur est connecté

 
  // voir quand yann aura fini back Fonction de déconnexion (peut être adaptée selon la logique de votre application)
  const handleLogout = () => {
    setIsUserLoggedIn(true);
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
     

      {/* Contenu principal */}
      <div className="analyse-container">
      <h1 className="analyse-title">Analyse</h1>
      <p className="analyse-description">
        Vous pensez être la cible d'une cyberattaque ? <br />
        Vous souhaitez découvrir qui se cache derrière ou comprendre le profil de l'attaquant ?
      </p>
      <p className="analyse-description">
        Ce questionnaire est conçu pour vous aider à analyser les motivations, les cibles potentielles, et les méthodes utilisées par la personne ou le groupe à l'origine de l'attaque.
      </p>
      <p className="analyse-description">
        Identifiez votre attaquant et comprenez leurs intentions pour mieux vous protéger et anticiper leurs prochaines actions.
      </p>
      <a href="/Qcm" className="analyse-button">Commencer</a>
    </div>

      </>
  );
};

export default Analyse;