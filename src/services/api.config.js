const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const BACKEND_URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  params: {
    api_key: API_KEY,
    language: 'en-US'
  },
  timeout: 30000
};

export const RETRY_CONFIG = {
  retries: 3,
  delay: 2000
};

const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
};

export const API_ENDPOINTS = {
  trending: `${BASE_URL}/trending/movie/week`,
  topRated: `${BASE_URL}/movie/top_rated`,
  upcoming: `${BASE_URL}/movie/upcoming`,
  nowPlaying: `${BASE_URL}/movie/now_playing`,
  search: (query) => `${BASE_URL}/search/movie`,
  movieDetails: (id) => `${BASE_URL}/movie/${id}`,
  movieImages: (id) => `${BASE_URL}/movie/${id}/images`,
  similar: (id) => `${BASE_URL}/movie/${id}/similar`,
  videos: (id) => `${BASE_URL}/movie/${id}/videos`,
  genres: `${BASE_URL}/genre/movie/list`,
  discover: `${BASE_URL}/discover/movie`,
  recommendations: (id) => `${BASE_URL}/movie/${id}/recommendations`,
  credits: (id) => `${BASE_URL}/movie/${id}/credits`,
  reviews: (id) => `${BASE_URL}/movie/${id}/reviews`,
  auth: {
    login: `${BACKEND_URL}/api/auth/login`,
    register: `${BACKEND_URL}/api/auth/register`,
    resetPassword: `${BACKEND_URL}/api/auth/reset-password`,
    forgotPassword: `${BACKEND_URL}/api/auth/forgot-password`
  },
  user: {
    profile: `${BACKEND_URL}/api/users/profile`,
    updateProfile: `${BACKEND_URL}/api/users/profile/update`,
    watchlist: `${BACKEND_URL}/api/users/watchlist`,
    favorites: `${BACKEND_URL}/api/users/favorites`
  }
};

export const getImageUrl = (path, size = POSTER_SIZES.medium) => {
  if (!path) return '/images/placeholder-poster.jpg';
  try {
    return `${IMAGE_BASE_URL}/${size}${path}`;
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '/images/placeholder-poster.jpg';
  }
};

export const getBackdropUrl = (path, size = BACKDROP_SIZES.large) => {
  if (!path) return '/images/placeholder-backdrop.jpg';
  try {
    return `${IMAGE_BASE_URL}/${size}${path}`;
  } catch (error) {
    console.error('Error generating backdrop URL:', error);
    return '/images/placeholder-backdrop.jpg';
  }
};

export const getYoutubeUrl = (key) => {
  if (!key) return null;
  try {
    return `https://www.youtube.com/watch?v=${key}`;
  } catch (error) {
    console.error('Error generating YouTube URL:', error);
    return null;
  }
};

export const getYoutubeEmbedUrl = (key) => {
  if (!key) return null;
  try {
    return `https://www.youtube.com/embed/${key}`;
  } catch (error) {
    console.error('Error generating YouTube embed URL:', error);
    return null;
  }
};

export { POSTER_SIZES, BACKDROP_SIZES };