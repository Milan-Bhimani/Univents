import { motion } from 'framer-motion';
import EventList from './EventList';
import BackButton from './BackButton';

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24">
      <BackButton />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 w-full max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8 text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Welcome to Hackathons</h1>
        <p className="text-gray-300 text-lg">
          Discover upcoming hackathons and showcase your innovation through exciting challenges.
        </p>
      </motion.div>
      
      <EventList eventType="hackathon" />
    </div>
  );
}