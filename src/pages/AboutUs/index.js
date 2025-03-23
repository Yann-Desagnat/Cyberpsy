import React, { useState, useEffect } from 'react';
import './AboutUs.css';
import logo from '../images/logo.png';
import Avatar1 from '../images/avatar1.png'; 
import Avatar2 from '../images/avatar2.png'; 
import Avatar3 from '../images/avatar3.png'; 

const AboutUs = () => {
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isProfilOpen, setIsProfilOpen] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [userName, setUserName] = useState(''); 

    const testimonials = [
        { id: 1, text: "CyberPsy m'a permis de mieux comprendre comment pensent les cyberattaquants et comment se défendre.", name: "Alex L." },
        { id: 2, text: "Grâce à CyberPsy, j’ai découvert les stratégies utilisées par les hackers et les experts en cybersécurité.", name: "Sophie M." },
        { id: 3, text: "Cette plateforme m’a aidé à anticiper les techniques de manipulation utilisées par les cybercriminels.", name: "Lucas R." }
    ];

    // Changer de témoignage toutes les 4 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    
      const checkUserStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn("No token found in localStorage.");
          handleLogout();
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
          console.error("Error verifying user:", error);
          handleLogout();
        }
      };
    
      checkUserStatus();
    }, []);
  
    // voir quand yann aura fini back Fonction de déconnexion (peut être adaptée selon la logique de votre application)
    const handleLogout = () => {
        setIsUserLoggedIn(false);
        localStorage.removeItem("userId");
        localStorage.removeItem('token');
        setUserName('Invité');
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
               {/* Menu déroulant "Utilisateur" */}
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
                  <li><a href="/" onClick={handleLogout}>Se déconnecter</a></li> {/* Bouton de déconnexion */}
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

            {/* Section About */}
            <div className="about-us">
                <h1>Qui sommes-nous ?</h1>
                <p className="intro-quote">"Notre mission : sensibiliser à la cybersécurité et protéger les utilisateurs du monde numérique."</p>
                <div className="team-members">
                    {[{
                        name: "Fatima Imam", role: "Designer UI/UX", img: Avatar2,
                        desc: "Fatima est une designer talentueuse, experte en interfaces modernes et intuitives."
                    }, {
                        name: "Yann Desagnat", role: "Développeur Backend", img: Avatar1,
                        desc: "Yann est un développeur passionné, spécialisé en backend. Il adore résoudre des problèmes complexes."
                    }, {
                        name: "Johana Lumoni", role: "Développeur front-end", img: Avatar3,
                        desc: "Johana est une cheffe de projet IT, experte en gestion d’équipes et de délais qui maitrise egalement le front end."
                    }].map((member, index) => (
                        <div key={index} className="team-member">
                            <img src={member.img} alt={member.name} className="avatar" />
                            <h3>{member.name}</h3>
                            <p>{member.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Section Témoignages */}
                <div className="testimonials">
                    <h2>Avis de nos utilisateurs</h2>
                    <div key={testimonials[currentTestimonial].id} className="testimonial-box fade-in">
                        <p>"{testimonials[currentTestimonial].text}"</p>
                        <span>- {testimonials[currentTestimonial].name}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;