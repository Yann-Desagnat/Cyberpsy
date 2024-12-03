import React, { useState } from 'react';
import './ForgotPassword.css'; // Fichier CSS pour styliser la page
import logo from '../images/logo.png';
import api from '../../axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos de nous"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token d'authentification
    setIsUserLoggedIn(false); // Met à jour l'état de connexion
    window.location.href = '/login'; // Redirige vers la page de connexion
  };

  // Soumission du formulaire de réinitialisation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!email) {
      setMessage('Veuillez entrer une adresse email valide.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage('Un email de réinitialisation a été envoyé à votre adresse.');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error);
      setMessage('Une erreur est survenue. Vérifiez votre adresse email.');
    } finally {
      setIsSubmitting(false);
    }
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
                <li><a href="/aboutus">En savoir plus sur les créateurs</a></li>
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
      <div className="forgot-password-container">
        <div className="forgot-password-form">
          <h2>Réinitialiser le mot de passe</h2>
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
