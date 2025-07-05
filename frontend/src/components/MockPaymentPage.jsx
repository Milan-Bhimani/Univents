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
  const { eventId, eventTitle, ticketId, ticketName, ticketPrice, ticketQuantity } = location.state || {};
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
          const response = await fetch(`http://localhost:5000/api/events/${eventId}/purchase`, {
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
          const regRes = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
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
          await fetch('http://localhost:5000/api/users/tickets', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              eventId,
              eventTitle,
              eventDate: new Date().toISOString(),
              eventLocation: 'N/A',
              method: method,
              ticketName: 'Free Ticket',
              quantity: 1,
              purchaseDate: new Date().toISOString(),
              totalAmount: 0
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
        <FaCheckCircle className="text-6xl text-green-400 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Payment & Registration Successful!</h2>
        <p className="text-lg text-gray-300 mb-6">You are now registered for <span className="text-yellow-400 font-semibold">{eventTitle || 'the event'}</span>. This was a mock transaction.</p>
        <button onClick={() => navigate('/home')} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all">Go to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form onSubmit={handlePay} className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Mock Payment</h1>
        <div className="mb-6">
          <div className="flex justify-center gap-4 mb-4">
            {PAYMENT_METHODS.map((m) => (
              <button
                type="button"
                key={m.key}
                className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all ${method === m.key ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-gray-700 text-gray-300'}`}
                onClick={() => setMethod(m.key)}
              >
                {m.icon}
                <span className="mt-1 text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        {method === 'upi' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Choose UPI App</label>
              <div className="flex gap-3">
                {UPI_APPS.map((app) => (
                  <button
                    type="button"
                    key={app.name}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg border-2 transition-all ${upiApp === app.name ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-gray-700 text-gray-300'}`}
                    onClick={() => setUpiApp(app.name)}
                  >
                    {app.icon}
                    <span className="text-xs mt-1">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter your UPI ID (e.g. name@bank)"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white mb-4"
              required
            />
          </>
        )}
        {method === 'card' && (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Card Number (16 digits)"
              value={card.number}
              onChange={e => setCard({ ...card, number: e.target.value })}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
              maxLength={16}
              required
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={e => setCard({ ...card, expiry: e.target.value })}
                className="w-1/2 p-3 rounded bg-gray-900 border border-gray-700 text-white"
                maxLength={5}
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={card.cvv}
                onChange={e => setCard({ ...card, cvv: e.target.value })}
                className="w-1/2 p-3 rounded bg-gray-900 border border-gray-700 text-white"
                maxLength={3}
                required
              />
            </div>
          </div>
        )}
        {method === 'netbanking' && (
          <div className="mb-4">
            <select
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
              value={bank}
              onChange={e => setBank(e.target.value)}
              required
            >
              <option value="">Select Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="Axis">Axis Bank</option>
              <option value="Kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        )}
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all mt-2"
          disabled={registering}
        >
          {registering ? 'Processing...' : 'Pay Now (Mock)'}
        </button>
      </form>
    </div>
  );
} 