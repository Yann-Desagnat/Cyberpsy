import React, { useState, useEffect } from 'react';
import './ParametreCompte.css';
import logo from '../images/logo.png';
import api from '../../axios'; // Utilisation d'axios pour les requêtes API

const ParametreCompte = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState('Utilisateur'); // Nom de l'utilisateur
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');

  // Charger les informations de l'utilisateur au montage du composant
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await api.get('/secure/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setIsUserLoggedIn(true);
          setUserName(`${response.data.firstName} ${response.data.lastName}`);
          setUserInfo({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
          });
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'utilisateur:', error);
        handleLogout();
      }
    };

    checkUserStatus();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsUserLoggedIn(false);
    setUserName('Invité');
    window.location.href = '/login';
  };

  // Gestion de la mise à jour des informations personnelles
  const handleUpdateInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await api.put('/secure/updateUser', userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMessage('Informations mises à jour avec succès.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      setMessage('Erreur lors de la mise à jour.');
    }
  };

  // Gestion du changement de mot de passe
  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Veuillez vous reconnecter.');
      return;
    }

    try {
      const response = await api.put('/secure/changePassword', passwords, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMessage('Mot de passe mis à jour avec succès.');
        setPasswords({ currentPassword: '', newPassword: '' });
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setMessage('Erreur lors du changement de mot de passe.');
    }
  };

  // Gestion de la suppression de compte
  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Veuillez vous reconnecter.');
      return;
    }

    try {
      await api.delete('/secure/deleteUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      setMessage('Erreur lors de la suppression du compte.');
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
                <li><a href="/aboutus">En savoir plus</a></li>
                <li><a href="/jeu">Notre jeu Android</a></li>
              </ul>
            )}
          </li>

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
                  <li><a href="/parametreCompte">Paramètres</a></li>
                  <li><a href="/" onClick={handleLogout}>Se déconnecter</a></li>
                </ul>
              )}
            </li>
          )}

          {!isUserLoggedIn && (
            <div className="nav-right">
              <li><a href="/login">Se connecter</a></li>
              <li><a href="/register" className="btn-open-account">Créer un compte</a></li>
            </div>
          )}
        </ul>
      </nav>

      <div className="parametre-compte-container">
        <h1>Paramètres de votre compte</h1>

        <div className="user-info">
          <h2>Informations personnelles</h2>
          <label>
            Prénom :
            <input
              type="text"
              value={userInfo.firstName}
              onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            />
          </label>
          <label>
            Nom :
            <input
              type="text"
              value={userInfo.lastName}
              onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            />
          </label>
          <label>
            Email :
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
          </label>
          <button onClick={handleUpdateInfo}>Mettre à jour</button>
        </div>

        <div className="change-password">
          <h2>Changer le mot de passe</h2>
          <label>
            Mot de passe actuel :
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
          </label>
          <label>
            Nouveau mot de passe :
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </label>
          <button onClick={handleChangePassword}>Mettre à jour le mot de passe</button>
        </div>

        <div className="delete-account">
          <h2>Supprimer le compte</h2>
          <button onClick={handleDeleteAccount} className="btn-danger">
            Supprimer mon compte
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default ParametreCompte;
