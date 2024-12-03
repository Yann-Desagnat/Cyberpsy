import React, { useState } from 'react';
import './Register.css';
import logo from '../images/logo.png';
import api from '../../axios';

const Register = () => {
  const [firstName, setFirstName] = useState(''); // Champ pour le prénom
  const [lastName, setLastName] = useState(''); // Champ pour le nom
  const [email, setEmail] = useState(''); // Champ pour l'email
  const [password, setPassword] = useState(''); // Champ pour le mot de passe
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des champs
    if (!firstName || !lastName || !email || !password) {
      alert('Tous les champs sont obligatoires.');
      setIsLoading(false);
      return;
    }

    try {
      const currentDate = new Date().toISOString(); // Date actuelle au format ISO
      const role = 'Utilisateur'; // Rôle par défaut
      const niveauUtilisateur = 0; // Niveau par défaut

      const response = await api.post('/auth/register', {
        nom: lastName,
        prenom: firstName,
        email,
        mot_de_passe: password,
        role,
        niveau_utilisateur: niveauUtilisateur,
        derniere_activite: currentDate,
      });

      if (response.status === 201) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        window.location.href = '/login'; // Redirige l'utilisateur vers la page de connexion
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
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
          <div className="nav-right">
            <li><a href="/login">Se connecter</a></li>
            <li><a href="/register" className="btn-open-account">Créer un compte</a></li>
          </div>
        </ul>
      </nav>

      {/* Section d'inscription */}
      <div className="register-container">
        <h2>Inscription</h2>
        <p className="login-prompt">
          Déjà inscrit(e) ? <a href="/login" className="login-link">Connectez-vous ici.</a>
        </p>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} // Met à jour le nom
          />
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} // Met à jour le prénom
          />
         
          <input
            type="email"
            placeholder="exemple@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Met à jour l'email
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Met à jour le mot de passe
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
