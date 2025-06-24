import React, { useState, useEffect } from 'react';
import { FiMapPin, FiAlertCircle } from 'react-icons/fi';

const LocationPermission = ({ onLocationUpdate, onSkip }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, granted, denied

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLocationStatus('denied');
    }
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      
      // Update user location on server
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/location/update-location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ longitude, latitude })
      });

      const data = await response.json();
      
      if (data.success) {
        setLocationStatus('granted');
        onLocationUpdate({ latitude, longitude });
      } else {
        throw new Error(data.message || 'Failed to update location');
      }
    } catch (err) {
      console.error('Location error:', err);
      setLocationStatus('denied');
      
      if (err.code === 1) {
        setError('Location access denied. You can still use the app, but you won\'t get location-based recommendations.');
      } else if (err.code === 2) {
        setError('Location unavailable. Please check your device settings.');
      } else if (err.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError(err.message || 'Failed to get your location');
      }
    } finally {
      setLoading(false);
    }
  };

  if (locationStatus === 'granted') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
        <div className="flex items-center">
          <FiMapPin className="mr-2" />
          <span>Location access granted! You'll now see personalized nearby events.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
      <div className="text-center">
        <FiMapPin className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-yellow-400 mb-2">
          Enable Location Access
        </h3>
        <p className="text-gray-300 mb-6">
          Allow location access to discover events happening near you and get personalized recommendations based on your area.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={requestLocation}
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Location...
              </span>
            ) : (
              'Allow Location Access'
            )}
          </button>
          
          <button
            onClick={onSkip}
            className="w-full text-gray-400 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Benefits of enabling location:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Discover events happening nearby</li>
            <li>Get personalized recommendations</li>
            <li>See distance to events</li>
            <li>Find events in your college area</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationPermission;