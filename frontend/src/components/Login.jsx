import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authservice';
import { generateOTP, verifyOTP } from '../services/otpService';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState('');

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      setError('');
      await generateOTP(formData.email);
      setSuccess('OTP has been resent to your email');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!otpSent) {
        const loginData = await login(formData.email, formData.password);

        if (loginData.success) {
          const otpResult = await generateOTP(formData.email);

          if (otpResult.success) {
            setOtpSent(true);
            setShowOTPInput(true);
            setSuccess('OTP has been sent to your email');
          } else {
            throw new Error(otpResult.message || 'Failed to generate OTP');
          }
        } else {
          throw new Error(loginData.message || 'Invalid credentials');
        }
      } else {
        if (!otp || otp.length !== 6) {
          throw new Error('Please enter a valid 6-digit OTP');
        }

        const verifyResult = await verifyOTP(formData.email, otp);

        if (!verifyResult || !verifyResult.success || !verifyResult.data) {
          throw new Error('Invalid response format from server');
        }

        const { token, user } = verifyResult.data;

        if (!token || typeof token !== 'string') {
          throw new Error('Invalid token format received');
        }

        // Store auth data
        localStorage.setItem('token', token);
        
        if (user && typeof user === 'object') {
          localStorage.setItem('user', JSON.stringify(user));
        }

        setSuccess('Login successful!');
        // Navigate after a short delay
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message);
      // Only reset OTP state if it's not an OTP-related error
      if (!err.message.toLowerCase().includes('otp')) {
        setOtpSent(false);
        setShowOTPInput(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-5xl flex bg-gray-800/50 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden border border-gray-700/30 transform hover:scale-[1.01] transition-all duration-300">
        <div className="w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-yellow-400 p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-yellow-400 mb-6 tracking-tight">UniVents</h1>
            <p className="text-2xl font-semibold text-yellow-300/90 leading-relaxed">
              Welcome back! <br /> Sign in to continue your journey.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-yellow-300/80">Real-time event updates</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <p className="text-yellow-300/80">Connect with peers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-12 bg-gray-900/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium text-sm tracking-wide">E-mail Address</label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your e-mail"
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 group-hover:border-yellow-400/30"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium text-sm tracking-wide">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 group-hover:border-yellow-400/30 pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300">Forgot Password?</Link>
              </div>
            </div>
            {showOTPInput && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-yellow-400/90 font-medium text-sm tracking-wide">Enter OTP</label>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
                  >
                    Resend OTP
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 group-hover:border-yellow-400/30"
                    required
                    maxLength="6"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                {success}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                otpSent ? 'Verify OTP' : 'Sign In'
              )}
            </button>
            <p className="text-center text-gray-400">
              Don't have an account? <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}