import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
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
      <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 pt-24">
      <BackButton />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">My Tickets</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>You haven't purchased any tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400/10 p-4 rounded-lg">
                    <FaTicketAlt className="text-yellow-400 text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{ticket.event.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-yellow-400">
                        <FaCalendarAlt className="mr-2" />
                        <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{ticket.event.location}</span>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <FaTicketAlt className="mr-2" />
                        <span>Ticket #{ticket.ticketNumber}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Purchase Date: {new Date(ticket.purchaseDate).toLocaleDateString()}</span>
                      <span className="text-yellow-400 font-semibold">Amount Paid: ${ticket.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}