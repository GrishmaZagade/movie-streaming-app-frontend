import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCamera, FaSpinner, FaTimes } from 'react-icons/fa';
import { compressImage } from '../utils/imageCompression';

const genreOptions = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 
  'Romance', 'Science Fiction', 'Adventure', 'Animation', 'Documentary'
];

const ProfileEdit = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    preferences: user?.preferences || [],
    profileImage: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || '');
  const [showPreview, setShowPreview] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10000000) {
        setError('Image size should be less than 10MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a JPG or PNG image');
        return;
      }

      try {
        setImageProcessing(true);
        const compressedImage = await compressImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData(prev => ({ ...prev, profileImage: compressedImage }));
        };
        reader.readAsDataURL(compressedImage);
      } catch (err) {
        setError('Failed to process image');
      } finally {
        setImageProcessing(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, profileImage: null }));
  };

  const handlePreferenceChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(genre)
        ? prev.preferences.filter(p => p !== genre)
        : [...prev.preferences, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.username.trim() || !formData.email.trim()) {
        throw new Error('Username and email are required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (formData.preferences.length < 2) {
        throw new Error('Please select at least 2 movie preferences');
      }

      await updateProfile({
        username: formData.username.trim(),
        email: formData.email.toLowerCase().trim(),
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        preferences: formData.preferences,
        profileImage: formData.profileImage
      });

      setSuccess('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setTimeout(() => {
        setSuccess('');
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      if (err.message.includes('401')) {
        setError('Session expired. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-4 px-3 sm:py-12 sm:px-4 mt-16 sm:mt-20">
      <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-8 border border-gray-700/50">
        <div className="relative mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 text-center">
            Edit Profile
          </h2>
          <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs sm:text-sm
                        animate-fade-in flex items-center">
            <div className="mr-2 flex-shrink-0">⚠️</div>
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-xs sm:text-sm
                        animate-fade-in flex items-center">
            <div className="mr-2 flex-shrink-0">✅</div>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-30 
                            group-hover:opacity-60 transition duration-300"></div>
              <div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-700/50 cursor-pointer
                         hover:ring-2 hover:ring-yellow-500/50 transition duration-300"
                onClick={() => imagePreview && setShowPreview(true)}
              >
                {imageProcessing ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaSpinner className="animate-spin text-gray-400" size={24} />
                  </div>
                ) : imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCamera size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 right-0 flex space-x-1 sm:space-x-2">
                <label className="bg-yellow-500 p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-yellow-600 
                                transition-colors shadow-lg">
                  <FaCamera size={14} className="text-black" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    disabled={imageProcessing}
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-500 p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FaTimes size={14} className="text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-600/50 rounded-lg text-sm sm:text-base 
                         text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-600/50 rounded-lg text-sm sm:text-base 
                         text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-600/50 rounded-lg text-sm sm:text-base 
                         text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password (optional)"
                className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-600/50 rounded-lg text-sm sm:text-base 
                         text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2.5 bg-gray-700/30 border border-gray-600/50 rounded-lg text-sm sm:text-base 
                         text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
              Movie Preferences (select at least 2)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {genreOptions.map(genre => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handlePreferenceChange(genre)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300
                            relative overflow-hidden group
                            ${formData.preferences.includes(genre)
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg'
                              : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'}`}
                >
                  <span className="relative z-10">{genre}</span>
                  {!formData.preferences.includes(genre) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 
                                  group-hover:opacity-10 transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-700/50 text-gray-300 rounded-lg 
                       hover:bg-gray-700/80 transition-all duration-300 text-sm sm:text-base
                       hover:shadow-lg hover:shadow-gray-900/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageProcessing}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 
                       text-black rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                       hover:shadow-lg hover:shadow-yellow-600/30 disabled:opacity-50 
                       disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>

        {showPreview && imagePreview && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <div className="relative max-w-2xl max-h-[80vh] overflow-hidden rounded-lg">
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                className="max-w-full max-h-[80vh] object-contain"
              />
              <button
                className="absolute top-4 right-4 bg-red-500 p-2 rounded-full hover:bg-red-600 
                         transition-colors shadow-lg"
                onClick={() => setShowPreview(false)}
              >
                <FaTimes size={20} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;