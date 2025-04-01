const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const BACKEND_URL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
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
  trending: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`,
  topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US`,
  nowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`,
  search: (query) => `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`,
  movieDetails: (id) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,images`,
  movieImages: (id) => `${BASE_URL}/movie/${id}/images?api_key=${API_KEY}`,
  similar: (id) => `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US`,
  videos: (id) => `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
  genres: `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,
  discover: `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US`,
  recommendations: (id) => `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US`,
  credits: (id) => `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
  reviews: (id) => `${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`,
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