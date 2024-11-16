import React, { useState } from 'react';
import './Login.css';
import logo from '../images/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Pour gérer l'ouverture du menu Profil
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Pour gérer l'ouverture du menu À propos

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion basée sur la table Utilisateur
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

          <li
    className="dropdown"
    onMouseEnter={() => setIsProfilOpen(true)}
    onMouseLeave={() => setIsProfilOpen(false)}
  >


  <a href="/profil" onClick={(e) => e.preventDefault()}>Profil</a>
    {isProfilOpen && (
      <ul className="dropdown-menu">
        <li><a href="/profilCyber">Les profils en cybersécurité</a></li>
        <li><a href="/mon-tableau-de-bord">Mon tableau de Bord</a></li>
        <li><a href="/parametreCompte">Paramètre de mon compte</a></li>
      </ul>
    )}
  </li>

          <li><a href="/analyse">Analyse</a></li>
          <li><a href="/simulation">Simulation</a></li>
          
          <li
            className="dropdown"
            onMouseEnter={() => setIsAboutOpen(true)}
            onMouseLeave={() => setIsAboutOpen(false)}
          >
          <a href="/about" onClick={(e) => e.preventDefault()}>À propos de nous</a>
          {isAboutOpen && (

              <ul className="dropdown-menu">
                <li><a href="/en-savoir-plus">En savoir plus sur les créateurs de CyberPsy</a></li>
                <li><a href="/jeu">Découvrir notre jeu Android</a></li>
              </ul>
            )}

          </li>

      <div className="nav-right">
      <li><a href="/login">Se connecter</a></li>
      <li><a href="/register" className="btn-open-account">Créer un compte</a></li> </div>
          
        
          
        </ul>
      </nav>

      {/* Section de connexion */}
      <div className="login-container">
        <h2>Connexion</h2>
        <p>Accéder à CyberPsy</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="exemple@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Se connecter</button>
        </form>
        <div className="login-links">
          <a href="/forgot-password">Mot de passe oublié ?</a>
          <a href="/register">Créer un compte !</a>
        </div>
      </div>
    </>
  );
};

export default Login;
