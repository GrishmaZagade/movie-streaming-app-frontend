import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaTimes, FaFilm } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      setLoading(true);
      try {
        const results = await movieService.searchMovies(query);
        setMovies(results);
        setError(null);
      } catch (error) {
        setError('Failed to search movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [query]);

  const handleClear = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-24">
      <div className="container mx-auto px-6">
        {/* Search Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-2xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setSearchParams({ q: e.target.value })}
                placeholder="Search for movies..."
                className="w-full bg-gray-800/50 text-white pl-12 pr-12 py-4 rounded-xl
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50
                         placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
          {query && !loading && (
            <p className="text-gray-400">
              Found {movies.length} results for "{query}"
            </p>
          )}
        </div>

        {/* Search Results */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <FaFilm className="text-gray-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No movies found</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaSearch className="text-gray-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Start searching for movies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;