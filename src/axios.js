import axios from 'axios';

// Crée une instance d'Axios
const api = axios.create({
  baseURL: 'https://ton-backend.azurewebsites.net/api/', // Remplace par ton URL de l'API backend
});

// Middleware pour ajouter le token d'accès dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage
    if (token) {
      // Si un token existe, ajoute-le dans l'en-tête Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Renvoie la requête modifiée
  },
  (error) => {
    return Promise.reject(error); // Gestion des erreurs de requêtes
  }
);

export default api;
