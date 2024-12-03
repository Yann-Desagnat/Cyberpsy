import React, { useState } from 'react';
import './Login.css';
import logo from '../images/logo.png';
import api from '../../axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Pour gérer l'ouverture du menu À propos
  const [isLoading, setIsLoading] = useState(false);

    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      // Vérifier si les champs sont vides
      if (!email || !password) {
        alert('Tous les champs sont obligatoires.');
        setIsLoading(false);
        return;
      }
  
      try {
        const response = await api.post('/auth/login', {
          email,
          password,
        });
  
        // Si la connexion est réussie
        if (response.status === 200) {
          alert('Connexion réussie !');
          // Sauvegarder le token dans le localStorage (ou sessionStorage si nécessaire)
          localStorage.setItem('token', response.data.token);
          console.log("token ok");
          window.location.href = '/home'; // Redirige vers la page d'accueil après la connexion
        }
      } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        console.log("test erreur");
        alert('Une erreur est survenue lors de la connexion. Vérifiez vos identifiants.');
      } finally {
        setIsLoading(false); // Arrêter le chargement
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
                <li><a href="/aboutus">En savoir plus sur les créateurs de CyberPsy</a></li>
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
            <button type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
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
