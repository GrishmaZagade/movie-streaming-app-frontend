import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [
      {
        id: 1,
        type: 'new',
        title: 'New Release',
        message: 'The latest blockbuster "Oppenheimer" is now available!',
        time: '2 hours ago',
        read: false,
        link: '/movie/872585'
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'Recommended for You',
        message: 'Based on your watchlist: "Barbie"',
        time: '5 hours ago',
        read: false,
        link: '/movie/346698'
      },
      {
        id: 3,
        type: 'upcoming',
        title: 'Coming Soon',
        message: 'New trailer released for "Dune: Part Two"',
        time: '1 day ago',
        read: false,
        link: '/movie/693134'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotification = {
        id: Date.now(),
        read: false,
        time: 'Just now',
        link: notification.link || '#',
        ...notification
      };
      return [newNotification, ...prev];
    });
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  const getLatestNotification = () => {
    return notifications[0] || null;
  };

  const updateNotification = (id, updates) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, ...updates } : notification
    ));
  };

  const value = {
    notifications,
    unreadCount: getUnreadCount(),
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getNotificationsByType,
    getLatestNotification,
    updateNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Custom hooks for specific notification functionality
export const useNotificationActions = () => {
  const { addNotification, removeNotification, markAsRead, markAllAsRead, clearAllNotifications } = useNotification();
  return { addNotification, removeNotification, markAsRead, markAllAsRead, clearAllNotifications };
};

export const useNotificationState = () => {
  const { notifications, unreadCount, getNotificationsByType, getLatestNotification } = useNotification();
  return { notifications, unreadCount, getNotificationsByType, getLatestNotification };
};

export default NotificationContext;