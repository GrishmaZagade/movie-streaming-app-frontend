import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaStar, FaTrash, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { useWatchlist } from '../contexts/WatchlistContext';
import { movieService } from '../services/movieService';
import VideoPlayer from './VideoPlayer';

const WatchlistCard = ({ movie }) => {
  const navigate = useNavigate();
  const { removeFromWatchlist } = useWatchlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailer, setTrailer] = useState(null);

  const handlePlayClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const videos = await movieService.getMovieVideos(movie.id);
      const trailer = videos.find(video => video.type === 'Trailer') || videos[0];
      setTrailer(trailer);
      setShowTrailer(true);
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWatchlist(movie.id);
  };

  return (
    <>
      <div 
        className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl 
                  overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl 
                  border border-gray-700/50 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Poster */}
          <div className="w-full md:w-48 h-[400px] md:h-auto relative overflow-hidden">
            {movie.poster_path ? (
              <>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className={`w-full h-full object-cover transition-transform duration-500 
                            ${isHovered ? 'scale-110' : 'scale-100'}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <span className="text-gray-400 text-sm px-4 text-center">{movie.title}</span>
              </div>
            )}

            {/* Rating Badge */}
            {movie.vote_average > 0 && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500/90 
                            text-black px-2 py-0.5 rounded-md backdrop-blur-sm">
                <FaStar className="text-xs" />
                <span className="font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}

            {/* Play Button Overlay */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/0 
                       hover:bg-black/40 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FaPlay className="text-white text-4xl transform hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-yellow-400 
                           transition-colors line-clamp-1">
                {movie.title}
              </h3>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              {movie.release_date && (
                <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                  <FaCalendarAlt className="text-yellow-500" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              {movie.addedAt && (
                <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
                  <FaClock className="text-yellow-500" />
                  Added {new Date(movie.addedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 
                          rounded-lg font-medium flex items-center gap-2 transition-all
                          hover:shadow-lg hover:shadow-yellow-500/20 flex-1 md:flex-none 
                          justify-center"
              >
                <FaPlay className="text-sm" />
                <span>View Details</span>
              </button>
              <button 
                onClick={handleRemove}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2.5 
                          rounded-lg font-medium flex items-center gap-2 transition-all
                          hover:text-red-400"
              >
                <FaTrash className="text-sm" />
                <span>Remove</span>
              </button>
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
    </>
  );
};

export default WatchlistCard;