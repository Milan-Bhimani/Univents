import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaChalkboardTeacher, FaTools, FaMicrophone, FaHandshake, FaTrophy } from 'react-icons/fa';
import EventList from './EventList';
import BackButton from './BackButton';

const categoryConfig = {
  hackathon: {
    icon: <FaLaptopCode className="inline-block text-3xl text-yellow-400" />, title: 'Hackathons', sub: 'Discover upcoming hackathons and showcase your innovation through exciting challenges.'
  },
  seminar: {
    icon: <FaChalkboardTeacher className="inline-block text-3xl text-yellow-400" />, title: 'Seminars', sub: 'Discover upcoming seminars and expand your knowledge through expert-led sessions.'
  },
  workshop: {
    icon: <FaTools className="inline-block text-3xl text-yellow-400" />, title: 'Workshops', sub: 'Discover upcoming workshops and enhance your skills through hands-on learning experiences.'
  },
  conference: {
    icon: <FaMicrophone className="inline-block text-3xl text-yellow-400" />, title: 'Conferences', sub: 'Discover upcoming conferences and connect with industry leaders and experts.'
  },
  networking: {
    icon: <FaHandshake className="inline-block text-3xl text-yellow-400" />, title: 'Networking', sub: 'Discover networking events and grow your professional connections.'
  },
  competition: {
    icon: <FaTrophy className="inline-block text-3xl text-yellow-400" />, title: 'Competitions', sub: 'Discover upcoming competitions and challenge yourself to win amazing prizes.'
  }
};

export default function CategoryPage() {
  const { category } = useParams();
  const config = categoryConfig[category] || {
    icon: null,
    title: category.charAt(0).toUpperCase() + category.slice(1),
    sub: 'Browse events in this category.'
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8 text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-3">
          {config.icon}
          {config.title}
        </h1>
        <p className="text-gray-300 text-lg">{config.sub}</p>
      </motion.div>
      <EventList eventType={category} hideCreateButton />
    </div>
  );
} 