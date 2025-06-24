import { FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import BackButton from './BackButton';
import PaymentModal from './PaymentModal';
import MapComponent from './MapComponent';
import { getEventImage } from '../utils/eventImages';

export default function EventPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchEvent();
    getUserLocation();
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
          console.log('Location access denied or unavailable');
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

      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Event fetch response:', data);

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
    setSelectedTicket(ticket);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Record the ticket purchase
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${id}/purchase-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId: selectedTicket._id,
          paymentIntentId: paymentIntent.id,
          amount: selectedTicket.price
        })
      });

      if (response.ok) {
        alert('Ticket purchased successfully!');
        fetchEvent(); // Refresh event data
      }
    } catch (error) {
      console.error('Error recording ticket purchase:', error);
    }
  };

  const handleRegisterForEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to register for events');
      }

      const response = await fetch(`http://localhost:5000/api/events/${id}/register`, {
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

      // Refresh event data to show updated registration
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 pt-32">
      <BackButton />
      {/* Map Section at the top, outside the card */}
      {event.coordinates &&
        Array.isArray(event.coordinates.coordinates) &&
        typeof event.coordinates.coordinates[0] === 'number' &&
        typeof event.coordinates.coordinates[1] === 'number' &&
        !isNaN(event.coordinates.coordinates[0]) &&
        !isNaN(event.coordinates.coordinates[1]) && (
          <div className="mb-8 w-full max-w-4xl mt-0">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              Event Location
            </h3>
            <MapComponent
              events={[event]}
              userLocation={userLocation}
              height="300px"
            />
          </div>
      )}

      <div className="w-full max-w-6xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 mt-4">
          {/* Event Image */}
          <div className="relative h-96 overflow-hidden">
            <img 
              src={getEventImage(event.category)}
              alt="Event Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-900 opacity-90"></div>
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold">
                {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : 'Event'}
              </span>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-8 -mt-20 relative">
            <h2 className="text-4xl font-bold text-white mb-4">{event.title}</h2>
            <p className="text-gray-300 text-lg mb-6">
              {event.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3 bg-gray-700 p-4 rounded-lg">
                <IoCalendarOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Date</div>
                  <div className="text-white">{new Date(event.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-700 p-4 rounded-lg">
                <IoTimeOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Time</div>
                  <div className="text-white">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-700 p-4 rounded-lg">
                <IoLocationOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white">{event.location}</div>
                </div>
              </div>
            </div>

            {/* Event Tags and Interests */}
            {(event.tags && event.tags.length > 0) || (event.interests && event.interests.length > 0) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Tags & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags && event.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                  {event.interests && event.interests.map((interest, index) => (
                    <span key={index} className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty and Prerequisites */}
            {(event.difficulty || (event.prerequisites && event.prerequisites.length > 0)) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Event Details</h3>
                {event.difficulty && (
                  <div className="mb-2">
                    <span className="text-gray-400">Difficulty: </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      event.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      event.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
                    </span>
                  </div>
                )}
                {event.prerequisites && event.prerequisites.length > 0 && (
                  <div>
                    <span className="text-gray-400">Prerequisites: </span>
                    <span className="text-gray-300">{event.prerequisites.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ticketing Information */}
            {event.isTicketed && event.tickets && event.tickets.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Available Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.tickets.map((ticket, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{ticket.name}</h4>
                          {ticket.description && (
                            <p className="text-gray-400 text-sm">{ticket.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold text-lg">
                            {ticket.price ? `₹${ticket.price}` : 'Free'}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {ticket.availableQuantity || 0} available
                          </div>
                        </div>
                      </div>
                      {ticket.price > 0 && (
                        <button
                          onClick={() => handleBuyTickets(ticket)}
                          className="w-full bg-yellow-400 text-gray-900 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                        >
                          Buy Ticket
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center space-x-2 text-gray-400">
                <IoCalendarOutline className="text-xl" />
                <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <span>{event.registeredParticipants?.length || 0} registered</span>
              </div>
              {event.views && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <span>{event.views} views</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {/* <div className="p-8 border-t border-gray-700 bg-gray-800 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold mb-1">Organized by</h3>
              <p className="text-gray-400">{event.organizer?.name || 'Unknown Organizer'}</p>
              {event.organizer?.college && (
                <p className="text-gray-500 text-sm">{event.organizer.college}</p>
              )}
            </div>
            
            <div className="flex space-x-4">
              {event.isTicketed && event.tickets && event.tickets.some(t => t.price > 0) ? (
                <button 
                  onClick={() => handleBuyTickets(event.tickets.find(t => t.price > 0))}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                >
                  <FaTicketAlt />
                  <span>Buy Tickets</span>
                </button>
              ) : (
                <button 
                  onClick={handleRegisterForEvent}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg flex items-center space-x-2 transform hover:scale-105 transition-all duration-200"
                >
                  <span>Register for Free</span>
                </button>
              )}
            </div>
          </div> */}

          {/* Error Display */}
          {purchaseError && (
            <div className="p-4 bg-red-500/10 border-t border-red-500/20 text-red-400">
              {purchaseError}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={selectedTicket?.price || 0}
        eventTitle={event.title}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}