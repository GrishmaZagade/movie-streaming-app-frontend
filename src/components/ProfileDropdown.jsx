import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaCog, FaSignOutAlt } from 'react-icons/fa';

const ProfileDropdown = ({ user, onLogout, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.username} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle size={32} className="text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-white">{user.username}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>
      
      <Link 
        to="/profile/edit"
        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white
                 transition-colors flex items-center space-x-2"
        onClick={onClose}
      >
        <FaEdit size={14} />
        <span>Edit Profile</span>
      </Link>
      
      <Link 
        to="/profile/preferences"
        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white
                 transition-colors flex items-center space-x-2"
        onClick={onClose}
      >
        <FaCog size={14} />
        <span>Movie Preferences</span>
      </Link>
      
      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white
                 transition-colors flex items-center space-x-2"
      >
        <FaSignOutAlt size={14} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default ProfileDropdown;