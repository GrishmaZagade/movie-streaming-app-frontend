import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      await login({
        email: email.trim(),
        password: password
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
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
            Sign in to your account
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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

            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 
                         rounded-lg text-white focus:outline-none focus:ring-2 
                         focus:ring-yellow-500/50 focus:border-transparent
                         placeholder-gray-400 transition duration-300"
              />
            </div>

            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-yellow-500 hover:text-yellow-400 
                         transition-colors font-medium hover:underline"
              >
                Forgot Password?
              </Link>
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
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-yellow-500 hover:text-yellow-400 transition-colors 
                       font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;