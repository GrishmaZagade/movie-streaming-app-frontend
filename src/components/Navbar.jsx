import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCompass, FaHeart, FaClock, FaStar, FaBars, FaTimes, FaSearch, 
         FaUser, FaBell, FaPlayCircle, FaSignOutAlt, FaUserCircle, FaEdit, FaCog } from 'react-icons/fa';
import Notification from './Notification';
import ProfileDropdown from './ProfileDropdown';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { unreadCount } = useNotification();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.notification-panel')) {
      setIsNotificationOpen(false);
    }
    if (!e.target.closest('.profile-dropdown')) {
      setIsProfileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 
      ${isScrolled 
        ? 'bg-gray-900 md:bg-gray-900/80 md:backdrop-blur-sm' 
        : isMenuOpen 
          ? 'bg-gray-900 md:bg-transparent' 
          : 'bg-gray-900 md:bg-gradient-to-b md:from-gray-900/80 md:to-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 
                            rounded-lg flex items-center justify-center transform rotate-12
                            shadow-lg group-hover:shadow-yellow-500/20">
                <FaPlayCircle className="text-white text-lg transform -rotate-12" />
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-400 to-yellow-600 
                            rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Movie<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Flix</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<FaHome size={16} />} text="Home" active={location.pathname === '/'} />
            <NavLink to="/discover" icon={<FaCompass size={16} />} text="Discover" active={location.pathname === '/discover'} />
            <NavLink to="/watchlist" icon={<FaHeart size={16} />} text="Watchlist" active={location.pathname === '/watchlist'} />
            <NavLink to="/coming-soon" icon={<FaClock size={16} />} text="Coming Soon" active={location.pathname === '/coming-soon'} />
            <NavLink to="/top-rated" icon={<FaStar size={16} />} text="Top Rated" active={location.pathname === '/top-rated'} />
          </div>

          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                placeholder="Search movies..."
                className="bg-gray-800/50 text-gray-300 text-sm pl-8 pr-3 py-1.5 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-yellow-500/50 w-44
                         transition-all duration-300 group-hover:bg-gray-800/70"
              />
              <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 
                                text-gray-500 text-xs group-hover:text-gray-300 transition-colors" />
            </div>
            
            {user && (
              <div className="relative notification-panel">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <FaBell size={16} className="text-gray-400 hover:text-gray-200 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full"></span>
                  )}
                </button>
                <Notification 
                  isOpen={isNotificationOpen} 
                  onClose={() => setIsNotificationOpen(false)} 
                />
              </div>
            )}
            
            {user ? (
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.username} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={24} className="text-gray-300" />
                  )}
                </button>
                
                {isProfileOpen && (
                  <ProfileDropdown 
                    user={user} 
                    onLogout={handleLogout}
                    onClose={() => setIsProfileOpen(false)}
                  />
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/login'
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/register'
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-1.5 rounded-lg
                       hover:bg-gray-800/50 transition-all"
            >
              {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden bg-gray-900
                      ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2">
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                placeholder="Search movies..."
                className="w-full bg-gray-800 text-gray-300 text-sm pl-8 pr-3 py-1.5 rounded-lg
                         focus:outline-none focus:ring-1 focus:ring-yellow-500/50"
              />
              <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs" />
            </div>

            <MobileNavLink to="/" icon={<FaHome size={16} />} text="Home" active={location.pathname === '/'} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/discover" icon={<FaCompass size={16} />} text="Discover" active={location.pathname === '/discover'} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/watchlist" icon={<FaHeart size={16} />} text="Watchlist" active={location.pathname === '/watchlist'} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/coming-soon" icon={<FaClock size={16} />} text="Coming Soon" active={location.pathname === '/coming-soon'} onClick={() => setIsMenuOpen(false)} />
            <MobileNavLink to="/top-rated" icon={<FaStar size={16} />} text="Top Rated" active={location.pathname === '/top-rated'} onClick={() => setIsMenuOpen(false)} />
            
            <div className="pt-2 mt-2 border-t border-gray-800">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.username} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle size={24} className="text-gray-300" />
                    )}
                    <span className="text-sm text-gray-300">{user.username}</span>
                  </div>
                  <Link 
                    to="/profile/edit"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaEdit size={16} />
                    <span>Edit Profile</span>
                  </Link>
                  <Link 
                    to="/profile/preferences"
                    className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaCog size={16} />
                    <span>Preferences</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  >
                    <FaSignOutAlt size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/login"
                    className={`block w-full text-center py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      location.pathname === '/login'
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`block w-full text-center py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      location.pathname === '/register'
                        ? 'bg-yellow-500 text-black'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-all
        ${active 
          ? 'text-yellow-400 bg-yellow-500/10 font-medium' 
          : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, icon, text, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all
        ${active 
          ? 'text-yellow-400 bg-yellow-500/10 font-medium' 
          : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50'
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

export default Navbar;