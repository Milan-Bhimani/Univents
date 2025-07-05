import React, { useState, useEffect } from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';

const RecommendedEvents = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/recommendations/personalized', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch recommendations');
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
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
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
          <FaStar className="inline-block text-2xl text-yellow-400" />
          Recommended for You
        </h1>
        <p className="text-gray-400 text-lg">
          Personalized event picks based on your interests and activity.
        </p>
      </div>
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <FaHeart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No recommendations available yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Register for some events to get personalized recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.slice(0, 5).map((recommendation, index) => (
            <EventCard key={recommendation.event._id} event={recommendation.event} index={index} />
          ))}
        </div>
      )}
      {recommendations.length > 5 && (
        <div className="mt-6 text-center">
          <Link
            to="/recommendations"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            View All Recommendations →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendedEvents;