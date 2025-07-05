import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaShieldAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import BackButton from './BackButton';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('OTP sent to your email successfully!');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('OTP verified successfully! Please enter your new password.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to reset password. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <FaEnvelope className="text-3xl" />;
      case 2: return <FaShieldAlt className="text-3xl" />;
      case 3: return <FaKey className="text-3xl" />;
      default: return <FaEnvelope className="text-3xl" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Enter Your Email';
      case 2: return 'Verify OTP';
      case 3: return 'Set New Password';
      default: return 'Reset Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'We\'ll send a verification code to your email address';
      case 2: return 'Enter the 6-digit code sent to your email';
      case 3: return 'Create a strong new password for your account';
      default: return 'Reset your password';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <BackButton />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-4">
            {getStepIcon()}
          </div>
          <h1 className="text-3xl font-black text-yellow-400 mb-2 drop-shadow-lg tracking-wide">
            {getStepTitle()}
          </h1>
          <p className="text-gray-400 text-lg">
            {getStepDescription()}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber 
                    ? 'bg-yellow-400 text-gray-900' 
                    : 'bg-gray-700/50 text-gray-400 border border-gray-600/50'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step > stepNumber ? 'bg-yellow-400' : 'bg-gray-700/50'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-8 border border-gray-700/30 shadow-2xl">
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                  <FaEnvelope className="text-sm" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 px-4 py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <FaExclamationTriangle />
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                  <FaShieldAlt className="text-sm" />
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOTP(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 px-4 py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200 text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                  maxLength={6}
                />
                <p className="text-gray-400 text-sm text-center">
                  Enter the 6-digit code sent to <span className="text-yellow-400">{email}</span>
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <FaExclamationTriangle />
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                  <FaKey className="text-sm" />
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600/50 px-4 py-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
                  placeholder="Enter your new password"
                  required
                  minLength={8}
                />
                <p className="text-gray-400 text-sm">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
                  <FaExclamationTriangle />
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <FaCheckCircle />
              {success}
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center pt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <FaArrowLeft />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 