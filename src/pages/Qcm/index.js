import React, { useState, useEffect } from "react";
import "./Qcm.css"; // Assurez-vous d'avoir la feuille de style correcte
import logo from "../images/logo.png"; // Vérifie le chemin du logo
import api from "../../axios";
import { useNavigate, useLocation } from "react-router-dom";

const Qcm = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedLevel = params.get("level") || "debutant";
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Options disponibles pour chaque question
  const options = ["Vrai", "Faux"];

  // Convertir le niveau en chiffre
  const getLevelNumber = (level) => {
    switch (level) {
      case "debutant":
        return 1;
      case "intermediaire":
        return 2;
      case "avance":
        return 3;
      default:
        return 1;
    }
  };


   // Récupérer l'ID utilisateur depuis le localStorage (pas besoin de décoder le token)
   const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    return userId ? userId : null;
  };

  // 🔹 Récupérer les questions depuis le backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ Aucun token JWT trouvé !");
          navigate("/login"); // Rediriger vers la connexion si pas de token
          return;
        }

        const response = await api.get(`/qcm/niveau/${getLevelNumber(selectedLevel)}`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Envoi du Token JWT
        });

        console.log("📌 Questions reçues :", response.data); // Debugging

        setQuestions(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des questions:", error);
        if (error.response && error.response.status === 401) {
          console.warn("⚠️ Token invalide ou expiré !");
          handleLogout();
        }
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedLevel]);

  // 🔹 Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const response = await api.get("/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsUserLoggedIn(true);
          setUserName(`${response.data.prenom} ${response.data.nom}` || "Utilisateur");
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
        handleLogout();
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsUserLoggedIn(false);
    setUserName("Invité");
    navigate("/login");
  };
  const handleAnswer = async (option) => {
    try {
      // Récupérer l'ID de l'utilisateur depuis le localStorage
      const userId = localStorage.getItem('userId'); // Utiliser directement le userId si stocké dans localStorage
      
      // Vérifier si l'utilisateur est authentifié
      if (!userId) {
        console.error("User ID is not found in localStorage.");
        alert("Utilisateur non authentifié.");
        return;
      }
  
      const currentQuestion = questions[currentQuestionIndex];
  
      // Afficher l'ID utilisateur et la question pour débogage
      console.log("User ID:", userId);
      console.log("Question ID:", currentQuestion.idQcm);
      console.log("Selected Answer:", option);
  
      // Envoyer la réponse au backend via l'API POST
      const response = await api.post("/qcm/submit", {
        idQcm: currentQuestion.idQcm,
        idUser: userId,
        reponse: option
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // Ajouter le token dans les en-têtes
        }
      });
  
      // Afficher la réponse du backend pour débogage
      console.log("Response from API:", response.data);
  
      // Mettre à jour les résultats
      setResults(prev => [...prev, {
        question: currentQuestion.question,
        userAnswer: option,
        ...response.data
      }]);
  
      // Vérifier si la réponse est correcte
      if (response.data.isCorrect) {
        setScore(prev => prev + 1);
      }
  
      // Passer à la question suivante ou soumettre le quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsSubmitted(true);
      }
  
    } catch (error) {
      // En cas d'erreur, afficher l'erreur dans la console et alerter l'utilisateur
      console.error("Erreur de soumission:", error);
      alert(error.response?.data?.message || "Erreur de soumission");
    }
  };
  

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setIsSubmitted(false);
    setScore(0);
  };
  const displayDetailedResults = () => {
    return results.map((result, index) => (
      <div key={index} className="result-item">
        <h3>Question {index + 1}: {result.question}</h3>
        <p>
          Votre réponse : <strong>{result.userAnswer}</strong>{" "}
          {result.isCorrect ? (
            <span style={{ color: "green" }}>(Correct)</span>
          ) : (
            <span style={{ color: "red" }}>(Incorrect)</span>
          )}
        </p>
        {!result.isCorrect && (
          <p>Bonne réponse : <strong>{result.correctAnswer}</strong></p>
        )}
        {result.source && (
          <p><em>Source : {result.source}</em></p>
        )}
      </div>
    ));
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="site-title">CyberPsy</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Accueil</a></li>
          <li><a href="/profil">Profil</a></li>
          <li><a href="/analyse">Analyse</a></li>
          <li><a href="/simulation">Simulation</a></li>
          <li><a href="/about">À propos de nous</a></li>
          {isUserLoggedIn ? (
            <li>
              <a href="/" onClick={handleLogout}>Déconnexion ({userName})</a>
            </li>
          ) : (
            <>
              <li><a href="/login">Connexion</a></li>
              <li><a href="/register">Inscription</a></li>
            </>
          )}
        </ul>
      </nav>

      <div className="qcm-container">
        {!isSubmitted ? (
          <div className="question-section">
            <h2 className="question-title">Questionnaire sur {selectedLevel}</h2>
            {isLoading ? (
              <p>Chargement des questions...</p>
            ) : questions.length > 0 ? (
              <>
                <h2 className="question-title">{questions[currentQuestionIndex].question}</h2>
                <ul className="options-list">
                  {options.map((option, index) => (
                    <li key={index}>
                      <button className="option-button" onClick={() => handleAnswer(option)}>
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Aucune question disponible pour ce niveau</p>
            )}
          </div>
        ) : (
          <div className="result-section">
            <h2>Résultats du questionnaire</h2>
            <h2>Votre score: {score} / {questions.length}</h2>
            <div className="detailed-results">
              {displayDetailedResults()}
            </div>
            <button className="restart-button" onClick={handleRestart}>Recommencer</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Qcm;