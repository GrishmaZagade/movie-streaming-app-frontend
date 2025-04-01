import axios from 'axios';
import { API_ENDPOINTS, getImageUrl, getBackdropUrl } from './api.config';

const genres = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

const handleError = (error, customMessage) => {
  console.error(customMessage, error);
  if (error.response) {
    throw new Error(`Failed to fetch data: ${error.response.data.message || error.message}`);
  }
  throw new Error('Network error. Please check your connection and try again.');
};

export const movieService = {
  async getTrending() {
    try {
      const response = await axios.get(API_ENDPOINTS.trending);
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching trending movies:');
    }
  },

  async getTopRated() {
    try {
      const response = await axios.get(API_ENDPOINTS.topRated);
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching top rated movies:');
    }
  },

  async getUpcoming() {
    try {
      const [page1, page2, page3] = await Promise.all([
        axios.get(`${API_ENDPOINTS.upcoming}&page=1`),
        axios.get(`${API_ENDPOINTS.upcoming}&page=2`),
        axios.get(`${API_ENDPOINTS.upcoming}&page=3`)
      ]);

      return [
        ...page1.data.results,
        ...page2.data.results,
        ...page3.data.results
      ];
    } catch (error) {
      handleError(error, 'Error fetching upcoming movies:');
    }
  },

  async getNowPlaying() {
    try {
      const response = await axios.get(API_ENDPOINTS.nowPlaying);
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching now playing movies:');
    }
  },

  async searchMovies(query) {
    try {
      const response = await axios.get(API_ENDPOINTS.search(query));
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error searching movies:');
    }
  },

  async getMovieDetails(id) {
    try {
      const [details, credits, reviews] = await Promise.all([
        axios.get(API_ENDPOINTS.movieDetails(id)),
        axios.get(API_ENDPOINTS.credits(id)),
        axios.get(API_ENDPOINTS.reviews(id))
      ]);

      return {
        ...details.data,
        credits: credits.data,
        reviews: reviews.data
      };
    } catch (error) {
      handleError(error, 'Error fetching movie details:');
    }
  },

  async getMovieVideos(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.videos(id));
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching movie videos:');
    }
  },

  async getSimilarMovies(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.similar(id));
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching similar movies:');
    }
  },

  async getMovieImages(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.movieImages(id));
      return response.data;
    } catch (error) {
      handleError(error, 'Error fetching movie images:');
    }
  },

  async getGenres() {
    try {
      const response = await axios.get(API_ENDPOINTS.genres);
      return response.data.genres;
    } catch (error) {
      handleError(error, 'Error fetching genres:');
    }
  },

  async discoverMovies({ with_genres = '', sort_by = 'popularity.desc', year = '', page = 1 }) {
    try {
      const response = await axios.get(API_ENDPOINTS.discover, {
        params: {
          with_genres,
          sort_by,
          year,
          include_adult: false,
          include_video: false,
          language: 'en-US',
          page
        }
      });
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error discovering movies:');
    }
  },

  async getRecommendations(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.recommendations(id));
      return response.data.results;
    } catch (error) {
      handleError(error, 'Error fetching movie recommendations:');
    }
  },

  getGenreName(genreId) {
    return genres[genreId] || 'Unknown';
  },

  formatRuntime(minutes) {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  },

  getImageUrl,
  getBackdropUrl
};