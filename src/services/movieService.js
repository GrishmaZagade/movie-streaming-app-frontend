import axios from 'axios';
import { API_ENDPOINTS, getImageUrl, getBackdropUrl, API_CONFIG, RETRY_CONFIG } from './api.config';

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
    console.error('Server response:', error.response.data);
    return [];
  }
  if (error.request) {
    console.error('No response received:', error.request);
    return [];
  }
  console.error('Error:', error.message);
  return [];
};

const retryRequest = async (requestFn, retries = RETRY_CONFIG.retries) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delay));
      return retryRequest(requestFn, retries - 1);
    }
    throw error;
  }
};

const axiosConfig = {
  ...API_CONFIG,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  }
};

const createParams = (additionalParams = {}) => ({
  ...API_CONFIG.params,
  ...additionalParams
});

export const movieService = {
  async getTrending() {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.trending, {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching trending movies:');
    }
  },

  async getTopRated() {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.topRated, {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching top rated movies:');
    }
  },

  async getUpcoming() {
    try {
      const [page1, page2, page3] = await Promise.all([
        retryRequest(() => axios.get(API_ENDPOINTS.upcoming, {
          ...axiosConfig,
          params: createParams({ page: 1 })
        })),
        retryRequest(() => axios.get(API_ENDPOINTS.upcoming, {
          ...axiosConfig,
          params: createParams({ page: 2 })
        })),
        retryRequest(() => axios.get(API_ENDPOINTS.upcoming, {
          ...axiosConfig,
          params: createParams({ page: 3 })
        }))
      ]);

      return [
        ...(page1.data.results || []),
        ...(page2.data.results || []),
        ...(page3.data.results || [])
      ];
    } catch (error) {
      return handleError(error, 'Error fetching upcoming movies:');
    }
  },

  async getNowPlaying() {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.nowPlaying, {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching now playing movies:');
    }
  },

  async searchMovies(query) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.search(query), {
          ...axiosConfig,
          params: createParams({ query })
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error searching movies:');
    }
  },

  async getMovieDetails(id) {
    try {
      const [details, credits, reviews] = await Promise.all([
        retryRequest(() => axios.get(API_ENDPOINTS.movieDetails(id), {
          ...axiosConfig,
          params: createParams({ append_to_response: 'videos,images' })
        })),
        retryRequest(() => axios.get(API_ENDPOINTS.credits(id), {
          ...axiosConfig,
          params: createParams()
        })),
        retryRequest(() => axios.get(API_ENDPOINTS.reviews(id), {
          ...axiosConfig,
          params: createParams()
        }))
      ]);

      return {
        ...(details.data || {}),
        credits: credits.data || {},
        reviews: reviews.data || {}
      };
    } catch (error) {
      return handleError(error, 'Error fetching movie details:');
    }
  },

  async getMovieVideos(id) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.videos(id), {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching movie videos:');
    }
  },

  async getSimilarMovies(id) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.similar(id), {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching similar movies:');
    }
  },

  async getMovieImages(id) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.movieImages(id), {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data || {};
    } catch (error) {
      return handleError(error, 'Error fetching movie images:');
    }
  },

  async getGenres() {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.genres, {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.genres || [];
    } catch (error) {
      return handleError(error, 'Error fetching genres:');
    }
  },

  async discoverMovies({ with_genres = '', sort_by = 'popularity.desc', year = '', page = 1 }) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.discover, {
          ...axiosConfig,
          params: createParams({
            with_genres,
            sort_by,
            year,
            include_adult: false,
            include_video: false,
            page
          })
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error discovering movies:');
    }
  },

  async getRecommendations(id) {
    try {
      const response = await retryRequest(() => 
        axios.get(API_ENDPOINTS.recommendations(id), {
          ...axiosConfig,
          params: createParams()
        })
      );
      return response.data.results || [];
    } catch (error) {
      return handleError(error, 'Error fetching movie recommendations:');
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