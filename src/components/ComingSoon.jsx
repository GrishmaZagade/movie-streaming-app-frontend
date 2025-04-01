import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import LoadingSpinner from './LoadingSpinner';

const ComingSoon = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const movies = await movieService.getUpcoming();
        const today = new Date();
        const futureMovies = movies.filter(movie => 
          new Date(movie.release_date) > today
        ).sort((a, b) => 
          new Date(a.release_date) - new Date(b.release_date)
        );
        
        setUpcomingMovies(futureMovies);
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
        setError('Failed to load upcoming movies');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  if (loading) {
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

  if (upcomingMovies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">Coming Soon</h1>
          <div className="flex items-center justify-center h-[50vh]">
            <p className="text-gray-400 text-lg">No upcoming movies found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Coming Soon</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {upcomingMovies.map(movie => (
            <div 
              key={movie.id}
              className="bg-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm
                       border border-gray-700/50 hover:border-yellow-500/50 
                       transition-all duration-300 group"
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] overflow-hidden">
                {movie.poster_path ? (
                  <div className="w-full h-full">
                    <img 
                      src={movieService.getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 
                               group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-sm px-2 text-center">{movie.title}</span>
                  </div>
                )}

                {/* Rating Badge */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 
                                bg-yellow-500/90 text-black px-2 py-0.5 rounded-md">
                    <FaStar className="text-xs" />
                    <span className="font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}

                {/* Release Date Badge */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 
                              text-xs text-white bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                  <FaCalendarAlt className="text-yellow-500" />
                  <span>
                    {new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h2 className="font-semibold text-white mb-2 line-clamp-1 
                             group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h2>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 
                                rounded-full text-xs flex items-center gap-1">
                    <FaClock className="text-xs" />
                    Coming Soon
                  </span>
                </div>

                <p className="text-gray-400 text-xs line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;