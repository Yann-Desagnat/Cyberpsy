import React, { useState } from 'react';
import './Analyse.css';
import logo from '../images/logo.png';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import lockImage from '../images/lock-image.png'; 

const Analyse = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('debutant'); // Niveau sélectionné
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("Aucun token trouvé.");
        setIsUserLoggedIn(false);
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
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        handleLogout();
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsUserLoggedIn(false);
    localStorage.removeItem("userId");
    setUserName('Invité');
    navigate('/login');
  };

  const handleStartQcm = () => {
    navigate(`/qcm?level=${selectedLevel}`);
    
  };

  return (
    <>
      {/* Barre de navigation */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="site-title">CyberPsy</span>
        </div>
        <ul className="nav-links">
          <li><a href="/home">Accueil</a></li>
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
                <li><a href="/aboutus">En savoir plus sur les créateurs de CyberPsy</a></li>
                <li><a href="/jeu">Découvrir notre jeu Android</a></li>
              </ul>
            )}
          </li>

          {isUserLoggedIn ? (
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
          ) : (
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
        Testez vos connaissances sur les techniques de manipulation utilisées par les cybercriminels grâce à ce questionnaire interactif.
        Répondez aux questions et découvrez votre niveau de sensibilisation aux cybermenaces psychologiques !
        </p>
        <div className="level-selection">
          <label htmlFor="level">Choisissez votre niveau :</label>
          <select
            id="level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
          </select>
        </div>
        <button className="analyse-button" onClick={handleStartQcm}>Commencer</button>
      </div>
    </>
  );
};

export default Analyse;
