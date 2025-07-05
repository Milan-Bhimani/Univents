import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import BackButton from './BackButton';

const CreateEventEdit = () => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState('single');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    location: 'Physical Location',
    address: '',
    description: '',
    interests: [],
    difficulty: 'beginner',
    prerequisites: [],
    tags: [],
    coordinates: null,
    venue: ''
  });

  const eventCategories = [
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'networking', label: 'Networking' },
    { value: 'competition', label: 'Competition' }
  ];

  const availableInterests = [
    'technology', 'business', 'design', 'marketing', 'science', 
    'arts', 'sports', 'health', 'education', 'networking'
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prevState => ({
      ...prevState,
      interests: prevState.interests.includes(interest)
        ? prevState.interests.filter(i => i !== interest)
        : [...prevState.interests, interest]
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prevState => ({
      ...prevState,
      tags
    }));
  };

  const handlePrerequisitesChange = (e) => {
    const prerequisites = e.target.value.split(',').map(prereq => prereq.trim()).filter(prereq => prereq);
    setFormData(prevState => ({
      ...prevState,
      prerequisites
    }));
  };

  const handleLocationSelect = (locationData) => {
    setFormData(prevState => ({
      ...prevState,
      coordinates: {
        type: 'Point',
        coordinates: locationData.coordinates
      },
      address: locationData.address,
      venue: locationData.venue
    }));
  };

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please login to create an event');
      return;
    }

    if (!formData.title || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.location === 'Physical Location' && !formData.coordinates) {
      setError('Please select a location on the map');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      // Set coordinates for online events
      let coordinates = formData.coordinates;
      if (formData.location === 'Online') {
        coordinates = {
          type: 'Point',
          coordinates: [0, 0] // Default coordinates for online events
        };
      }

      // Format and store event data in localStorage
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.startDateTime.toISOString().split('T')[0],
        time: formData.startDateTime.toTimeString().split(' ')[0],
        endDate: formData.endDateTime.toISOString().split('T')[0],
        endTime: formData.endDateTime.toTimeString().split(' ')[0],
        location: formData.location === 'Physical Location' ? formData.venue : formData.location,
        coordinates: coordinates,
        address: formData.location === 'Physical Location' ? {
          street: formData.address,
          city: 'Unknown',
          state: 'Unknown',
          zipCode: 'Unknown',
          country: 'USA'
        } : null,
        venue: formData.venue,
        category: formData.category,
        eventType: eventType,
        interests: formData.interests,
        difficulty: formData.difficulty,
        prerequisites: formData.prerequisites,
        tags: formData.tags,
        isTicketed: false,
        tickets: [],
        status: 'draft',
        published: false
      };

      // Store event data in localStorage for multi-page form
      localStorage.setItem('tempEventData', JSON.stringify(eventData));
      
      // Navigate to ticket page for next step
      navigate('/create-event/ticket');
    } catch (error) {
      console.error('Error storing event data:', error);
      setError('Failed to save event details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-20 relative'>
      <BackButton />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-yellow-400 text-center mb-2 drop-shadow-lg tracking-wide">Create a New Event</h1>
        <p className="text-gray-400 text-center mb-12 text-lg">Fill in the details below to create your event</p>
        
        {/* Progress Bar */}
        <div className="flex items-center w-full mb-12">
          <div className="flex-1">
            <div className="flex-1 flex items-center">
              <div className="flex-1 flex items-center">
                <div className="w-full h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-8 h-8 bg-yellow-400 border-4 border-gray-800 rounded-full flex items-center justify-center ml-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>
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
            </div>
            
            <div className="flex-1 flex items-center justify-between mt-4">
              <span className="text-yellow-400 font-bold text-lg">Event Details</span>
              <span className="text-gray-400 font-semibold text-lg">Ticketing</span>
              <span className="text-gray-400 font-semibold text-lg">Review</span>
            </div>
          </div>
        </div>

        {/* Event Form */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-700/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Basic Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-yellow-400 border-b border-gray-700/50 pb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-yellow-400 font-bold text-lg">Event Title *</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title" 
                    className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg" 
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-yellow-400 font-bold text-lg">Event Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                    required
                  >
                    <option value="" className="bg-gray-800">Select Category</option>
                    {eventCategories.map((category) => (
                      <option key={category.value} value={category.value} className="bg-gray-800">
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-yellow-400 font-bold text-lg">Event Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event in detail" 
                  className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl h-40 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg resize-none"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-yellow-400 font-bold text-lg">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-yellow-400 border-b border-gray-700/50 pb-4">Date & Time</h2>
              
              <div className="flex items-center space-x-8 mb-6">
                <label className="flex items-center text-white text-lg font-semibold">
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="single"
                    checked={eventType === 'single'}
                    onChange={(e) => setEventType(e.target.value)}
                    className="mr-3 w-5 h-5 text-yellow-400 bg-gray-700 border-gray-600 focus:ring-yellow-400 focus:ring-2" 
                  />
                  Single Event
                </label>
                <label className="flex items-center text-white text-lg font-semibold">
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="recurring"
                    checked={eventType === 'recurring'}
                    onChange={(e) => setEventType(e.target.value)}
                    className="mr-3 w-5 h-5 text-yellow-400 bg-gray-700 border-gray-600 focus:ring-yellow-400 focus:ring-2" 
                  />
                  Recurring Event
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-yellow-400 font-bold text-lg">Start Date & Time *</label>
                  <DatePicker
                    selected={formData.startDateTime}
                    onChange={(date) => setFormData({ ...formData, startDateTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select start date and time"
                    className="w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-yellow-400 font-bold text-lg">End Date & Time *</label>
                  <DatePicker
                    selected={formData.endDateTime}
                    onChange={(date) => setFormData({ ...formData, endDateTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={formData.startDateTime}
                    placeholderText="Select end date and time"
                    className="w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-yellow-400 border-b border-gray-700/50 pb-4">Location</h2>
              
              <div className="space-y-3">
                <label className="block text-yellow-400 font-bold text-lg">Event Type *</label>
                <select 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                  required
                >
                  <option value="Physical Location" className="bg-gray-800">Physical Location</option>
                  <option value="Online" className="bg-gray-800">Online Event</option>
                </select>
              </div>

              {formData.location === 'Physical Location' && (
                <div className="space-y-6">
                  <label className="block text-yellow-400 font-bold text-lg">Select Event Location *</label>
                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                    <LocationPicker
                      onLocationSelect={handleLocationSelect}
                      initialLocation={formData.coordinates ? {
                        lat: formData.coordinates.coordinates[1],
                        lng: formData.coordinates.coordinates[0]
                      } : null}
                    />
                  </div>
                  {formData.venue && (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-xl">
                      <p className="text-yellow-400 font-semibold">Selected: {formData.venue}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-yellow-400 border-b border-gray-700/50 pb-4">Additional Information</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="block text-yellow-400 font-bold text-lg">Interests</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {availableInterests.map((interest) => (
                      <label key={interest} className="flex items-center text-white text-base bg-gray-700/50 p-3 rounded-xl hover:bg-gray-700/70 transition-all cursor-pointer border border-gray-600/30 hover:border-yellow-400/50">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="mr-3 w-4 h-4 text-yellow-400 bg-gray-700 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2"
                        />
                        {interest.charAt(0).toUpperCase() + interest.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-yellow-400 font-bold text-lg">Tags</label>
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      onChange={handleTagsChange}
                      className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-yellow-400 font-bold text-lg">Prerequisites</label>
                    <input
                      type="text"
                      placeholder="Enter prerequisites separated by commas"
                      onChange={handlePrerequisitesChange}
                      className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-lg bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 font-semibold">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-8">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 text-gray-900 bg-yellow-400 rounded-xl hover:bg-yellow-500 transition-all font-bold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Continue to Ticketing'}
              </button>
            </div>
          </form>
        </div>
      </div>                     
    </div>
  );
};

export default CreateEventEdit;