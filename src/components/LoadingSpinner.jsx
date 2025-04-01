import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="relative">
        {/* Film Reel Animation */}
        <div className="w-32 h-32 relative animate-spin-slow">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-8 border-yellow-500/30">
              {/* Film Sprockets */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-yellow-500 rounded-full transform -translate-x-2 -translate-y-2"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translate(3.5rem) rotate(-${i * 45}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Center Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 border-4 border-yellow-500 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center mt-4">
          <p className="text-yellow-500 text-lg font-medium animate-pulse">
            Loading Movies...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;