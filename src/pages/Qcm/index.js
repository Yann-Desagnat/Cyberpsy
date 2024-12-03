import React, { useState, useEffect } from "react";
import "./Qcm.css";
import logo from "../images/logo.png";
import api from '../../axios';// Utilisation d'axios
import { useNavigate } from "react-router-dom";
console.log('QCM monté'); //test
const questions = [
  {
    id: 1,
    question: "Quel a été l’impact principal de l’attaque ?",
    options: [
      { text: "Perturbation des services (ex : DDoS, défiguration de site)", type: "Hacktiviste" },
      { text: "Vol de données sensibles (ex : informations client, données financières)", type: "Cybercriminel Professionnel" },
      { text: "Collecte discrète d’informations (ex : espionnage, accès non détecté)", type: "Espion d’État" },
      { text: "Sabotage interne ou divulgation de secrets d’entreprise", type: "Insider Malveillant" },
      { text: "Intrusion peu sophistiquée, sans réel impact", type: "Script Kiddie" },
    ],
  },
  {
    id: 2,
    question: "Quel était le type de cible principale ?",
    options: [
      { text: "Infrastructure critique (ex : réseaux d’énergie, gouvernementaux)", type: "Espion d’État" },
      { text: "Données financières ou personnelles des clients", type: "Cybercriminel Professionnel" },
      { text: "Page publique ou réseau de l’entreprise", type: "Hacktiviste" },
      { text: "Système interne avec accès privilégiés", type: "Insider Malveillant" },
      { text: "Tout système accessible, sans cible particulière", type: "Script Kiddie" },
    ],
  },
  // Ajoutez plus de questions si nécessaire
];

const Qcm = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState({});
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Menu déroulant "À propos"
  const [isProfilOpen, setIsProfilOpen] = useState(false); // Menu déroulant "Utilisateur"
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Vérifie si l'utilisateur est connecté
  const [userName, setUserName] = useState(''); // Nom de l'utilisateur
  const navigate = useNavigate(); 
  
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/secure/user', {
            headers: {
              Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
            },
          }); // endpoint sécurisé

          if (response.status === 200) {
            setIsUserLoggedIn(true);
            setUserName(response.data.name || 'Utilisateur'); // Le backend retourne le nom de l'utilisateur
          } else {
            handleLogout(); // Si la réponse n'est pas valide, on se déconnecte
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'utilisateur:', error);
          handleLogout(); // En cas d'erreur, on déconnecte l'utilisateur
        }
      }
    };

    checkUserStatus();
  }, []);

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Supprimer le token de l'utilisateur
    setIsUserLoggedIn(false);
    setUserName('Invité');
    window.location.href = '/login'; // Rediriger vers la page de login
  };
  
  
  
  
  
  
  
  
  
  const handleAnswer = (type) => {
    setAnswers([...answers, type]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults([...answers, type]);
      setIsSubmitted(true);
    }
  };

  const calculateResults = (finalAnswers) => {
    const resultCount = {};

    finalAnswers.forEach((answer) => {
      if (resultCount[answer]) {
        resultCount[answer]++;
      } else {
        resultCount[answer] = 1;
      }
    });

    const totalAnswers = finalAnswers.length;
    const percentages = {};

    Object.keys(resultCount).forEach((key) => {
      percentages[key] = ((resultCount[key] / totalAnswers) * 100).toFixed(2);
    });

    setResults(percentages);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsSubmitted(false);
    setResults({});
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
      <div className="qcm-container">
        {!isSubmitted ? (
          <div className="question-section">
            <h2 className="question-title">Questionnaire</h2>
            <p className="question-text">
              {questions[currentQuestionIndex].question}
            </p>
            <ul className="options-list">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <li key={index}>
                  <button
                    className="option-button"
                    onClick={() => handleAnswer(option.type)}
                  >
                    {option.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="result-section">
  <h2>Résultat(s) du questionnaire</h2>
  <div className="result-bars">
    {Object.entries(results).map(([type, percentage], index) => (
      <div key={index} className="result-bar">
        <span className="type-label">{type}:</span>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              backgroundColor:
                percentage > 75
                  ? "#28a745" // Vert pour les hauts pourcentages
                  : percentage > 50
                  ? "#ffc107" // Jaune pour les moyens pourcentages
                  : "#dc3545", // Rouge pour les bas pourcentages
            }}
          ></div>
        </div>
        <span className="percentage-label">{percentage}%</span>
      </div>
    ))}
  </div>
  {/* Ajoutez ce bouton pour réinitialiser */}
  <button className="restart-button" onClick={handleRestart}>
    Recommencer le questionnaire
  </button>
  <button
              className="profile-button"
              onClick={() => navigate("/profil")} // Redirection vers la page profil
            >
              En savoir plus sur les profils 
            </button>
</div>
        )}
      </div>
    </>
  );
};

export default Qcm;
