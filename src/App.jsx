import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionHeader from './components/SectionHeader';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import Watchlist from './components/Watchlist';
import Discover from './components/Discover';
import ComingSoon from './components/ComingSoon';
import TopRated from './components/TopRated';
import Search from './components/Search';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import ProfileEdit from './components/ProfileEdit';
import ForgotPassword from './components/ForgotPassword';
import { movieService } from './services/movieService';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const HomePage = () => {
  const [movies, setMovies] = useState({
    trending: [],
    topRated: [],
    upcoming: [],
    nowPlaying: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trending, topRated, upcoming, nowPlaying] = await Promise.all([
          movieService.getTrending(),
          movieService.getTopRated(),
          movieService.getUpcoming(),
          movieService.getNowPlaying()
        ]);

        if (!trending?.length || !topRated?.length || !upcoming?.length || !nowPlaying?.length) {
          throw new Error('Invalid data received from the server');
        }

        setMovies({
          trending,
          topRated,
          upcoming,
          nowPlaying
        });
      } catch (error) {
        console.error('Error fetching movies:', {
          message: error.message,
          status: error?.response?.status,
          data: error?.response?.data
        });
        setError(
          error?.response?.status === 401 
            ? 'Authentication failed. Please check API configuration.'
            : 'Failed to load movies. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center max-w-lg mx-auto px-4">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 
                     transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                     hover:shadow-yellow-500/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 pt-16">
      {movies.trending?.length > 0 && <Hero movie={movies.trending[0]} movies={movies.trending} />}
      
      <div className="container mx-auto px-2 sm:px-4 md:px-8 space-y-8 sm:space-y-12 pb-16 sm:pb-24">
        <SectionHeader 
          title="Now in Theaters" 
          viewAllLink="/discover?category=now_playing"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {movies.nowPlaying?.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </SectionHeader>

        <SectionHeader 
          title="Trending Now"
          viewAllLink="/discover?category=trending"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {movies.trending?.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </SectionHeader>

        <SectionHeader 
          title="Top Rated"
          viewAllLink="/top-rated"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {movies.topRated?.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </SectionHeader>

        <SectionHeader 
          title="Coming Soon"
          viewAllLink="/coming-soon"
        >
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {movies.upcoming?.slice(0, 4).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </SectionHeader>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WatchlistProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/watchlist" element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                } />
                <Route path="/discover" element={<Discover />} />
                <Route path="/search" element={<Search />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/top-rated" element={<TopRated />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile/edit" element={
                  <ProtectedRoute>
                    <ProfileEdit />
                  </ProtectedRoute>
                } />
                <Route path="/profile/preferences" element={
                  <ProtectedRoute>
                    <ProfileEdit />
                  </ProtectedRoute>
                } />
              </Routes>
              <Footer />
            </div>
          </Router>
        </WatchlistProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;