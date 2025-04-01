import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      if (!userData || !userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email: userData.email.trim().toLowerCase(),
        password: userData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { user: responseUser, token } = response.data;
      
      const userToStore = {
        id: responseUser.id || '',
        username: responseUser.username || '',
        email: responseUser.email || '',
        profileImage: responseUser.profileImage || '',
        preferences: responseUser.preferences || []
      };

      setUser(userToStore);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  };

  const register = async (userData) => {
    try {
      if (!userData.email || !userData.password || !userData.username) {
        throw new Error('Username, email and password are required');
      }

      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email.trim().toLowerCase());
      formData.append('password', userData.password);
      formData.append('preferences', JSON.stringify(userData.preferences || []));
      if (userData.profileImage) {
        formData.append('profileImage', userData.profileImage);
      }

      const response = await axios.post('http://localhost:5001/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { user: registeredUser, token } = response.data;

      const userToStore = {
        id: registeredUser.id || '',
        username: registeredUser.username || '',
        email: registeredUser.email || '',
        profileImage: registeredUser.profileImage || '',
        preferences: registeredUser.preferences || []
      };

      setUser(userToStore);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      if (userData.username) formData.append('username', userData.username);
      if (userData.email) formData.append('email', userData.email.trim().toLowerCase());
      if (userData.currentPassword) formData.append('currentPassword', userData.currentPassword);
      if (userData.newPassword) formData.append('newPassword', userData.newPassword);
      if (userData.preferences) formData.append('preferences', JSON.stringify(userData.preferences));
      if (userData.profileImage) formData.append('profileImage', userData.profileImage);

      const response = await axios.put('http://localhost:5001/api/auth/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = {
        ...user,
        ...response.data.user
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const deleteProfileImage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5001/api/auth/profile/image', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedUser = {
        ...user,
        profileImage: ''
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      console.error('Profile image deletion error:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete profile image');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    deleteProfileImage,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;