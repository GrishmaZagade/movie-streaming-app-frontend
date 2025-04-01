import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaStar, FaClock, FaHeart } from 'react-icons/fa';
import { movieService } from '../services/movieService';
import VideoPlayer from './VideoPlayer';
import { useWatchlist } from '../contexts/WatchlistContext';
import { useAuth } from '../contexts/AuthContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { isAuthenticated } = useAuth();

  const handlePlayClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      if (window.confirm('Please login to watch trailers. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    try {
      const videos = await movieService.getMovieVideos(movie.id);
      const trailer = videos.find(video => video.type === 'Trailer') || videos[0];
      setTrailer(trailer);
      setShowTrailer(true);
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
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

  return (
    <>
      <div 
        onClick={() => navigate(`/movie/${movie.id}`)}
        className="bg-gray-800/50 backdrop-blur-sm rounded-md sm:rounded-lg overflow-hidden shadow-lg
                transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105
                hover:z-10 border border-gray-700/50"
      >
        <div className="aspect-[2/3] relative group">
          {movie.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <span className="text-gray-400 text-[10px] sm:text-sm px-2 text-center">{movie.title}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                        sm:opacity-0 opacity-100 group-hover:opacity-100 transition-all duration-300 
                        flex items-end justify-center gap-2 sm:gap-3 pb-2 sm:pb-6">
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-2 sm:px-8 py-1 sm:py-3 
                      rounded text-[10px] sm:text-base font-medium flex items-center gap-1 sm:gap-2 transition-colors"
              onClick={handlePlayClick}
            >
              <FaPlay className="text-[8px] sm:text-lg" />
              <span className="hidden sm:inline">Play Now</span>
              <span className="sm:hidden">Play</span>
            </button>
            <button 
              onClick={handleWatchlistClick}
              className={`${
                isInWatchlist(movie.id) 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-white'
              } p-1 sm:p-3.5 rounded transition-colors`}
            >
              <FaHeart className="text-[10px] sm:text-2xl" />
            </button>
          </div>

          {movie.vote_average > 0 && (
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-yellow-500 text-black 
                         px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5">
              <FaStar className="text-[8px] sm:text-xs" />
              <span className="font-bold text-[8px] sm:text-xs">{movie.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="p-1.5 sm:p-4">
          <h3 className="font-bold text-[10px] sm:text-base text-white truncate">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-2 text-[8px] sm:text-xs text-gray-400">
            {movie.release_date && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.vote_count > 0 && (
              <span className="flex items-center gap-0.5">
                <FaStar className="text-[8px] sm:text-xs text-yellow-500" />
                {movie.vote_count} votes
              </span>
            )}
          </div>
        </div>
      </div>

      {showTrailer && trailer && (
        <VideoPlayer 
          videoKey={trailer.key} 
          onClose={() => setShowTrailer(false)} 
        />
      )}
    </>
  );
};

export default MovieCard;