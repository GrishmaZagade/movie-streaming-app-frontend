import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaStar, FaHeart, FaShare, FaClock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import VideoPlayer from './VideoPlayer';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [details, movieVideos] = await Promise.all([
          movieService.getMovieDetails(id),
          movieService.getMovieVideos(id)
        ]);
        setMovie(details);
        setVideos(movieVideos);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleWatchlistClick = () => {
    if (!isAuthenticated()) {
      if (window.confirm('Please login to manage your watchlist. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleTrailerClick = () => {
    if (!isAuthenticated()) {
      if (window.confirm('Please login to watch trailers. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    if (trailer) {
      setShowTrailer(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} on Movie App!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Movie not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const trailer = videos.find(video => video.type === 'Trailer') || videos[0];

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="relative min-h-[70vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movieService.getBackdropUrl(movie.backdrop_path)})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900" />
        </div>

        <div className="relative container mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-72 flex-shrink-0">
              <img 
                src={movieService.getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <FaClock className="text-yellow-500" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="bg-gray-800/50 px-3 py-1 rounded-full">
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-lg mb-8 max-w-3xl leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={handleTrailerClick}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 
                         rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  disabled={!trailer}
                >
                  <FaPlay />
                  Watch Trailer
                </button>
                <button 
                  onClick={handleWatchlistClick}
                  className={`${
                    isInWatchlist(movie.id) 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-white'
                  } px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors`}
                >
                  <FaHeart className={isInWatchlist(movie.id) ? 'text-black' : 'text-white'} />
                  {isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
                <button 
                  onClick={handleShare}
                  className={`bg-gray-800/50 hover:bg-gray-700/50 p-3 
                         rounded-lg font-semibold transition-colors relative group
                         ${shareSuccess ? 'bg-green-500/50 hover:bg-green-600/50' : ''}`}
                  title={navigator.share ? 'Share movie' : 'Copy link to clipboard'}
                >
                  {shareSuccess ? <FaCheck /> : <FaShare />}
                  {shareSuccess && !navigator.share && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Status: </span>
                <span>{movie.status}</span>
              </div>
              <div>
                <span className="text-gray-400">Release Date: </span>
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Budget: </span>
                <span>${(movie.budget / 1000000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-gray-400">Revenue: </span>
                <span>${(movie.revenue / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Production</h2>
            <div className="space-y-2">
              {movie.production_companies?.map(company => (
                <div key={company.id} className="text-gray-300">
                  {company.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {movie.spoken_languages?.map(language => (
                <span key={language.iso_639_1} className="bg-gray-700/50 px-3 py-1 rounded-full text-sm">
                  {language.english_name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showTrailer && trailer && (
        <VideoPlayer 
          videoKey={trailer.key} 
          onClose={() => setShowTrailer(false)} 
        />
      )}
    </div>
  );
};

export default MovieDetails;