export const API_CONFIG = {
  BASE_URL: 'https://cja-api.onrender.com',
  ENDPOINTS: {
    USERS: '/api/users',
    CATEGORIES: '/api/categories',
    JOKES: '/api/jokes',
  },
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getUserUrl = (userId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}`;
};

export const getCategoryUrl = (categoryId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}/${categoryId}`;
};

export const getJokeUrl = (jokeId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOKES}/${jokeId}`;
};

export const getJokeFavoriteUrl = (jokeId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOKES}/${jokeId}/favorite`;
};

export const getUserFavoriteUrl = (userId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}/favorite`;
};

export const getUserUnreadJokesUrl = (userId: string, categoryId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOKES}/unread-random?userId=${userId}&categoryID=${categoryId}`;
};

export const getUserReadUrl = (userId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}/readID`;
};

export const getUserReadJokesUrl = (userId: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOKES}/read-jokes?userId=${userId}`;
};

