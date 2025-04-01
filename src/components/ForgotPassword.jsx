import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      // TODO: Implement the actual password reset API call here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API call
      setSuccessMessage('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
                    flex items-center justify-center px-4 sm:px-6 py-8 mt-16 sm:mt-20">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl rounded-lg sm:rounded-xl 
                    shadow-2xl p-6 sm:p-8 border border-gray-700/50">
        <div className="relative mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text 
                       bg-gradient-to-r from-yellow-400 to-yellow-600 text-center">
            Reset Your Password
          </h2>
          <div className="absolute inset-x-0 -bottom-2 h-px bg-gradient-to-r 
                       from-transparent via-yellow-500/50 to-transparent"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 
                       rounded-lg text-sm animate-fade-in flex items-center">
            <div className="mr-2 flex-shrink-0">⚠️</div>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 
                       rounded-lg text-sm animate-fade-in flex items-center">
            <div className="mr-2 flex-shrink-0">✓</div>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 
                         rounded-lg text-white focus:outline-none focus:ring-2 
                         focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 
                     text-black rounded-lg font-medium transition-all duration-300
                     hover:shadow-lg hover:shadow-yellow-600/30 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          <p className="text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link 
              to="/login" 
              className="text-yellow-500 hover:text-yellow-400 transition-colors 
                       font-medium hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;