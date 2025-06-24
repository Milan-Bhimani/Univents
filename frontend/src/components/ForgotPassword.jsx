import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        setSuccess('OTP sent to your email.');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP');
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
        setSuccess('OTP verified. Please enter your new password.');
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
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
        setSuccess('Password reset successful! You can now log in.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <BackButton />
      <div className="w-full max-w-md bg-gray-800/80 p-8 rounded-2xl shadow-2xl border border-gray-700/30">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-yellow-400/90 font-medium text-sm mb-2">E-mail Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="Enter your registered email"
                required
              />
            </div>
            {error && <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
            {success && <div className="text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">{success}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-yellow-400/90 font-medium text-sm mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOTP(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="Enter OTP sent to your email"
                required
                maxLength={6}
              />
            </div>
            {error && <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
            {success && <div className="text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">{success}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-yellow-400/90 font-medium text-sm mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="Enter new password"
                required
                minLength={8}
              />
            </div>
            {error && <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
            {success && <div className="text-green-400 text-sm bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">{success}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
      </div>
    </div>
  );
} 