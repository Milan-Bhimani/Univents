import { FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import MapComponent from './MapComponent';
import { getEventImage } from '../utils/eventImages';

export default function EventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchEvent();
    getUserLocation();
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        setCurrentUserId(userObj._id);
      } catch {}
    }
  }, [id]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
  
        }
      );
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to view events');
      }

      const response = await fetch(`https://univents-764n.onrender.com/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event');
      }

      if (data.success && data.data) {
        setEvent(data.data);
      } else {
        throw new Error('Event not found');
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = (ticket) => {
    // Redirect to mock payment page with event and ticket data
    navigate('/mock-payment', { 
      state: { 
        event: event,
        ticket: ticket
      }
    });
  };

  const handleFreeRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to register for events');
      }
      const response = await fetch(`https://univents-764n.onrender.com/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }
      setShowSuccess(true);
      fetchEvent();
      alert('Successfully registered for the event!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 pt-24">
        <BackButton />
        <div className="text-yellow-400 text-xl">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 pt-24">
        <BackButton />
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate('/home')} 
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-6 pt-24">
        <BackButton />
        <div className="text-yellow-400 text-xl mb-4">Event not found</div>
        <button 
          onClick={() => navigate('/home')} 
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center p-6 pt-20">
      <BackButton />
      <div className="w-full max-w-6xl">
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-700 mt-8 mb-12 p-0 md:p-0">
          {/* Event Image */}
          <div className="relative h-80 md:h-96 overflow-hidden rounded-t-3xl">
            <img 
              src={getEventImage(event.category)}
              alt="Event Cover" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-90"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-base shadow-lg">
                {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Event'}
              </span>
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h1 className="text-5xl font-black text-yellow-400 mb-6 drop-shadow-lg tracking-wide">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-6 mb-8 text-lg text-gray-300">
                <div className="flex items-center gap-2">
                  <IoCalendarOutline className="text-yellow-400 text-2xl" />
                  <span>{new Date(event.date).toLocaleDateString()} {event.time && `| ${event.time}`}</span>
                </div>
                {event.endDate && (
                  <div className="flex items-center gap-2">
                    <IoCalendarOutline className="text-yellow-400 text-2xl" />
                    <span>Ends: {new Date(event.endDate).toLocaleDateString()} {event.endTime && `| ${event.endTime}`}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="text-yellow-400 text-2xl" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                {event.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {event.tags && event.tags.map((tag, idx) => (
                  <span key={idx} className="bg-yellow-400/10 text-yellow-400 font-semibold text-xs px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              {event.isTicketed && event.tickets && event.tickets.length > 0 ? (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Tickets</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {event.tickets.map((ticket, idx) => (
                      <div key={idx} className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow hover:border-yellow-400/60 transition-all duration-200 flex flex-col gap-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-yellow-400">{ticket.name}</span>
                          <span className="text-base font-semibold text-gray-200">{ticket.price === 0 ? 'Free' : `₹${ticket.price}`}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{ticket.description}</p>
                        <span className="text-xs text-gray-400">Available: {ticket.availableQuantity} / {ticket.quantity}</span>
                        {currentUserId && event.organizer && currentUserId === event.organizer._id ? (
                          <div className="mt-3 px-6 py-2 bg-gray-600 text-gray-300 font-bold rounded-lg text-center">
                            You are the organizer
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBuyTickets(ticket)}
                            className="mt-3 px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-lg shadow hover:from-yellow-500 hover:to-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                          >
                            Buy Ticket
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                currentUserId && event.organizer && currentUserId === event.organizer._id ? (
                  <div className="mt-8 px-8 py-3 bg-gray-700/70 text-gray-300 font-bold rounded-2xl text-center">
                    You are the organizer of this event
                  </div>
                ) : (
                  <button
                    onClick={handleFreeRegister}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-2xl shadow hover:from-yellow-500 hover:to-yellow-600 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                  >
                    Register for Free
                  </button>
                )
              )}
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow flex flex-col gap-2">
                <h3 className="text-lg font-bold text-yellow-400 mb-2">Venue & Location</h3>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-yellow-400" />
                  <span className="text-gray-300">{event.location}</span>
                </div>
                {event.address && event.address.city && (
                  <div className="text-gray-400 text-sm">{event.address.city}, {event.address.state}</div>
                )}
                {event.location && event.location.toLowerCase() !== 'online' && event.coordinates && event.coordinates.coordinates && (
                  <div className="mt-4">
                    <MapComponent
                      events={[event]}
                      userLocation={userLocation}
                      height="200px"
                    />
                  </div>
                )}
              </div>
              {event.organizer && (
                <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">Organizer</h3>
                  <div className="text-gray-300 font-semibold">{event.organizer.name}</div>
                  <div className="text-gray-400 text-sm">{event.organizer.email}</div>
                  {event.organizer.college && <div className="text-gray-400 text-sm">{event.organizer.college}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}