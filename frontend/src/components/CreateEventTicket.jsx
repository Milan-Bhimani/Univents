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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">


      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-amber-400 mb-8">What type of Event are you running?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${isTicketed ? 'border-yellow-400 bg-yellow-400/5' : 'border-gray-700 hover:border-yellow-400/50'}`}
            onClick={() => setIsTicketed(true)}
          >
            <HiMiniBanknotes className="text-4xl text-yellow-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Ticketed Event</h3>
            <p className="text-gray-400 text-center">My event requires tickets for entry</p>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${!isTicketed ? 'border-yellow-400 bg-yellow-400/5' : 'border-gray-700 hover:border-yellow-400/50'}`}
            onClick={() => setIsTicketed(false)}
          >
            <TbNotesOff className="text-4xl text-yellow-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Free Event</h3>
            <p className="text-gray-400 text-center">I'm running a free event</p>
          </button>
        </div>

        {isTicketed && (
          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg border border-gray-700/30">
            <h3 className="text-xl font-semibold text-yellow-400 mb-6">Ticket Information</h3>

            <div className="space-y-6">
              {tickets.map((ticket, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-gray-800/50">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Ticket Name*</label>
                      <input
                        type="text"
                        placeholder="e.g., General Admission"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                        value={ticket.name}
                        onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)*</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Quantity Available*</label>
                      <input
                        type="number"
                        placeholder="100"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="Ticket description or perks"
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 md:col-span-2">
                    <button
                      onClick={() => handleDeleteTicket(index)}
                      disabled={tickets.length === 1}
                      className={`p-2 rounded-lg transition-all ${tickets.length === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-red-400 hover:bg-red-400/10'}`}
                    >
                      <MdDelete size={20} />
                    </button>
                    {index === tickets.length - 1 && (
                      <button
                        onClick={handleAddTicket}
                        className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all"
                      >
                        <IoAddOutline size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sale Start Date*</label>
                  <DatePicker
                    selected={saleStart}
                    onChange={(date) => setSaleStart(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select start date and time"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sale End Date*</label>
                  <DatePicker
                    selected={saleEnd}
                    onChange={(date) => setSaleEnd(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select end date and time"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400/50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <div className="flex justify-end items-center mt-8 gap-4">
          <button
            onClick={() => navigate('/create-event/banner')}
            className="px-6 py-2 text-white bg-gray-700 rounded-xl font-medium hover:bg-gray-600 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${isSubmitting ? 'bg-yellow-400/50 text-gray-700 cursor-not-allowed' : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'}`}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventTicket;