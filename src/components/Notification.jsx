import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBell, FaFilm, FaStar, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { useNotification } from '../contexts/NotificationContext';

const Notification = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-0 w-96 max-h-[32rem] bg-gray-900/95 backdrop-blur-md 
                    rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 
                    bg-gray-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaBell className="text-yellow-500 text-xl" />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
            )}
          </div>
          <h3 className="font-semibold text-lg">Notifications</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800/50 rounded-lg"
        >
          <FaTimes size={18} />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[calc(32rem-8rem)]">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-800/50">
            {notifications.map(notification => (
              <Link
                key={notification.id}
                to={notification.link || '#'}
                className={`block p-4 hover:bg-gray-800/30 transition-all duration-300
                         ${notification.read ? 'opacity-60' : ''}`}
                onClick={() => {
                  markAsRead(notification.id);
                  onClose();
                }}
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    {notification.type === 'new' && (
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <FaFilm className="text-blue-500" />
                      </div>
                    )}
                    {notification.type === 'recommendation' && (
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <FaStar className="text-yellow-500" />
                      </div>
                    )}
                    {notification.type === 'upcoming' && (
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <FaCalendarAlt className="text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-yellow-500/90">
                        {notification.title}
                      </p>
                      {notification.read && (
                        <FaCheck className="text-gray-500 text-sm mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-300/90 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <FaBell className="text-gray-500 text-4xl mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No new notifications</p>
            <p className="text-sm text-gray-500 mt-1">
              We'll notify you when something interesting happens
            </p>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-800 bg-gray-900/95 backdrop-blur-md sticky bottom-0">
          <button 
            onClick={markAllAsRead}
            className="w-full text-center py-2 text-sm text-yellow-500 hover:text-yellow-400 
                     transition-colors rounded-lg hover:bg-yellow-500/10"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;