import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaClock, FaDollarSign, FaExclamationTriangle, FaReceipt } from 'react-icons/fa';
import BackButton from './BackButton';

export default function TicketHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tickets/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch tickets');
        }

        setTickets(data.tickets);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading your tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <BackButton />
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/20 rounded-full mb-4">
            <FaReceipt className="text-3xl text-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-yellow-400 mb-4 drop-shadow-lg tracking-wide">
            My Ticket History
          </h1>
          <p className="text-gray-400 text-lg">
            View all your purchased event tickets
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center gap-2 mb-8 max-w-2xl mx-auto">
            <FaExclamationTriangle />
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="bg-gray-800/40 backdrop-blur-lg rounded-3xl p-12 border border-gray-700/30 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-700/50 rounded-full mb-6">
              <FaTicketAlt className="text-3xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">No Tickets Yet</h2>
            <p className="text-gray-400 text-lg mb-8">
              You haven't purchased any event tickets yet. Start exploring events to get your first ticket!
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Events
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{tickets.length}</div>
                  <div className="text-gray-400 text-sm">Total Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    ${tickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {new Set(tickets.map(t => t.event.title)).size}
                  </div>
                  <div className="text-gray-400 text-sm">Unique Events</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {tickets.map((ticket, index) => (
                <div 
                  key={ticket._id} 
                  className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 mb-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-yellow-400/20 p-6 rounded-2xl border border-yellow-400/30">
                        <FaTicketAlt className="text-yellow-400 text-3xl" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{ticket.event.title}</h3>
                          <div className="inline-block bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                            Ticket #{ticket.ticketNumber || `TKT-${index + 1}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400">
                            ${ticket.amount || '0.00'}
                          </div>
                          <div className="text-gray-400 text-sm">Amount Paid</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                          <FaCalendarAlt className="text-yellow-400 text-lg" />
                          <div>
                            <div className="text-white font-semibold">
                              {new Date(ticket.event.date).toLocaleDateString()}
                            </div>
                            <div className="text-gray-400 text-sm">Event Date</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                          <FaMapMarkerAlt className="text-yellow-400 text-lg" />
                          <div>
                            <div className="text-white font-semibold">
                              {ticket.event.location || 'Location TBD'}
                            </div>
                            <div className="text-gray-400 text-sm">Venue</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl">
                          <FaClock className="text-yellow-400 text-lg" />
                          <div>
                            <div className="text-white font-semibold">
                              {new Date(ticket.purchaseDate).toLocaleDateString()}
                            </div>
                            <div className="text-gray-400 text-sm">Purchase Date</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        {ticket.event.category && (
                          <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                            {ticket.event.category}
                          </span>
                        )}
                        {ticket.event.organizer && (
                          <span className="bg-gray-700/50 px-3 py-1 rounded-full">
                            Organized by {ticket.event.organizer.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}