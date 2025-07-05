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
        const res = await fetch(`/api/events/${eventId}/analysis`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAnalysis({ ...data, registrants: data.registrants || [] });
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
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert('Event deleted successfully.');
        navigate('/your-events');
      } else {
        alert(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link to="/your-events" className="text-yellow-400 hover:underline mb-6 inline-block">← Back to Your Events</Link>
      {loading && <div className="text-gray-400">Loading analysis...</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && analysis && (
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/30 text-gray-300">
          <h1 className="text-3xl font-bold text-yellow-400 mb-4">{analysis.data.eventTitle}</h1>
          <div className="mb-4">
            <span className="font-semibold text-yellow-400">Total Tickets Booked:</span> {analysis.data.totalTickets}
          </div>
          <div className="mb-4">
            <span className="font-semibold text-yellow-400">Total Registrants:</span> {analysis.data.totalRegistrants}
          </div>
          <h2 className="text-2xl font-bold text-yellow-400 mt-8 mb-4">Registrant Details</h2>
          {!analysis.data.registrants || analysis.data.registrants.length === 0 ? (
            <div className="text-gray-400">No registrants yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-yellow-400">Name</th>
                    <th className="px-4 py-2 text-left text-yellow-400">Email</th>
                    <th className="px-4 py-2 text-left text-yellow-400">Phone</th>
                    <th className="px-4 py-2 text-left text-yellow-400">Registered At</th>
                    <th className="px-4 py-2 text-left text-yellow-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.data.registrants.map((r, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="px-4 py-2">{r.name}</td>
                      <td className="px-4 py-2">{r.email}</td>
                      <td className="px-4 py-2">{r.phone}</td>
                      <td className="px-4 py-2">{new Date(r.registeredAt).toLocaleString()}</td>
                      <td className="px-4 py-2">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleDelete}
            className="mb-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-all float-right"
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventAnalysis; 