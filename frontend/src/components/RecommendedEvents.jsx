import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiCalendar, FiMapPin, FiUsers, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-yellow-400 flex items-center">
          <FiStar className="mr-2" />
          Recommended for You
        </h3>
        <span className="text-sm text-gray-400">
          {recommendations.length} personalized recommendations
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <FiHeart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No recommendations available yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Register for some events to get personalized recommendations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.slice(0, 5).map((recommendation, index) => (
            <motion.div
              key={recommendation.event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {recommendation.event.title}
                    </h4>
                    <div className="flex items-center bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                      <FiStar className="w-3 h-3 mr-1" />
                      {Math.round(recommendation.score)}% match
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {recommendation.event.description}
                  </p>
                  
                  {recommendation.reasons && recommendation.reasons.length > 0 && (
                    <p className="text-yellow-400/80 text-xs mt-2 italic">
                      {recommendation.reasons[0]}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {new Date(recommendation.event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <FiMapPin className="w-4 h-4 mr-1" />
                      {recommendation.event.location}
                    </div>
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-1" />
                      {recommendation.event.registeredParticipants?.length || 0} registered
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {recommendation.event.category && (
                        <span className="bg-gray-600/50 text-gray-300 px-2 py-1 rounded-full text-xs">
                          {recommendation.event.category}
                        </span>
                      )}
                      {recommendation.event.difficulty && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                          {recommendation.event.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <Link
                      to={`/events/${recommendation.event._id}`}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
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