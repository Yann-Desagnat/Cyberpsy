import axios from 'axios';

// Crée une instance d'Axios
const api = axios.create({
  baseURL: 'http://localhost:8081/api/', // Base URL du backend
});

// Middleware pour ajouter le token d'accès dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Ajout du token si disponible
    }
    return config; // Renvoie la requête modifiée
  },
  (error) => {
    return Promise.reject(error); // Gestion des erreurs
  }
);

export default api;
