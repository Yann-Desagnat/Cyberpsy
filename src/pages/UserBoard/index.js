import React, { useState, useEffect } from 'react';
import './UserBoard.css';
import logo from '../images/logo.png';
import { Line, Bar } from 'react-chartjs-2'; // Import des graphiques
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
console.log('tableau de bord monté'); //test
// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const UserBoard = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [userName, setUserName] = useState('Utilisateur'); // Nom de l'utilisateur
  const [qcmData, setQcmData] = useState([]); // Données fictives pour les QCM
  const [simulationData, setSimulationData] = useState([]); // Données fictives pour les simulations
  const [userLevel, setUserLevel] = useState(50); // Niveau utilisateur (jauge)

  // Génération des données fictives
  useEffect(() => {
    const generateFakeData = () => {
      // Dates fictives
      const dates = ['2023-12-01', '2023-12-02', '2023-12-03', '2023-12-04', '2023-12-05'];

      // Données fictives pour les QCM et simulations
      const qcmValues = [2, 4, 1, 5, 3];
      const simulationValues = [1, 3, 2, 4, 2];

      // Mise à jour des états
      setQcmData({ dates, values: qcmValues });
      setSimulationData({ dates, values: simulationValues });

      // Calcul du niveau utilisateur basé sur les données
      const totalActivities = qcmValues.reduce((acc, val) => acc + val, 0) + simulationValues.reduce((acc, val) => acc + val, 0);
      setUserLevel(Math.min(totalActivities * 10, 100)); // Maximum à 100
    };

    generateFakeData();
  }, []);

  // Configuration des graphiques
  const qcmChartConfig = {
    labels: qcmData.dates,
    datasets: [
      {
        label: 'Nombre de QCM faits',
        data: qcmData.values,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const simulationChartConfig = {
    labels: simulationData.dates,
    datasets: [
      {
        label: 'Nombre de simulations faites',
        data: simulationData.values,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
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
                <li><a href="/aboutus">En savoir plus sur les créateurs de CyberPsy</a></li>
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

      {/* Contenu principal */}
      <div className="titre">
        <h1>Tableau de bord de {userName}</h1>
        <div className="user-board-container">
        {/* Graphique QCM */}
        <div className="chart-section">
          <h3>Nombre de QCM faits</h3>
          <Line data={qcmChartConfig} />
        </div>

        {/* Graphique simulations */}
        <div className="chart-section">
          <h3>Nombre de simulations faites</h3>
          <Bar data={simulationChartConfig} />
        </div>
        {/* Jauge de niveau utilisateur */}
        <div className="user-level">
          <h3>Niveau utilisateur</h3>
          <div className="level-bar">
            <div
              className="level-indicator"
              style={{ width: `${userLevel}%`, backgroundColor: userLevel > 75 ? 'green' : userLevel > 50 ? 'orange' : 'red' }}
            >
              {userLevel}%
            </div>
            </div>
          </div>
        </div>

        <div className="personalized-resources">
  <h2>Ressources personnalisées</h2>
  <ul>
    <li><a href="https://example.com/resource1" target="_blank" rel="noopener noreferrer">Guide sur les attaques par phishing</a></li>
    <li><a href="https://example.com/resource2" target="_blank" rel="noopener noreferrer">Tutoriel de sécurité des mots de passe</a></li>
    <li><a href="https://example.com/resource3" target="_blank" rel="noopener noreferrer">Vidéos explicatives sur la cybersécurité</a></li>
    <li><a href="https://example.com/resource4" target="_blank" rel="noopener noreferrer">Quiz avancés sur la cybersécurité</a></li>
  </ul>
</div>




      </div>
    </>
  );
};

export default UserBoard;
