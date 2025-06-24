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
    const API_URL = 'http://localhost:5000/api';
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to publish event');

      console.log('Creating event with data:', eventData);
      
      const createResponse = await fetch(`${API_URL}/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      console.log('Create event response status:', createResponse.status);
      
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
      console.log('Event created successfully:', eventResult);

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
      console.log('Fetched event after creation:', fetchResult);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative">
      <BackButton />
      
      {/* Progress Bar */}
      <div className="flex items-center w-full max-w-5xl mx-auto mt-10 mb-8">
        <div className="flex-1">
          <div className="flex-1 flex items-center">
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-300"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-300"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-yellow-400"></div>
              <div className="w-6 h-6 bg-yellow-400 border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-between mt-2">
            <span className="text-gray-400">Event Details</span>
            <span className="text-gray-400">Ticketing</span>
            <span className="text-yellow-400 font-semibold">Review</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-amber-400 mb-8">Review Your Event</h2>

        <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
          {/* Event Image */}
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <img
              src={getEventImage(eventData.category)}
              alt="Event Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                {eventData.category?.charAt(0).toUpperCase() + eventData.category?.slice(1)}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{eventData.title}</h3>
              <p className="text-gray-300">{eventData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg">
                <IoCalendarOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Date</div>
                  <div className="text-white">{new Date(eventData.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg">
                <IoTimeOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Time</div>
                  <div className="text-white">{eventData.time}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-gray-700/50 p-4 rounded-lg">
                <IoLocationOutline className="text-2xl text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-sm">Location</div>
                  <div className="text-white">{eventData.location}</div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventData.interests && eventData.interests.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.interests.map((interest, index) => (
                      <span key={index} className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {eventData.tags && eventData.tags.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {eventData.difficulty && (
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Difficulty Level</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  eventData.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                  eventData.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {eventData.difficulty.charAt(0).toUpperCase() + eventData.difficulty.slice(1)}
                </span>
              </div>
            )}

            {eventData.prerequisites && eventData.prerequisites.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-2">Prerequisites</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {eventData.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
              </div>
            )}

            {eventData.isTicketed && eventData.tickets && eventData.tickets.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <FaTicketAlt className="text-yellow-400" />
                  <h4 className="text-lg font-semibold text-white">Ticket Information</h4>
                </div>
                <div className="space-y-4">
                  {eventData.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <h5 className="text-white font-medium">{ticket.name}</h5>
                        <p className="text-gray-400 text-sm">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-semibold">₹{ticket.price}</div>
                        <div className="text-gray-400 text-sm">{ticket.quantity} available</div>
                      </div>
                    </div>
                  ))}
                  {eventData.ticketSale && (
                    <div className="text-sm text-gray-400 mt-2">
                      Sale period: {new Date(eventData.ticketSale.startDate).toLocaleDateString()} - {new Date(eventData.ticketSale.endDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex justify-end items-center mt-8 gap-4">
          <button
            onClick={() => navigate('/create-event/ticket')}
            className="px-6 py-2 text-white bg-gray-700 rounded-xl font-medium hover:bg-gray-600 transition-all"
          >
            Back
          </button>
          <button
            onClick={handlePublish}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${isSubmitting ? 'bg-yellow-400/50 text-gray-700 cursor-not-allowed' : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'}`}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventReview;