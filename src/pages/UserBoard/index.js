import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar } from "recharts";
import './UserBoard.css';
import logo from '../images/logo.png';
import lockImage from '../images/lock-image.png'; 
import api from '../../axios';// Utilisation d'axios
console.log('home monté'); //test

const UserBoard = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState(''); // Nom de l'utilisateur
  const [listItems, setListItems] = useState([]); // State to hold the list items
  const [derniereActivite, setDerniereActivite] = useState('');
  const [email, setEmail] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('');

  // Vérifie l'état de l'utilisateur (authentification) au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage.");
        handleLogout();
        return;
      }
  
      try {
        const userResponse = await api.get('/auth/getuser', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(userResponse.data)
        if (userResponse.status === 200) {
          setIsUserLoggedIn(true);
          setUserName(`${userResponse.data.prenom} ${userResponse.data.nom}` || 'Utilisateur');
          setDerniereActivite(userResponse.data.derniereActivite)
          setEmail(userResponse.data.email)
          setIdUtilisateur(userResponse.data.idUtilisateur)
          setNom(userResponse.data.nom)
          setPrenom(userResponse.data.prenom)
          setRole(userResponse.data.role)
          // Fetch user history from API
          const historyResponse = await api.get(`/qcm/historique/${userResponse.data.idUtilisateur}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (historyResponse.status === 200) {
            setListItems(historyResponse.data); // Store the fetched history in state
          } else {
            console.warn("No history data found.");
            setListItems([]);
          }
        }}
      catch (error) {
        console.error("Error fetching user or history:", error);
       
      }
    };
  
    fetchData();
  }, []);
  
  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token de l'utilisateur
    setIsUserLoggedIn(false);
    setUserName('Invité');
    localStorage.removeItem("userId");
    window.location.href = '/login'; // Rediriger vers la page de login
  };

  const [progress, setProgress] = useState(65); // Example progress value
  
        
        
        
        
        
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
      <div className="dashboard-container">
        <div className="card">
          <RadialBarChart
            width={150}
            height={150}
            cx={75}
            cy={75}
            innerRadius="80%"
            outerRadius="100%"
            barSize={15}
            data={[{ name: "Progress", value: progress, fill: "#007bff" }]}
            startAngle={90}
            endAngle={90 - (progress / 100) * 360} // Full circle
          >
            <RadialBar minAngle={15} background dataKey="value" />
          </RadialBarChart>
          <p>{progress}% Completed</p>

        </div>
        <div className="card">
        <div className="scrollable-list">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Valeur</th>
        </tr>
      </thead>
      <tbody>
        {listItems.length > 0 ? (
          listItems.map((item, index) => (
            <tr key={index}>
              <td>1</td>
              <td>18/03/2025</td>
              <td>{item.correct === "true" ? "✔️" : "❌"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ textAlign: "center" }}>Aucune donnée disponible</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
      </div>
        <div className="card scrollable-list">
        <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Auteur</th>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        {listItems.length > 0 ? (
          listItems.map((item, index) => (
            <tr key={index}>
              <td>Livre</td>
              <td>David Kennedy</td>
              <td>Metasploit</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" style={{ textAlign: "center" }}>Aucune donnée disponible</td>
          </tr>
        )}
      </tbody>
    </table>
        </div>
      </div>

      <div className='infos'>
        <p>Dernière activité :{derniereActivite} </p>
        <p>Email :{email} </p>
        <p>Id utilisateur : {idUtilisateur}</p>
        <p>Nom : {nom}</p>
        <p>Prenom : {prenom}</p>
        <p>Rôle : {role}</p>
      </div>
    </>
  );
};
export default UserBoard;
