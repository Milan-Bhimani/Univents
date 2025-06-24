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
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative'>
      <BackButton />
      
      <h1 className="text-3xl font-semibold text-amber-400 text-center mt-5 mb-8">Create a new Event</h1>
      
      {/* Progress Bar */}
      <div className="flex items-center w-full max-w-5xl mx-auto mb-8">
        <div className="flex-1">
          <div className="flex-1 flex items-center">
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-yellow-400"></div>
              <div className="w-6 h-6 bg-yellow-400 border-2 border-gray-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-600"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-full h-1 bg-gray-600"></div>
              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-between mt-2">
            <span className="text-yellow-400 font-semibold">Event Details</span>
            <span className="text-gray-300">Ticketing</span>
            <span className="text-gray-300">Review</span>
          </div>
        </div>
      </div>

      {/* Event Form */}
      <div className="max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl backdrop-blur-sm border border-gray-700/30">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Event Title *</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title" 
                  className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Event Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
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

            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium">Event Description *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event in detail" 
                className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl h-32 focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">Date & Time</h2>
            
            <div className="flex items-center space-x-6">
              <label className="flex items-center text-white">
                <input 
                  type="radio" 
                  name="eventType" 
                  value="single"
                  checked={eventType === 'single'}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mr-2" 
                />
                Single Event
              </label>
              <label className="flex items-center text-white">
                <input 
                  type="radio" 
                  name="eventType" 
                  value="recurring"
                  checked={eventType === 'recurring'}
                  onChange={(e) => setEventType(e.target.value)}
                  className="mr-2" 
                />
                Recurring Event
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Start Date & Time *</label>
                <DatePicker
                  selected={formData.startDateTime}
                  onChange={(date) => setFormData({ ...formData, startDateTime: date })}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="Select start date and time"
                  className="w-full p-3 border border-gray-600 rounded-xl text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">End Date & Time *</label>
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
                  className="w-full p-3 border border-gray-600 rounded-xl text-white bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">Location</h2>
            
            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium">Event Type *</label>
              <select 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                required
              >
                <option value="Physical Location" className="bg-gray-800">Physical Location</option>
                <option value="Online" className="bg-gray-800">Online Event</option>
              </select>
            </div>

            {formData.location === 'Physical Location' && (
              <div className="space-y-4">
                <label className="block text-yellow-400/90 font-medium">Select Event Location *</label>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={formData.coordinates ? {
                    lat: formData.coordinates.coordinates[1],
                    lng: formData.coordinates.coordinates[0]
                  } : null}
                />
                {formData.venue && (
                  <div className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-gray-300 text-sm">Selected: {formData.venue}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-amber-400">Additional Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Interests</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableInterests.map((interest) => (
                    <label key={interest} className="flex items-center text-white text-sm bg-gray-700/30 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="mr-2"
                      />
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-yellow-400/90 font-medium">Tags</label>
                  <input
                    type="text"
                    placeholder="Enter tags separated by commas"
                    onChange={handleTagsChange}
                    className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-yellow-400/90 font-medium">Prerequisites</label>
                  <input
                    type="text"
                    placeholder="Enter prerequisites separated by commas"
                    onChange={handlePrerequisitesChange}
                    className="w-full p-3 border border-gray-600 text-white bg-gray-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:border-yellow-400/30 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Continue to Ticketing'}
            </button>
          </div>
        </form>
      </div>                     
    </div>
  );
};

export default CreateEventEdit;