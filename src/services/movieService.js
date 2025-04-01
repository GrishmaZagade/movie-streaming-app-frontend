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

export const movieService = {
  async getTrending() {
    try {
      const response = await axios.get(API_ENDPOINTS.trending);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  },

  async getTopRated() {
    try {
      const response = await axios.get(API_ENDPOINTS.topRated);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  async getUpcoming() {
    try {
      // Fetch multiple pages of upcoming movies
      const [page1, page2, page3] = await Promise.all([
        axios.get(`${API_ENDPOINTS.upcoming}&page=1`),
        axios.get(`${API_ENDPOINTS.upcoming}&page=2`),
        axios.get(`${API_ENDPOINTS.upcoming}&page=3`)
      ]);

      // Combine results from all pages
      const allMovies = [
        ...page1.data.results,
        ...page2.data.results,
        ...page3.data.results
      ];

      return allMovies;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  },

  async getNowPlaying() {
    try {
      const response = await axios.get(API_ENDPOINTS.nowPlaying);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  async searchMovies(query) {
    try {
      const response = await axios.get(API_ENDPOINTS.search(query));
      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
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
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  async getMovieVideos(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.videos(id));
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  },

  async getSimilarMovies(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.similar(id));
      return response.data.results;
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      return [];
    }
  },

  async getMovieImages(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.movieImages(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching movie images:', error);
      return null;
    }
  },

  async getGenres() {
    try {
      const response = await axios.get(API_ENDPOINTS.genres);
      return response.data.genres;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
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
      console.error('Error discovering movies:', error);
      return [];
    }
  },

  async getRecommendations(id) {
    try {
      const response = await axios.get(API_ENDPOINTS.recommendations(id));
      return response.data.results;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      return [];
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