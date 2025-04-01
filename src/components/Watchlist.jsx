import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../contexts/WatchlistContext';
import WatchlistCard from './WatchlistCard';
import LoadingSpinner from './LoadingSpinner';
import { FaTrash, FaSort, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWatchlist, setFilteredWatchlist] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let sorted = [...watchlist];
    
    if (searchQuery) {
      sorted = sorted.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'releaseDate':
          return new Date(b.release_date) - new Date(a.release_date);
        case 'dateAdded':
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

    setFilteredWatchlist(sorted);
  }, [watchlist, sortBy, searchQuery]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <p className="text-gray-400 text-lg">Your watchlist is empty</p>
            <Link 
              to="/discover" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg 
                       font-medium transition-colors hover:shadow-lg hover:shadow-yellow-500/20"
            >
              Discover Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your watchlist?')) {
                clearWatchlist();
              }
            }}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 
                     px-4 py-2 rounded-lg transition-colors"
          >
            <FaTrash className="text-sm" />
            Clear Watchlist
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search in watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-yellow-500 
                       hover:bg-gray-700 transition-colors"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-yellow-500
                     hover:bg-gray-700 transition-colors"
          >
            <option value="dateAdded">Sort by Date Added</option>
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
            <option value="releaseDate">Sort by Release Date</option>
          </select>
        </div>
        
        <div className="hidden md:block space-y-4 mb-12">
          {filteredWatchlist.map(movie => (
            <WatchlistCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {filteredWatchlist.map(movie => (
            <WatchlistCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        <div className="text-center text-gray-400 mt-8">
          {filteredWatchlist.length} of {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} 
          {searchQuery && ' (filtered)'}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;