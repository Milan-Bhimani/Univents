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
    address: '',
    tags: [],
    location: null
  });

  const availableTags = [
    'technology', 'business', 'design', 'marketing', 'science', 
    'arts', 'sports', 'health', 'education', 'networking'
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        college: user.college || '',
        address: user.address || '',
        tags: user.tags || [],
        location: user.location || null
      });
    }
  }, []);

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          setError('Unable to detect location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

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

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
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

          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">Tags (Select your interests)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {availableTags.map((tag) => (
                <label key={tag} className="flex items-center text-white text-sm bg-gray-700/30 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                    className="mr-2"
                  />
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-yellow-400/90 font-medium">Location</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="location"
                value={formData.location ? `${formData.location.coordinates[1]}, ${formData.location.coordinates[0]}` : ''}
                readOnly
                className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                placeholder="Latitude, Longitude"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition-all"
              >
                Detect My Location
              </button>
            </div>
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