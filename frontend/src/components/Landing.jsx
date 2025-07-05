import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto"
      >
        <img src="/logo.png" alt="UniVents Logo" className="h-32 w-auto mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Welcome to UniVents</h1>
        <p className="text-xl text-gray-300 mb-8">
          Your one-stop platform for discovering, creating, and managing university events.
          Connect with your campus community and never miss out on exciting opportunities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition duration-300"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-gray-800 text-yellow-400 rounded-lg font-semibold hover:bg-gray-700 transition duration-300 border-2 border-yellow-400"
          >
            Learn More
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Discover Events</h3>
            <p className="text-gray-300">Find workshops, seminars, and hackathons happening around your campus.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Create & Manage</h3>
            <p className="text-gray-300">Easily create and manage your own events with our intuitive tools.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Stay Connected</h3>
            <p className="text-gray-300">Connect with fellow students and never miss important updates.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}