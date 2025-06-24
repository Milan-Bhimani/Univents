import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    address: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        college: user.college || '',
        address: user.address || ''
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage with new user data
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Something went wrong while updating profile');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 relative">
      <BackButton />
      <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-2xl p-8 backdrop-blur-lg border border-gray-700/30">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
              rows="3"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;