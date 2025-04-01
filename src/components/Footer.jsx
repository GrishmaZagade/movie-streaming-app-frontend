import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPlayCircle } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-black text-gray-400">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(255,187,0,0.1),transparent)]"></div>
      
      <div className="container mx-auto px-4 pt-20 pb-12 relative">
        {/* Logo and Description */}
        <div className="flex flex-col items-center mb-16 text-center">
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 group mb-6 hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 
                            rounded-xl flex items-center justify-center transform rotate-12
                            shadow-lg shadow-yellow-500/20">
                <FaPlayCircle className="text-white text-2xl transform -rotate-12" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 
                            rounded-xl blur opacity-30 group-hover:opacity-50 transition-all"></div>
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              Movie<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Flix</span>
            </span>
          </Link>
          <p className="max-w-xl text-gray-400 text-lg mb-12">
            Your premier destination for unlimited entertainment. Stream the latest movies and TV shows 
            anytime, anywhere. Join millions of viewers today!
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Home</span>
              </Link></li>
              <li><Link to="/discover" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Movies</span>
              </Link></li>
              <li><Link to="/watchlist" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">My List</span>
              </Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl relative inline-block">
              Categories
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/discover?genre=action" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Action</span>
              </Link></li>
              <li><Link to="/discover?genre=comedy" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Comedy</span>
              </Link></li>
              <li><Link to="/discover?genre=drama" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Drama</span>
              </Link></li>
              <li><Link to="/discover?genre=horror" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Horror</span>
              </Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl relative inline-block">
              Features
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/coming-soon" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Coming Soon</span>
              </Link></li>
              <li><Link to="/top-rated" onClick={scrollToTop} className="group flex items-center space-x-2 transition-transform duration-300 hover:translate-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hover:text-yellow-500 transition-colors">Top Rated</span>
              </Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl relative inline-block">
              Connect With Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <div className="p-4 bg-gray-800/30 rounded-xl flex items-center justify-center hover:bg-blue-600/20 group transition-all duration-300">
                  <FaFacebookF className="text-2xl text-gray-400 group-hover:text-blue-500" />
                </div>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <div className="p-4 bg-gray-800/30 rounded-xl flex items-center justify-center hover:bg-sky-600/20 group transition-all duration-300">
                  <FaTwitter className="text-2xl text-gray-400 group-hover:text-sky-500" />
                </div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <div className="p-4 bg-gray-800/30 rounded-xl flex items-center justify-center hover:bg-pink-600/20 group transition-all duration-300">
                  <FaInstagram className="text-2xl text-gray-400 group-hover:text-pink-500" />
                </div>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="transform hover:scale-110 transition-transform">
                <div className="p-4 bg-gray-800/30 rounded-xl flex items-center justify-center hover:bg-red-600/20 group transition-all duration-300">
                  <FaYoutube className="text-2xl text-gray-400 group-hover:text-red-500" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-500">
              © 2024 MovieFlix. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;