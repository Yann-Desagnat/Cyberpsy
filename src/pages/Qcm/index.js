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
  const [userId, setUserId] = useState(3); // Utilisateur fictif par défaut
  const [userName, setUserName] = useState("Invité");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfilOpen, setIsProfilOpen] = useState(false);
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

  const levelNumber = getLevelNumber(selectedLevel);
  console.log("🔢 Niveau envoyé au backend :", levelNumber);

  // Fonction pour récupérer l'ID utilisateur depuis le localStorage
  const getUserIdFromLocalStorage = () => {
    return localStorage.getItem("userId") || "3"; // Si pas connecté, user fictif ID = 3
  };

  // 🔹 Récupérer les questions depuis le backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/qcm/niveau/${levelNumber}`);
        console.log("📌 Toutes les questions reçues :", response.data);

        const formattedQuestions = response.data.map((q) => ({
          id: q.idQcm,
          question: q.question,
          options: ["Vrai", "Faux"],
          correctAnswer: q.correctAnswer,
          source: q.source,
        }));

        setQuestions(formattedQuestions);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedLevel]);

  // 🔹 Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (!token || !storedUserId) {
        console.warn("⚠️ Aucun token trouvé, utilisation de l'utilisateur fictif (ID = 3)");
        setUserId(3);
        return;
      }

      try {
        const response = await api.get("/auth/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setIsUserLoggedIn(true);
          setUserId(response.data.id);
          setUserName(`${response.data.prenom} ${response.data.nom}` || "Utilisateur");
        }
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'utilisateur:", error);
        setUserId(3);
      }
    };

    checkUserStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsUserLoggedIn(false);
    setUserName("Invité");
    setUserId(3);
    navigate("/login");
  };

  const handleAnswer = async (option) => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const userIdToUse = getUserIdFromLocalStorage();

      console.log("✅ User ID:", userIdToUse);
      console.log("✅ Question ID:", currentQuestion.id);
      console.log("✅ Réponse choisie:", option);

      const response = await api.post("/qcm/submit", {
        idQcm: currentQuestion.id,
        idUser: userIdToUse,
        reponse: option,
      });

      console.log("✅ Réponse API :", response.data);

      setResults((prev) => [
        ...prev,
        {
          question: currentQuestion.question,
          userAnswer: option,
          isCorrect: response.data.isCorrect,
          correctAnswer: response.data.correctAnswer,
          source: currentQuestion.source,
        },
      ]);

      if (response.data.isCorrect) {
        setScore((prev) => prev + 1);
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        console.log("✅ QCM terminé !");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("❌ Erreur de soumission :", error);
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
          <img src={logo} alt="CyberPsy Logo" className="logo-image" />
          <span className="site-title">CyberPsy</span>
        </div>
        <ul className="nav-links">
          <li><a href="/">Accueil</a></li>
          <li><a href="/profil">Profil</a></li>
          <li><a href="/analyse">Analyse</a></li>
          <li><a href="/simulation">Simulation</a></li>
          {isUserLoggedIn ? (
            <li className="dropdown"
              onMouseEnter={() => setIsProfilOpen(true)}
              onMouseLeave={() => setIsProfilOpen(false)}>
              <a href="/" onClick={(e) => e.preventDefault()}>{userName}</a>
              {isProfilOpen && (
                <ul className="dropdown-menu">
                  <li><a href="/userBoard">Mon tableau de bord</a></li>
                  <li><a href="/parametreCompte">Paramètres</a></li>
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
      <div className="qcm-container">
        {!isSubmitted ? (
          <div className="question-section">
            <h2 className="question-title">Questionnaire {selectedLevel}</h2>
            {isLoading ? (
              <p>Chargement des questions...</p>
            ) : questions.length > 0 ? (
              <>
                <h2 className="question-title">{questions[currentQuestionIndex]?.question}</h2>
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
