import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const InterestSelector = ({ selectedInterests = [], onInterestsChange, onSave, onSkip }) => {
  const [interests, setInterests] = useState(selectedInterests);

  const availableInterests = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'marketing', label: 'Marketing', icon: '📈' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'arts', label: 'Arts', icon: '🎭' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'networking', label: 'Networking', icon: '🤝' }
  ];

  const toggleInterest = (interestId) => {
    const newInterests = interests.includes(interestId)
      ? interests.filter(id => id !== interestId)
      : [...interests, interestId];
    
    setInterests(newInterests);
    onInterestsChange(newInterests);
  };

  const handleSave = () => {
    onSave(interests);
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-yellow-400 mb-2">
          What are you interested in?
        </h3>
        <p className="text-gray-300">
          Select your interests to get personalized event recommendations
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {availableInterests.map((interest, index) => (
          <motion.button
            key={interest.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={() => toggleInterest(interest.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
              interests.includes(interest.id)
                ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-yellow-400/50 hover:bg-gray-700/50'
            }`}
          >
            <div className="text-2xl mb-2">{interest.icon}</div>
            <div className="text-sm font-medium">{interest.label}</div>
            
            {interests.includes(interest.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full p-1"
              >
                <FiCheck className="w-3 h-3" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-400 mb-6">
        {interests.length === 0 && "Select at least one interest to continue"}
        {interests.length === 1 && "1 interest selected"}
        {interests.length > 1 && `${interests.length} interests selected`}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          disabled={interests.length === 0}
          className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Interests
        </button>
        
        <button
          onClick={onSkip}
          className="flex-1 text-gray-400 hover:text-white transition-colors border border-gray-600 py-3 rounded-xl"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default InterestSelector;