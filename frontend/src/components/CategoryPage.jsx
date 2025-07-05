import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaChalkboardTeacher, FaTools, FaMicrophone, FaHandshake, FaTrophy, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import EventList from './EventList';
import BackButton from './BackButton';

const categoryConfig = {
  hackathon: {
    icon: <FaLaptopCode className="text-4xl" />,
    title: 'Hackathons',
    sub: 'Discover upcoming hackathons and showcase your innovation through exciting challenges.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'purple-500/20',
    borderColor: 'purple-500/30'
  },
  seminar: {
    icon: <FaChalkboardTeacher className="text-4xl" />,
    title: 'Seminars',
    sub: 'Discover upcoming seminars and expand your knowledge through expert-led sessions.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'blue-500/20',
    borderColor: 'blue-500/30'
  },
  workshop: {
    icon: <FaTools className="text-4xl" />,
    title: 'Workshops',
    sub: 'Discover upcoming workshops and enhance your skills through hands-on learning experiences.',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'green-500/20',
    borderColor: 'green-500/30'
  },
  conference: {
    icon: <FaMicrophone className="text-4xl" />,
    title: 'Conferences',
    sub: 'Discover upcoming conferences and connect with industry leaders and experts.',
    color: 'from-red-500 to-orange-500',
    bgColor: 'red-500/20',
    borderColor: 'red-500/30'
  },
  networking: {
    icon: <FaHandshake className="text-4xl" />,
    title: 'Networking',
    sub: 'Discover networking events and grow your professional connections.',
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'indigo-500/20',
    borderColor: 'indigo-500/30'
  },
  competition: {
    icon: <FaTrophy className="text-4xl" />,
    title: 'Competitions',
    sub: 'Discover upcoming competitions and challenge yourself to win amazing prizes.',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'yellow-500/20',
    borderColor: 'yellow-500/30'
  }
};

export default function CategoryPage() {
  const { category } = useParams();
  const config = categoryConfig[category] || {
    icon: <FaCalendarAlt className="text-4xl" />,
    title: category.charAt(0).toUpperCase() + category.slice(1),
    sub: 'Browse events in this category.',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'gray-500/20',
    borderColor: 'gray-500/30'
  };

  const [eventCount, setEventCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/events/category/${category}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setEventCount(data.count || 0);
        setEvents(data.events || []);
      } catch (e) {
        setEventCount(0);
        setError(e.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-5xl mx-auto">
        <BackButton />
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto mb-12"
        >
          {/* Category Hero Card */}
          <div className={`bg-gray-800/40 backdrop-blur-lg rounded-3xl p-12 border border-${config.borderColor} shadow-2xl text-center relative overflow-hidden`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-5`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center justify-center w-24 h-24 ${config.bgColor} rounded-full mb-6 border border-${config.borderColor}`}
              >
                <div className="text-yellow-400">
                  {config.icon}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide"
              >
                {config.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto"
              >
                {config.sub}
              </motion.p>

              {/* Real Event Count Only */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-gray-700/30"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{eventCount !== null ? eventCount : '-'}</div>
                  <div className="text-gray-400 text-sm">Events</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            {loading && <div className="text-center text-yellow-400 py-8 animate-pulse">Loading events...</div>}
            {error && <div className="text-center text-red-400 py-8">{error}</div>}
            {!loading && !error && events.length === 0 && <div className="text-center text-gray-400 py-8">No events found in this category.</div>}
            <EventList eventType={category} hideCreateButton />
          </div>
        </motion.div>
      </div>
    </div>
  );
} 