import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';

export default function BuyTickets() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://univents-764n.onrender.com/api/events/${eventId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to purchase tickets');
      }

      // Navigate to confirmation page or user's tickets
      navigate('/my-tickets');
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center p-6 pt-24">
      <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Purchase Tickets</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Number of Tickets
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between text-gray-300 mb-2">
              <span>Price per ticket</span>
              <span>$50.00</span>
            </div>
            <div className="flex justify-between text-gray-300 mb-2">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="border-t border-gray-600 my-2"></div>
            <div className="flex justify-between text-white font-bold">
              <span>Total</span>
              <span>${(50 * quantity).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg flex items-center justify-center space-x-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FaTicketAlt />
                <span>Purchase Tickets</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}