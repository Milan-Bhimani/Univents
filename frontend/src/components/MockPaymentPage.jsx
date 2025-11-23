import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaGooglePay, FaPhone, FaCreditCard, FaUniversity, FaCheckCircle, FaMoneyCheckAlt } from 'react-icons/fa';
import { SiPaytm } from 'react-icons/si';

const UPI_APPS = [
  { name: 'Google Pay', icon: <FaGooglePay className="text-2xl text-blue-500" /> },
  { name: 'PhonePe', icon: <FaPhone className="text-2xl text-purple-500" /> },
  { name: 'Paytm', icon: <SiPaytm className="text-2xl text-blue-400" /> },
];

const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI', icon: <FaMoneyCheckAlt className="text-xl" /> },
  { key: 'card', label: 'Credit/Debit Card', icon: <FaCreditCard className="text-xl" /> },
  { key: 'netbanking', label: 'Netbanking', icon: <FaUniversity className="text-xl" /> },
];

export default function MockPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location.state
  const { event, ticket } = location.state || {};
  const eventId = event?._id;
  const eventTitle = event?.title;
  const ticketId = ticket?._id;
  const ticketName = ticket?.name;
  const ticketPrice = ticket?.price || 0;
  const ticketQuantity = 1; // Default to 1 ticket
  
  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [bank, setBank] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    if (method === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setError('Enter a valid UPI ID');
        return;
      }
    } else if (method === 'card') {
      if (!/^\d{16}$/.test(card.number) || !/^\d{2}\/\d{2}$/.test(card.expiry) || !/^\d{3}$/.test(card.cvv)) {
        setError('Enter valid card details');
        return;
      }
    } else if (method === 'netbanking') {
      if (!bank) {
        setError('Select a bank');
        return;
      }
    }
    setRegistering(true);
    setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        if (eventId && ticketId) {
          // Ticketed event: call /purchase
          const response = await fetch(`https://univents-764n.onrender.com/api/events/${eventId}/purchase`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ticketId, quantity: ticketQuantity || 1 })
          });
          if (!response.ok) {
            const data = await response.json();
            setError(data.message || 'Failed to purchase ticket');
            setRegistering(false);
            return;
          }
        } else if (eventId) {
          // Free event: call /register, then add a free ticket to user.tickets
          const regRes = await fetch(`https://univents-764n.onrender.com/api/events/${eventId}/register`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!regRes.ok) {
            const data = await regRes.json();
            setError(data.message || 'Failed to register for event');
            setRegistering(false);
            return;
          }
          // Add a free ticket to user.tickets (mock)
          await fetch('https://univents-764n.onrender.com/api/users/tickets', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              eventId,
              eventTitle,
              eventLocation: event?.location || 'N/A',
              eventDate: event?.date || new Date().toISOString(),
              method: method,
              ticketName: ticketName || (ticket ? ticket.name : 'Ticket'),
              ticketPrice: ticketPrice || 0,
              quantity: 1,
              purchaseDate: new Date().toISOString(),
              totalAmount: ticketPrice || 0
            })
          });
        }
        setSuccess(true);
        setRegistering(false);
      } catch (err) {
        setError('Failed to complete registration');
        setRegistering(false);
      }
    }, 1200);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/30 shadow-2xl text-center max-w-md">
          <FaCheckCircle className="text-7xl text-green-400 mb-6 mx-auto" />
          <h2 className="text-4xl font-black text-white mb-4">Payment & Registration Successful!</h2>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            You are now registered for <span className="text-yellow-400 font-bold">{eventTitle || 'the event'}</span>. 
            This was a mock transaction.
          </p>
          <button 
            onClick={() => navigate('/home')} 
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-start pt-8 pb-16 px-2 sm:px-6 md:px-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-yellow-400 mb-2 drop-shadow-lg tracking-wide">Mock Payment</h1>
            <p className="text-gray-400 text-lg">Complete your event registration</p>
          </div>

          <form onSubmit={handlePay} className="space-y-8">
            {/* Event and Ticket Information */}
            {event && ticket && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Event & Ticket Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Event:</span>
                    <span className="text-white font-semibold ml-2">{eventTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Ticket:</span>
                    <span className="text-white font-semibold ml-2">{ticketName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <span className="text-yellow-400 font-bold ml-2">
                      {ticketPrice === 0 ? 'Free' : `₹${ticketPrice}`}
                    </span>
                  </div>
                  {ticket.description && (
                    <div>
                      <span className="text-gray-400">Description:</span>
                      <span className="text-gray-300 ml-2">{ticket.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-4">Choose Payment Method</h3>
              <div className="grid grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    type="button"
                    key={m.key}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      method === m.key ? 
                      'border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-yellow-400/20' : 
                      'border-gray-700 text-gray-300 hover:border-yellow-400/50 bg-gray-700/30'
                    }`}
                    onClick={() => setMethod(m.key)}
                  >
                    <div className="text-2xl mb-2">{m.icon}</div>
                    <span className="text-sm font-bold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI Payment Section */}
            {method === 'upi' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-yellow-400 font-bold text-lg mb-4">Choose UPI App</label>
                  <div className="grid grid-cols-3 gap-4">
                    {UPI_APPS.map((app) => (
                      <button
                        type="button"
                        key={app.name}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                          upiApp === app.name ? 
                          'border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-yellow-400/20' : 
                          'border-gray-700 text-gray-300 hover:border-yellow-400/50 bg-gray-700/30'
                        }`}
                        onClick={() => setUpiApp(app.name)}
                      >
                        <div className="text-2xl mb-2">{app.icon}</div>
                        <span className="text-sm font-bold">{app.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-yellow-400 font-bold text-lg mb-3">UPI ID</label>
                  <input
                    type="text"
                    placeholder="Enter your UPI ID (e.g. name@bank)"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            {/* Card Payment Section */}
            {method === 'card' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-yellow-400 font-bold text-lg mb-3">Card Number</label>
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    value={card.number}
                    onChange={e => setCard({ ...card, number: e.target.value })}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    maxLength={16}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-400 font-bold text-lg mb-3">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-400 font-bold text-lg mb-3">CVV</label>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value })}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking Section */}
            {method === 'netbanking' && (
              <div>
                <label className="block text-yellow-400 font-bold text-lg mb-3">Select Bank</label>
                <select
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  required
                >
                  <option value="" className="bg-gray-800">Select Bank</option>
                  <option value="SBI" className="bg-gray-800">State Bank of India</option>
                  <option value="HDFC" className="bg-gray-800">HDFC Bank</option>
                  <option value="ICICI" className="bg-gray-800">ICICI Bank</option>
                  <option value="Axis" className="bg-gray-800">Axis Bank</option>
                  <option value="Kotak" className="bg-gray-800">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-lg bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 font-semibold text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={registering}
            >
              {registering ? 'Processing...' : 'Pay Now (Mock)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 