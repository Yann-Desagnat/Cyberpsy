import React, { useState } from 'react';
import './Register.css';
import logo from '../images/logo.png';
import axios from 'axios';


const Register = () => {
  const [username, setUsername] = useState(''); // Gère le champ de nom d'utilisateur
  const [email, setEmail] = useState(''); // Gère le champ email
  const [password, setPassword] = useState(''); // Gère le champ mot de passe
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Gère l'ouverture du menu déroulant "À propos de nous"
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    if (password.length < 6) {
      alert('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
  
    try {
      const response = await axios.post('https://ton-backend.azurewebsites.net/api/auth/register', {
        username,
        email,
        password,
      });
  
      if (response.status === 201) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        window.location.href = '/login'; // Redirige l'utilisateur vers la page de connexion
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    }finally {
      setIsLoading(false); // Ceci sera exécuté dans tous les cas
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
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Met à jour le username
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
          <button type="submit"disabled={isLoading}>
            {isLoading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
