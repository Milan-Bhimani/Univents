import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMiniBanknotes } from 'react-icons/hi2';
import { TbNotesOff } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { IoAddOutline } from 'react-icons/io5';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateEventTicket = () => {
  const navigate = useNavigate();
  const [isTicketed, setIsTicketed] = useState(false);
  const [tickets, setTickets] = useState([{ name: '', price: '', quantity: '', description: '' }]);
  const [saleStart, setSaleStart] = useState(new Date());
  const [saleEnd, setSaleEnd] = useState(new Date());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTicket = () => {
    setTickets([...tickets, { name: '', price: '', quantity: '', description: '' }]);
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  const handleDeleteTicket = (index) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (isTicketed) {
      // Validate ticket information
      for (const ticket of tickets) {
        if (!ticket.name || !ticket.quantity || (ticket.price === '' && isTicketed)) {
          setError('Please fill in all required ticket fields');
          return false;
        }
        if (isTicketed && (isNaN(ticket.price) || Number(ticket.price) < 0)) {
          setError('Ticket price must be a valid positive number');
          return false;
        }
        if (isNaN(ticket.quantity) || Number(ticket.quantity) < 1) {
          setError('Ticket quantity must be at least 1');
          return false;
        }
      }

      // Validate sale duration
      if (!saleStart || !saleEnd) {
        setError('Please set ticket sale duration');
        return false;
      }
      if (new Date(saleStart) >= new Date(saleEnd)) {
        setError('Sale end date must be after sale start date');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const eventData = JSON.parse(localStorage.getItem('tempEventData'));
      eventData.isTicketed = isTicketed;
      eventData.tickets = tickets;
      if (isTicketed) {
        eventData.ticketSale = {
          startDate: saleStart,
          endDate: saleEnd
        };
      }
      localStorage.setItem('tempEventData', JSON.stringify(eventData));
      navigate('/create-event/review');
    } catch (err) {
      setError('Failed to save ticket information');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 pt-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-yellow-400 text-center mb-2 drop-shadow-lg tracking-wide">Event Ticketing</h1>
        <p className="text-gray-400 text-center mb-12 text-lg">Choose whether your event requires tickets or is free to attend</p>
        
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
            </div>
            
            <div className="flex-1 flex items-center justify-between mt-4">
              <span className="text-gray-400 font-semibold text-lg">Event Details</span>
              <span className="text-yellow-400 font-bold text-lg">Ticketing</span>
              <span className="text-gray-400 font-semibold text-lg">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-gray-700/30 shadow-2xl">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 border-b border-gray-700/50 pb-4">What type of Event are you running?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <button
              className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all hover:shadow-lg ${
                isTicketed ? 
                'border-yellow-400 bg-yellow-400/10 shadow-yellow-400/20' : 
                'border-gray-700 hover:border-yellow-400/50 bg-gray-700/30'
              }`}
              onClick={() => setIsTicketed(true)}
            >
              <HiMiniBanknotes className="text-5xl text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Ticketed Event</h3>
              <p className="text-gray-400 text-center text-lg">My event requires tickets for entry</p>
            </button>

            <button
              className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all hover:shadow-lg ${
                !isTicketed ? 
                'border-yellow-400 bg-yellow-400/10 shadow-yellow-400/20' : 
                'border-gray-700 hover:border-yellow-400/50 bg-gray-700/30'
              }`}
              onClick={() => setIsTicketed(false)}
            >
              <TbNotesOff className="text-5xl text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Free Event</h3>
              <p className="text-gray-400 text-center text-lg">I'm running a free event</p>
            </button>
          </div>

          {isTicketed && (
            <div className="bg-gray-700/30 rounded-2xl p-8 border border-gray-600/30">
              <h3 className="text-2xl font-bold text-yellow-400 mb-8 border-b border-gray-600/50 pb-4">Ticket Information</h3>

              <div className="space-y-8">
                {tickets.map((ticket, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-bold text-white">Ticket #{index + 1}</h4>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDeleteTicket(index)}
                          disabled={tickets.length === 1}
                          className={`p-2 rounded-lg transition-all ${
                            tickets.length === 1 ? 
                            'text-gray-600 cursor-not-allowed' : 
                            'text-red-400 hover:bg-red-400/10 hover:shadow-lg'
                          }`}
                        >
                          <MdDelete size={24} />
                        </button>
                        {index === tickets.length - 1 && (
                          <button
                            onClick={handleAddTicket}
                            className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all hover:shadow-lg"
                          >
                            <IoAddOutline size={24} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-yellow-400 font-bold text-lg mb-2">Ticket Name*</label>
                          <input
                            type="text"
                            placeholder="e.g., General Admission"
                            className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                            value={ticket.name}
                            onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-yellow-400 font-bold text-lg mb-2">Price (₹)*</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-yellow-400 font-bold text-lg mb-2">Quantity Available*</label>
                          <input
                            type="number"
                            placeholder="100"
                            className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-yellow-400 font-bold text-lg mb-2">Description</label>
                          <input
                            type="text"
                            placeholder="Ticket description or perks"
                            className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                            value={ticket.description}
                            onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
                  <h4 className="text-xl font-bold text-yellow-400 mb-6">Ticket Sale Period</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-yellow-400 font-bold text-lg mb-2">Sale Start Date*</label>
                      <DatePicker
                        selected={saleStart}
                        onChange={(date) => setSaleStart(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="Select start date and time"
                        className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-400 font-bold text-lg mb-2">Sale End Date*</label>
                      <DatePicker
                        selected={saleEnd}
                        onChange={(date) => setSaleEnd(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="Select end date and time"
                        className="w-full p-4 border-2 border-gray-600 text-white bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/30 transition-all text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 text-red-400 text-lg bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 font-semibold">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-700/50">
            <button
              onClick={() => navigate('/create-event/edit')}
              className="px-8 py-3 text-white bg-gray-700/80 rounded-xl font-bold hover:bg-gray-600/80 transition-all border border-gray-600/30 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 ${
                isSubmitting ? 
                'bg-yellow-400/50 text-gray-700 cursor-not-allowed' : 
                'bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-xl'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Continue to Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventTicket;