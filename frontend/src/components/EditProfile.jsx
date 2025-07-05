import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaUniversity, FaMapMarkerAlt, FaTags, FaLocationArrow, FaSave, FaArrowLeft } from 'react-icons/fa';
import BackButton from './BackButton';

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
          setSuccess('Location detected successfully!');
          setTimeout(() => setSuccess(''), 3000);
        },
        (error) => {
          setError('Unable to detect location. Please check your browser permissions.');
          setTimeout(() => setError(''), 5000);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

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
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-2xl mx-auto">
        <BackButton />
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide">
            Edit Your Profile
          </h1>
          <p className="text-gray-400 text-lg">
            Update your personal information and preferences
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                <FaUser className="text-xl" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-yellow-400/90 font-semibold text-sm">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                    <FaPhone className="text-sm" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                  <FaUniversity className="text-sm" />
                  College/University
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your college or university"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm flex items-center gap-2">
                  <FaMapMarkerAlt className="text-sm" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                <FaTags className="text-xl" />
                Interests & Tags
              </h2>
              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm">
                  Select your interests (helps us recommend relevant events)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableTags.map((tag) => (
                    <label 
                      key={tag} 
                      className={`flex items-center text-sm p-3 rounded-xl transition-all duration-200 cursor-pointer border-2 ${
                        formData.tags.includes(tag)
                          ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                          : 'bg-gray-700/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="mr-2 w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400/50 focus:ring-2"
                      />
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                <FaLocationArrow className="text-xl" />
                Location
              </h2>
              <div className="space-y-3">
                <label className="block text-yellow-400/90 font-semibold text-sm">
                  Your location (for nearby event recommendations)
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    name="location"
                    value={formData.location ? `${formData.location.coordinates[1].toFixed(6)}, ${formData.location.coordinates[0].toFixed(6)}` : ''}
                    readOnly
                    className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400"
                    placeholder="Latitude, Longitude (will be detected automatically)"
                  />
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Detect Location
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Your location helps us recommend events near you and improve your experience.
                </p>
              </div>
            </div>

            {error && (
              <div className="text-center text-red-400 py-8">{error}</div>
            )}
            {success && (
              <div className="text-center text-green-400 py-8">{success}</div>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 bg-gray-700/50 text-gray-300 px-6 py-4 rounded-xl font-semibold hover:bg-gray-700/70 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-600/50"
              >
                <FaArrowLeft />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <FaSave />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;