import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiEdit2, FiLock } from 'react-icons/fi';
import BackButton from './BackButton';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://univents-764n.onrender.com/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const responseData = await response.json();

        if (!response.ok || !responseData.success) {
          throw new Error(responseData.message || 'Failed to fetch user data');
        }

        if (!responseData.data) {
          throw new Error('No user data received from server');
        }

        setUser(responseData.data);
        localStorage.setItem('user', JSON.stringify(responseData.data));
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message || 'Failed to load profile');
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center text-yellow-400 py-8 animate-pulse">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center text-red-400 py-8">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-4xl mx-auto">
        {location.pathname !== '/home' && <BackButton />}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2">Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-yellow-400/20 flex items-center justify-center border-2 border-yellow-400/30 shadow-lg shadow-yellow-400/10">
                <span className="text-3xl font-bold text-yellow-400">
                  {user.name ? user.name[0].toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-gray-400 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>{user.email}</span>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-400">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span className="text-gray-300">{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-gray-300">{user.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-yellow-400">Academic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                    </svg>
                    <span className="text-gray-300">{user.college || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="text-gray-300">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mt-8">
              <div className="w-full max-w-md">
                <button
                  onClick={() => navigate('/profile/edit')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Your Tickets Section */}
            {user.tickets && user.tickets.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 mt-8 drop-shadow-lg tracking-tight">Your Tickets</h2>
                <div className="space-y-4">
                  {user.tickets.map((ticket) => {
                    // Validate date
                    let dateStr = 'N/A';
                    if (ticket.eventDate && !isNaN(Date.parse(ticket.eventDate))) {
                      dateStr = new Date(ticket.eventDate).toLocaleString();
                    }
                    return (
                      <div key={ticket._id || ticket.eventId} className="bg-gray-700/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white">{ticket.eventTitle || 'N/A'}</div>
                          <div className="text-gray-400 text-sm">{ticket.eventLocation || 'N/A'}</div>
                          <div className="text-gray-400 text-sm">{dateStr}</div>
                          <div className="text-gray-400 text-sm">Method: {ticket.method || 'N/A'}</div>
                          {ticket.ticketName && (
                            <div className="text-gray-400 text-sm">Ticket: {ticket.ticketName}</div>
                          )}
                          {typeof ticket.ticketPrice !== 'undefined' && (
                            <div className="text-gray-400 text-sm">Price: {ticket.ticketPrice === 0 ? 'Free' : `₹${ticket.ticketPrice}`}</div>
                          )}
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-4">
                          <button
                            onClick={async () => {
                              const token = localStorage.getItem('token');
                              const res = await fetch(`https://univents-764n.onrender.com/api/users/tickets/${ticket._id}/reminder`, {
                                method: 'PUT',
                                headers: { 'Authorization': `Bearer ${token}` }
                              });
                              if (res.ok) window.location.reload();
                            }}
                            className={`px-4 py-2 rounded font-semibold transition ${ticket.reminder ? 'bg-green-500/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'}`}
                          >
                            {ticket.reminder ? 'Reminder On' : 'Set Reminder'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;