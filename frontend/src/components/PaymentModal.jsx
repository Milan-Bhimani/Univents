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

const PaymentModal = ({ isOpen, onClose, amount, eventTitle, onSuccess }) => {
  if (!isOpen) return null;

  const handleSuccess = (paymentIntent) => {
    onSuccess(paymentIntent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700/50 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FiCreditCard className="w-8 h-8 text-yellow-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            eventTitle={eventTitle}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;