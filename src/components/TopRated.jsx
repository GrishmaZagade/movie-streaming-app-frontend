import React, { useState, useEffect } from 'react';
import { FaStar, FaUsers, FaTrophy, FaChevronDown, FaFilm, FaCalendarAlt, FaPlay } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import LoadingSpinner from './LoadingSpinner';
import MovieCard from './MovieCard';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TopRated = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchTopRated = async (pageNum) => {
    try {
      const response = await movieService.discoverMovies({
        sort_by: 'vote_average.desc',
        page: pageNum,
        'vote_count.gte': 1000
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const loadInitialMovies = async () => {
      try {
        const initialMovies = await fetchTopRated(1);
        setMovies(initialMovies);
        setSelectedMovie(initialMovies[0]);
      } catch (error) {
        setError('Failed to load top rated movies');
      } finally {
        setLoading(false);
      }
    };

    loadInitialMovies();
  }, []);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const moreMovies = await fetchTopRated(nextPage);
      
      if (moreMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...moreMovies]);
        setPage(nextPage);
      }
    } catch (error) {
      setError('Failed to load more movies');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchNowClick = (e, movieId) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      if (window.confirm('Please login to watch movies. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  if (loading && movies.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {selectedMovie && (
        <div className="relative h-[60vh] mb-8 sm:mb-16">
          <div className="absolute inset-0">
            <img 
              src={movieService.getBackdropUrl(selectedMovie.backdrop_path)}
              alt={selectedMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60" />
          </div>
          
          <div className="relative container mx-auto px-4 sm:px-6 h-full flex items-end pb-8 sm:pb-16">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-bold mb-4">{selectedMovie.title}</h1>
              <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="font-bold">{selectedMovie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-yellow-500" />
                  <span>{(selectedMovie.vote_count / 1000).toFixed(1)}K votes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-500" />
                  <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 sm:mb-8 line-clamp-3 text-sm sm:text-base">
                {selectedMovie.overview}
              </p>
              <button 
                onClick={(e) => handleWatchNowClick(e, selectedMovie.id)}
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 
                         text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors
                         text-sm sm:text-base"
              >
                <FaPlay />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-6 sm:mb-12">
          <div className="flex items-center gap-2 sm:gap-4">
            <FaTrophy className="text-yellow-500 text-xl sm:text-3xl" />
            <h2 className="text-xl sm:text-3xl font-bold">Top Rated Movies</h2>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <span>High Ratings</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-yellow-500" />
              <span>Popular Choice</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="group relative transform hover:scale-105 transition-all duration-300"
              onMouseEnter={() => setSelectedMovie(movie)}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8 sm:mt-12 pb-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="group bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 
                       px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold flex items-center gap-2 
                       transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                'Loading...'
              ) : (
                <>
                  Discover More
                  <FaChevronDown className="group-hover:translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRated;