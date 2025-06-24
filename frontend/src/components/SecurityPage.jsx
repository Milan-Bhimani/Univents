import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import BackButton from './BackButton';

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [emailData, setEmailData] = useState({
    currentEmail: '',
    newEmail: '',
    password: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/users/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(emailData)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Email updated successfully');
        setEmailData({ currentEmail: '', newEmail: '', password: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
      <BackButton />
      <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/30">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Security Settings</h1>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'email' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400'
            }`}
          >
            <FiMail />
            <span>Change Email</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'password' ? 'bg-yellow-400 text-gray-900' : 'text-gray-400'
            }`}
          >
            <FiLock />
            <span>Change Password</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg mb-6">
            {success}
          </div>
        )}

        {activeTab === 'email' ? (
          <form onSubmit={handleEmailChange} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Current Email</label>
                <input
                  type="email"
                  value={emailData.currentEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, currentEmail: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">New Email</label>
                <input
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Password</label>
                <input
                  type="password"
                  value={emailData.password}
                  onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
            >
              {isLoading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SecurityPage;
