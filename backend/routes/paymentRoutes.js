const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const protect = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', eventTitle } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency,
      metadata: {
        eventTitle: eventTitle || 'Event Ticket',
        userId: req.user._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Here you would update your database to record the successful payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;