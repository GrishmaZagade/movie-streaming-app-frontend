import React from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoPlayer = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-yellow-500 
                 transition-colors p-2 rounded-full bg-gray-800/50"
      >
        <FaTimes className="text-xl" />
      </button>
      
      <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
          title="Movie Trailer"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;