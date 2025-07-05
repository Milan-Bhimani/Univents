import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import EventCard from './EventCard';

const NearbyEvents = ({ userLocation, maxDistance = 25000 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userLocation) {
      fetchNearbyEvents();
    }
  }, [userLocation, maxDistance]);

  const fetchNearbyEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { latitude, longitude } = userLocation;
      
      const response = await fetch(
        `http://localhost:5000/api/location/nearby-events?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch nearby events');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-3">
          <FaMapMarkerAlt className="inline-block text-2xl text-yellow-400" />
          Nearby Events
        </h1>
        <p className="text-gray-400 text-lg">
          Events happening close to your current location.
        </p>
        <span className="text-sm text-gray-400 block mt-2">
          {events.length} events within {maxDistance / 1000}km
        </span>
      </div>
      {events.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No events found in your area</p>
          <p className="text-sm text-gray-500 mt-2">
            Try increasing your search radius in settings
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      )}
      {events.length > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/events/nearby"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            View All Nearby Events →
          </Link>
        </div>
      )}
    </div>
  );
};

export default NearbyEvents;