import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const EventAnalysis = () => {
  const { eventId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`https://univents-764n.onrender.com/api/events/${eventId}/analysis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAnalysis(data);
        } else {
          setError(data.message || 'Failed to fetch event analysis');
        }
      } catch (err) {
        setError('Failed to fetch event analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [eventId]);

  const handleDelete = async () => {
    console.log('Delete button clicked for event:', eventId);
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      console.log('Making DELETE request to:', `https://univents-764n.onrender.com/api/events/${eventId}`);
      const res = await fetch(`https://univents-764n.onrender.com/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log('Delete response:', data);
      if (data.success) {
        alert('Event deleted successfully.');
        navigate('/your-events');
      } else {
        alert(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-6xl mx-auto">
        <Link to="/your-events" className="text-yellow-400 hover:underline mb-8 inline-block text-lg font-semibold">← Back to Your Events</Link>
        {loading && <div className="text-center text-yellow-400 py-8 animate-pulse">Loading event analysis...</div>}
        {error && <div className="text-center text-red-400 py-8">{error}</div>}
        {!loading && !error && analysis && (
          <div className="bg-gray-900/80 rounded-2xl p-10 border border-gray-700/40 shadow-2xl text-gray-300 relative">
            <button
              onClick={handleDelete}
              className="absolute top-8 right-8 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-all text-base border-2 border-red-700/40 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 z-10 cursor-pointer"
              style={{ zIndex: 1000 }}
            >
              Delete Event
            </button>
            <h1 className="text-3xl font-black text-yellow-400 mb-6 drop-shadow-lg tracking-wide">{analysis.data.eventTitle}</h1>
            <div className="mb-6 flex flex-col md:flex-row gap-6 md:gap-16">
              <div>
                <span className="font-semibold text-yellow-400">Total Tickets Booked:</span>
                <span className="ml-2 text-lg font-bold">{analysis.data.totalTickets}</span>
              </div>
              <div>
                <span className="font-semibold text-yellow-400">Total Registrants:</span>
                <span className="ml-2 text-lg font-bold">{analysis.data.totalRegistrants}</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 mt-8 drop-shadow-lg tracking-tight">Registrant Details</h2>
            {!analysis.data.registrants || analysis.data.registrants.length === 0 ? (
              <div className="text-gray-400">No registrants yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-yellow-400 text-base">Name</th>
                      <th className="px-4 py-3 text-left text-yellow-400 text-base">Email</th>
                      <th className="px-4 py-3 text-left text-yellow-400 text-base">Phone</th>
                      <th className="px-4 py-3 text-left text-yellow-400 text-base">Registered At</th>
                      <th className="px-4 py-3 text-left text-yellow-400 text-base">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.data.registrants.map((r, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-gray-800/60" : "bg-gray-800/30"}>
                        <td className="px-4 py-3 rounded-l-xl">{r.name}</td>
                        <td className="px-4 py-3">{r.email}</td>
                        <td className="px-4 py-3">{r.phone}</td>
                        <td className="px-4 py-3">{new Date(r.registeredAt).toLocaleString()}</td>
                        <td className="px-4 py-3 rounded-r-xl">{r.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAnalysis; 