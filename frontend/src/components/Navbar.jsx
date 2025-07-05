import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaUserCircle, FaChevronDown, FaGlobe, FaLaptopCode, FaChalkboardTeacher, FaTools, FaMicrophone, FaHandshake, FaTrophy, FaStar, FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [eventsOpen, setEventsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const eventsRef = useRef(null);
  const profileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (eventsRef.current && !eventsRef.current.contains(event.target)) {
        setEventsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = (dropdownType) => {
    if (dropdownType === 'events') {
      setEventsOpen(!eventsOpen);
      setProfileOpen(false);
    } else if (dropdownType === 'profile') {
      setProfileOpen(!profileOpen);
      setEventsOpen(false);
    }
  };

  const handleKeyDown = (e, dropdownType) => {
    if (e.key === 'Escape') {
      if (dropdownType === 'events') {
        setEventsOpen(false);
      } else if (dropdownType === 'profile') {
        setProfileOpen(false);
      }
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full bg-opacity-90 backdrop-blur-lg bg-gray-800 shadow-2xl rounded-b-2xl z-[9999] px-8 py-7 flex justify-between items-center text-white transition-all duration-300"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link to="/home" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
          <FaRegCalendarAlt className="text-yellow-400 text-4xl drop-shadow-lg" />
          <span className="text-4xl font-black text-yellow-400 tracking-wider drop-shadow-lg">UniVents</span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link to="/home" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-200 font-semibold text-lg px-3 py-2 rounded-lg hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50">
            <FaHome /> <span>Home</span>
          </Link>

          <div 
            className="relative"
            ref={eventsRef}
            onClick={() => handleClick('events')}
            onKeyDown={(e) => handleKeyDown(e, 'events')}
          >
            <button 
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors duration-200 font-semibold text-lg px-3 py-2 rounded-lg hover:bg-gray-700/40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              aria-expanded={eventsOpen}
              aria-haspopup="true"
            >
              <span>Events</span>
              <FaChevronDown className={`transform transition-transform duration-200 ${eventsOpen ? 'rotate-180' : ''}`} />
            </button>
            {eventsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 w-60 mt-2 origin-top-left bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-lg"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-2">
                  <Link to="/events" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaGlobe className="text-lg" /> All Events</Link>
                  <Link to="/events/online" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaGlobe className="text-lg" /> Online Events</Link>
                  <div className="border-t border-gray-700 my-2"></div>
                  <Link to="/category/hackathon" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaLaptopCode className="text-lg" /> Hackathons</Link>
                  <Link to="/category/seminar" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaChalkboardTeacher className="text-lg" /> Seminars</Link>
                  <Link to="/category/workshop" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaTools className="text-lg" /> Workshops</Link>
                  <Link to="/category/conference" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaMicrophone className="text-lg" /> Conferences</Link>
                  <Link to="/category/networking" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaHandshake className="text-lg" /> Networking</Link>
                  <Link to="/category/competition" className="flex items-center gap-2 px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem"><FaTrophy className="text-lg" /> Competitions</Link>
                </div>
              </motion.div>
            )}
          </div>

          <div 
            className="relative" 
            ref={profileRef} 
            onClick={() => handleClick('profile')}
            onKeyDown={(e) => handleKeyDown(e, 'profile')}
          >
            <button 
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-full p-2 hover:bg-gray-700/40 transition-all"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <CgProfile className="text-4xl cursor-pointer hover:text-yellow-400 transition" />
            </button>
            {profileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-lg"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-2">
                  <Link to="/profile" className="block px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem">Profile</Link>
                  <Link to="/your-events" className="block px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg" role="menuitem">Your Events</Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="block w-full text-left px-5 py-2 text-base text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400 rounded-lg"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>
      <div className="mb-4"></div>
    </>
  );
};

export default Navbar;
