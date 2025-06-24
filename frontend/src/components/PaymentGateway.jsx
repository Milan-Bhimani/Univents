import React, { useState } from 'react';
import { FaCreditCard, FaLock } from 'react-icons/fa';

export default function PaymentGateway({ amount, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Create a payment intent with Stripe
      // 2. Process the payment with Stripe Elements
      // 3. Confirm the payment on your backend
      
      onSuccess();
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Payment Details</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <FaLock className="mr-2" />
            <span>Secure Payment</span>
          </div>
          <p className="text-sm mt-2">Amount to pay: ₹{amount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-yellow-400/90 font-medium">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white pl-10"
                  required
                  maxLength="19"
                />
                <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                  maxLength="5"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-yellow-400/90 font-medium">CVC</label>
                <input
                  type="text"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvc: e.target.value }))}
                  placeholder="123"
                  className="w-full bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-xl text-white"
                  required
                  maxLength="3"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}