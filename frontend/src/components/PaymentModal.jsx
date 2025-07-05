import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FiX, FiCreditCard, FiLock } from 'react-icons/fi';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const CheckoutForm = ({ amount, eventTitle, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent on backend
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          eventTitle
        })
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name',
          },
        }
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9ca3af',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <FiLock className="mr-2" />
          <span className="font-semibold">Secure Payment</span>
        </div>
        <p className="text-sm">Event: {eventTitle}</p>
        <p className="text-lg font-bold">Total: ₹{amount.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-yellow-400/90 font-medium">Card Details</label>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-yellow-400 text-gray-900 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ event, open, onClose, onPaymentSuccess }) => {
  const [method, setMethod] = useState('upi');
  const [upi, setUpi] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const validateUpi = (value) => /^[\w.-]+@[\w.-]+$/.test(value);
  const validateCard = (c) =>
    /^\d{16}$/.test(c.number) &&
    /^\d{2}\/\d{2}$/.test(c.expiry) &&
    /^\d{3}$/.test(c.cvv);

  const handlePay = () => {
    setError('');
    if (method === 'upi') {
      if (!validateUpi(upi)) {
        setError('Invalid UPI ID');
        return;
      }
    } else {
      if (!validateCard(card)) {
        setError('Invalid card details');
        return;
      }
    }
    setSuccess(true);
    setTimeout(() => {
      onPaymentSuccess({
        eventId: event._id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        method,
        paidAt: new Date().toISOString(),
      });
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4">Mock Payment</h2>
        <div className="mb-4">
          <label className="mr-4">
            <input type="radio" checked={method === 'upi'} onChange={() => setMethod('upi')} /> UPI
          </label>
          <label>
            <input type="radio" checked={method === 'card'} onChange={() => setMethod('card')} /> Card
          </label>
        </div>
        {method === 'upi' ? (
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. name@bank)"
            value={upi}
            onChange={e => setUpi(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 mb-3"
          />
        ) : (
          <div className="space-y-2 mb-3">
            <input
              type="text"
              placeholder="Card Number (16 digits)"
              value={card.number}
              onChange={e => setCard({ ...card, number: e.target.value })}
              className="w-full p-3 rounded bg-gray-800"
              maxLength={16}
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={e => setCard({ ...card, expiry: e.target.value })}
                className="w-1/2 p-3 rounded bg-gray-800"
                maxLength={5}
              />
              <input
                type="text"
                placeholder="CVV"
                value={card.cvv}
                onChange={e => setCard({ ...card, cvv: e.target.value })}
                className="w-1/2 p-3 rounded bg-gray-800"
                maxLength={3}
              />
            </div>
          </div>
        )}
        {error && <div className="text-red-400 mb-2">{error}</div>}
        {success ? (
          <div className="text-green-400 font-bold text-center py-4">Payment Successful!</div>
        ) : (
          <button
            onClick={handlePay}
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-xl hover:bg-yellow-500 transition"
          >
            Confirm & Get Ticket
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;