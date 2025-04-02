import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCamera, FaUserCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { compressImage } from '../utils/imageCompression';

const genreOptions = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 
  'Romance', 'Science Fiction', 'Adventure', 'Animation', 'Documentary'
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: [],
    profileImage: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth();

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
        console.error('Image processing error:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        setImageProcessing(false);
      }
    }
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

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.preferences.length < 2) {
      return setError('Please select at least 2 preferences');
    }

    setLoading(true);

    try {
      console.log('Attempting registration...');
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        preferences: formData.preferences,
        profileImage: formData.profileImage
      });

      console.log('Registration successful, attempting login...');
      await login({
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Registration/Login error:', err);
      setError(err.message || 'Unable to connect to server. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-4 px-3 sm:py-12 sm:px-4 mt-16 sm:mt-20">
      <div className="max-w-3xl mx-auto bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
        <div className="relative mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 text-center">
            Create your account
          </h2>
          <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm animate-fade-in flex items-center">
            <div className="mr-2 flex-shrink-0">⚠️</div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-700/50 cursor-pointer hover:ring-2 hover:ring-yellow-500/50 transition duration-300"
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
                    <FaUserCircle size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 right-0 flex space-x-1 sm:space-x-2">
                <label className="bg-yellow-500 p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors shadow-lg">
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
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, profileImage: null }));
                    }}
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
                required
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="relative group">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent placeholder-gray-400 transition duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select your movie preferences (minimum 2)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {genreOptions.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handlePreferenceChange(genre)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    formData.preferences.includes(genre)
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || imageProcessing}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-yellow-500 hover:text-yellow-400 transition-colors font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;