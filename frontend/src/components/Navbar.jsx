import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaUserCircle, FaChevronDown } from "react-icons/fa";
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
        className="fixed top-0 left-0 w-full bg-opacity-80 backdrop-blur-md bg-gray-800 shadow-lg z-[9999] px-6 py-4 flex justify-between items-center text-white"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link to="/home" className="flex items-center space-x-2 text-2xl font-extrabold text-yellow-400 hover:opacity-80 transition-opacity">
          UniVents
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/home" className="flex items-center space-x-2 text-white hover:text-yellow-400 transition">
            <FaHome /> <span>Home</span>
          </Link>

          <div 
            className="relative" 
            ref={eventsRef} 
            onClick={() => handleClick('events')}
            onKeyDown={(e) => handleKeyDown(e, 'events')}
          >
            <button 
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-md px-2 py-1"
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
                className="absolute left-0 w-48 mt-2 origin-top-left bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-[100]"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1">
                  <Link to="/events/workshops" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Workshops</Link>
                  <Link to="/events/hackathons" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Hackathons</Link>
                  <Link to="/events/seminars" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Seminars</Link>
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
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-full p-1"
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
                className="absolute right-0 mt-2 w-48 origin-top-right bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-[100]"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="py-1">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Profile</Link>
                  <Link to="/profile/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Settings</Link>
                  <Link to="/create-event/edit" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400" role="menuitem">Create Event</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 focus:outline-none focus:bg-gray-700 focus:text-yellow-400"
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
    </>
  );
};

export default Navbar;
