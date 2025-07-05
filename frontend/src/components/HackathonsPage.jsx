import { motion } from 'framer-motion';
import { FaLaptopCode } from 'react-icons/fa';
import EventList from './EventList';
import BackButton from './BackButton';

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-20">
      <BackButton />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2 flex items-center justify-center gap-3">
            <FaLaptopCode className="inline-block text-3xl text-yellow-400" />
            Hackathons
          </h1>
          <p className="text-gray-400 text-lg">
            Discover upcoming hackathons and showcase your innovation through exciting challenges.
          </p>
        </div>
        <EventList eventType="hackathon" hideCreateButton />
      </div>
    </div>
  );
} 