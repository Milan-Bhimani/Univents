require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Environment check

// Define fallback values
const fallback_mongodb_uri = 'mongodb://localhost:27017/univents';
const fallback_jwt_secret = 'your-fallback-secret-key-here';
const fallback_jwt_expires_in = '86400';
const fallback_port = 5000;

dotenv.config();

// Validate required environment variables with fallbacks
const requiredEnvVars = [
  { key: 'MONGODB_URI', fallback: fallback_mongodb_uri },
  { key: 'JWT_SECRET', fallback: fallback_jwt_secret },
  { key: 'JWT_EXPIRES_IN', fallback: fallback_jwt_expires_in }
];
const missingEnvVars = requiredEnvVars
  .filter(envVar => !process.env[envVar.key] && !envVar.fallback)
  .map(envVar => envVar.key);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables with no fallbacks:', missingEnvVars.join(', '));
  process.exit(1);
}

// Assign fallbacks if environment variables are missing
const MONGODB_URI = process.env.MONGODB_URI || fallback_mongodb_uri;
const JWT_SECRET = process.env.JWT_SECRET || fallback_jwt_secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || fallback_jwt_expires_in;



const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otpRoutes');
const eventRoutes = require('./routes/eventRoutes');
const locationRoutes = require('./routes/locationRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many OTP verification attempts, please try again later'
});

const app = express();

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://univents-dun.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Webhook route (before express.json middleware)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/payments', paymentRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  heartbeatFrequencyMS: 2000,
  retryWrites: true,
  maxPoolSize: 10
};

const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format'
    });
  }
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || fallback_port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});