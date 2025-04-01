import React, { useState, useEffect } from 'react';
import { FaStar, FaPlus, FaCheck } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../contexts/WatchlistContext';

const Hero = ({ movie, movies }) => {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [currentMovie, setCurrentMovie] = useState(movie);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        if (!movies || movies.length === 0) {
          setError('Failed to load movies. Please try again.');
          setIsLoading(false);
          return;
        }

        setCurrentMovie(movies[0]);
        setIsLoading(false);
        
        const interval = setInterval(() => {
          setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error('Error in loadMovies:', err);
        setError('An error occurred while loading movies.');
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [movies]);

  useEffect(() => {
    try {
      if (!movies || movies.length === 0) return;
      setCurrentMovie(movies[currentMovieIndex]);
    } catch (err) {
      console.error('Error updating current movie:', err);
      setError('Error updating current movie.');
    }
  }, [currentMovieIndex, movies]);

  if (isLoading) {
    return (
      <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[800px] pt-16 flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[800px] pt-16 flex flex-col items-center justify-center bg-gray-900">
        <p className="text-red-500 mb-4 text-center px-4">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
            window.location.reload();
          }}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[800px] pt-16 flex items-center justify-center bg-gray-900">
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  const backdropUrl = movieService.getBackdropUrl(currentMovie.backdrop_path);
  const isMovieInWatchlist = isInWatchlist(currentMovie.id);

  const handleWatchlistClick = () => {
    try {
      if (isMovieInWatchlist) {
        removeFromWatchlist(currentMovie.id);
      } else {
        addToWatchlist(currentMovie);
      }
    } catch (err) {
      console.error('Error handling watchlist:', err);
    }
  };

  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] lg:h-[800px] pt-16">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('${backdropUrl}')`,
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/95 to-transparent lg:via-gray-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
      </div>

      <div className="relative h-full flex items-end sm:items-center pb-4 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold mb-2 sm:mb-4 lg:mb-6 
                         text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300
                         transition-all duration-500 line-clamp-2 sm:line-clamp-none">
              {currentMovie.title}
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base lg:text-xl mb-3 sm:mb-8 
                       line-clamp-2 sm:line-clamp-3 transition-all duration-500">
              {currentMovie.overview}
            </p>
            
            <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 mb-3 sm:mb-8">
              <Link 
                to={`/movie/${currentMovie.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 sm:px-8 py-2.5 sm:py-4 
                         rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-2 
                         transition-all duration-300 hover:scale-105 text-sm sm:text-base
                         hover:shadow-lg hover:shadow-yellow-500/20 group flex-1 sm:flex-none"
              >
                <FaStar className="transition-transform group-hover:scale-110" />
                <span>Details</span>
              </Link>
              
              <button 
                onClick={handleWatchlistClick}
                className="bg-gray-800/80 hover:bg-gray-700 px-4 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl 
                         font-semibold flex items-center justify-center gap-2 text-sm sm:text-base
                         transition-all duration-300 hover:scale-105
                         hover:shadow-lg hover:shadow-gray-500/10 group
                         border border-gray-700 hover:border-gray-600 flex-1 sm:flex-none"
              >
                {isMovieInWatchlist ? (
                  <>
                    <FaCheck className="text-green-500" />
                    <span className="hidden sm:inline">Added to Watchlist</span>
                    <span className="sm:hidden">Added</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="transition-transform duration-300 group-hover:rotate-180" />
                    <span className="hidden sm:inline">Add to Watchlist</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-0">
              <div className="bg-gray-800/80 backdrop-blur-sm px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl 
                            flex items-center gap-1 sm:gap-2 border border-gray-700 text-sm sm:text-base">
                <FaStar className="text-yellow-500" />
                <span className="font-bold">{currentMovie.vote_average?.toFixed(1) || '0.0'}</span>
                <span className="text-xs sm:text-sm text-gray-400">/10</span>
              </div>
              
              {currentMovie.release_date && (
                <div className="bg-gray-800/80 backdrop-blur-sm px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                              border border-gray-700 text-sm sm:text-base">
                  <span className="text-gray-300">
                    {new Date(currentMovie.release_date).getFullYear()}
                  </span>
                </div>
              )}
              
              <div className="bg-gray-800/80 backdrop-blur-sm px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                            border border-gray-700 text-sm sm:text-base">
                <span className="text-gray-300">
                  {((currentMovie.vote_count || 0)/1000).toFixed(1)}K
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;