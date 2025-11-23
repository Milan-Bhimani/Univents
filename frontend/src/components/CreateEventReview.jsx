import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { FaTicketAlt } from 'react-icons/fa';
import { getEventImage } from '../utils/eventImages';
import BackButton from './BackButton';

const CreateEventReview = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tempEventData = localStorage.getItem('tempEventData');
    if (!tempEventData) {
      navigate('/create-event/edit');
      return;
    }
    try {
      setEventData(JSON.parse(tempEventData));
    } catch (err) {
      setError('Failed to load event data');
    }
  }, [navigate]);

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError('');
    const API_URL = 'https://univents-764n.onrender.com/api';
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to publish event');

  
      
      const createResponse = await fetch(`${API_URL}/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      
      
      if (!createResponse.ok) {
        const text = await createResponse.text();
        console.error('Create event error response:', text);
        try {
          const data = JSON.parse(text);
          throw new Error(data.message || 'Failed to create event');
        } catch (e) {
          throw new Error(`Server error (${createResponse.status}) - unable to create event`);
        }
      }

      const eventResult = await createResponse.json();
      

      // Safety check for eventResult.data and eventResult.data._id
      if (!eventResult.data || !eventResult.data._id) {
        throw new Error('Event creation failed: No event ID returned from server.');
      }

      // Add a 2-second delay before fetching/publishing the event
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Debug: Fetch the event by ID after creation
      const fetchResponse = await fetch(`${API_URL}/events/${eventResult.data._id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const fetchResult = await fetchResponse.json();
      

      // No need to publish event, as it is already published on creation
      localStorage.removeItem('tempEventData');
      navigate(`/events/${eventResult.data._id}`);

    } catch (err) {
      console.error('Final error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!eventData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-20 relative">
      <BackButton />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-yellow-400 text-center mb-2 drop-shadow-lg tracking-wide">Review Your Event</h1>
        <p className="text-gray-400 text-center mb-12 text-lg">Review all details before publishing your event</p>
        
        {/* Progress Bar */}
        <div className="flex items-center w-full mb-12">
          <div className="flex-1">
            <div className="flex-1 flex items-center">
              <div className="flex-1 flex items-center">
                <div className="w-full h-2 bg-gray-600 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-600 border-4 border-gray-700 rounded-full flex items-center justify-center ml-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-full h-2 bg-gray-600 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-600 border-4 border-gray-700 rounded-full flex items-center justify-center ml-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-full h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-8 h-8 bg-yellow-400 border-4 border-gray-800 rounded-full flex items-center justify-center ml-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-between mt-4">
              <span className="text-gray-400 font-semibold text-lg">Event Details</span>
              <span className="text-gray-400 font-semibold text-lg">Ticketing</span>
              <span className="text-yellow-400 font-bold text-lg">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-700/30 shadow-2xl">
          {/* Event Image */}
          <div className="relative h-80 mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={getEventImage(eventData.category)}
              alt="Event Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-base font-bold shadow-lg">
                {eventData.category?.charAt(0).toUpperCase() + eventData.category?.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-yellow-400 mb-4">{eventData.title}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{eventData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4 bg-gray-700/50 p-6 rounded-xl border border-gray-600/30">
                <IoCalendarOutline className="text-3xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm font-semibold">Date</div>
                  <div className="text-white text-lg font-bold">{new Date(eventData.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-700/50 p-6 rounded-xl border border-gray-600/30">
                <IoTimeOutline className="text-3xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm font-semibold">Time</div>
                  <div className="text-white text-lg font-bold">{eventData.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-gray-700/50 p-6 rounded-xl border border-gray-600/30">
                <IoLocationOutline className="text-3xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm font-semibold">Location</div>
                  <div className="text-white text-lg font-bold">{eventData.location}</div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eventData.interests && eventData.interests.length > 0 && (
                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4">Interests</h4>
                  <div className="flex flex-wrap gap-3">
                    {eventData.interests.map((interest, index) => (
                      <span key={index} className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-base font-semibold border border-yellow-400/30">
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {eventData.tags && eventData.tags.length > 0 && (
                <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-3">
                    {eventData.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-600 text-gray-300 px-4 py-2 rounded-full text-base font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {eventData.difficulty && (
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                <h4 className="text-xl font-bold text-yellow-400 mb-4">Difficulty Level</h4>
                <span className={`px-6 py-3 rounded-xl text-base font-bold ${
                  eventData.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                  eventData.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                  'bg-red-500/20 text-red-400 border border-red-400/30'
                }`}>
                  {eventData.difficulty.charAt(0).toUpperCase() + eventData.difficulty.slice(1)}
                </span>
              </div>
            )}

            {eventData.prerequisites && eventData.prerequisites.length > 0 && (
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                <h4 className="text-xl font-bold text-yellow-400 mb-4">Prerequisites</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg">
                  {eventData.prerequisites.map((prereq, index) => (
                    <li key={index} className="font-semibold">{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {eventData.isTicketed && eventData.tickets && eventData.tickets.length > 0 && (
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-6">
                  <FaTicketAlt className="text-2xl text-yellow-400" />
                  <h4 className="text-xl font-bold text-white">Ticket Information</h4>
                </div>
                <div className="space-y-4">
                  {eventData.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl border border-gray-600/30">
                      <div>
                        <h5 className="text-white font-bold text-lg">{ticket.name}</h5>
                        <p className="text-gray-400 text-base">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-xl">₹{ticket.price}</div>
                        <div className="text-gray-400 text-base font-semibold">{ticket.quantity} available</div>
                      </div>
                    </div>
                  ))}
                  {eventData.ticketSale && (
                    <div className="text-base text-gray-400 mt-4 font-semibold">
                      Sale period: {new Date(eventData.ticketSale.startDate).toLocaleDateString()} - {new Date(eventData.ticketSale.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 text-red-400 text-lg bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 font-semibold">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-700/50">
          <button
            onClick={() => navigate('/create-event/ticket')}
            className="px-8 py-3 text-white bg-gray-700/80 rounded-xl font-bold hover:bg-gray-600/80 transition-all border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Back
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 ${
              isSubmitting ? 
              'bg-yellow-400/50 text-gray-700 cursor-not-allowed' : 
              'bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-xl'
            }`}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventReview;