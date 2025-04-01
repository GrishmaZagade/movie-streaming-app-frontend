import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const savedWatchlist = localStorage.getItem('watchlist');
      return savedWatchlist ? JSON.parse(savedWatchlist) : [];
    } catch (error) {
      console.error('Error loading watchlist:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) {
        return prev;
      }
      const newWatchlist = [...prev, { 
        ...movie, 
        addedAt: new Date().toISOString(),
        watchlistId: `${movie.id}-${Date.now()}` // Add unique identifier
      }];
      return newWatchlist.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)); // Sort by date added
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your watchlist?')) {
      setWatchlist([]);
    }
  };

  const moveToTop = (movieId) => {
    setWatchlist(prev => {
      const movie = prev.find(m => m.id === movieId);
      if (!movie) return prev;
      
      const newWatchlist = prev.filter(m => m.id !== movieId);
      return [{ ...movie, addedAt: new Date().toISOString() }, ...newWatchlist];
    });
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      addToWatchlist, 
      removeFromWatchlist, 
      isInWatchlist,
      clearWatchlist,
      moveToTop,
      totalMovies: watchlist.length,
      isEmpty: watchlist.length === 0
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export default WatchlistProvider;