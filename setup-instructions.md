# UniVents - Hyperlocal Event Finder Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install all backend dependencies
npm install

# Create .env file with the following environment variables:
```

Create a `.env` file in the backend directory with:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/univents
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/univents

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Email Configuration (for OTP and notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

```bash
# Start the backend server
npm run dev
# OR
npm start
```

## 2. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install all frontend dependencies
npm install

# Start the frontend development server
npm run dev
```

## 3. Database Setup

### Option A: Local MongoDB
```bash
# Install MongoDB locally (if not already installed)
# On macOS:
brew install mongodb-community

# On Ubuntu:
sudo apt-get install mongodb

# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Ubuntu:
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update MONGODB_URI in your .env file

## 4. Email Setup (for OTP and Event Notifications)

### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in EMAIL_PASSWORD

## 5. Payment Setup (Stripe Integration)

### Stripe Setup:
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add the keys to your .env file:
   - STRIPE_SECRET_KEY (starts with sk_test_)
   - STRIPE_PUBLISHABLE_KEY (starts with pk_test_)

## 6. Complete Installation Commands

### Backend Dependencies:
```bash
cd backend
npm install bcryptjs cors dotenv express express-rate-limit express-session express-validator jsonwebtoken lodash mongoose multer nodemailer passport passport-google-oauth20 stripe validator
npm install --save-dev nodemon
```

### Frontend Dependencies:
```bash
cd frontend
npm install @react-google-maps/api @stripe/react-stripe-js @stripe/stripe-js framer-motion leaflet lodash.debounce prop-types react react-avatars react-datepicker react-dom react-dropzone react-icons react-leaflet react-router-dom
npm install --save-dev @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss vite
```

## 7. Running the Application

### Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:5173

## 8. Features Available

✅ **User Authentication & Security**
- Email/Password signup and login
- OTP verification via email
- Password reset functionality with OTP
- JWT-based authentication
- Google OAuth integration
- Account security settings (email/password change)

✅ **Location-Based Discovery**
- Geolocation integration with browser permissions
- Interactive maps with Leaflet and Google Maps
- Nearby events within customizable radius
- Distance calculation and display
- Reverse geocoding for address detection
- Location-based event recommendations

✅ **AI-Powered Recommendations**
- Interest-based matching
- Collaborative filtering
- Content-based filtering
- Popularity-based suggestions
- User preference management
- Personalized event discovery

✅ **Event Management**
- Create, edit, and publish events
- Rich event data with categories, interests, difficulty levels
- Geospatial indexing for location queries
- Event registration and ticketing system
- Event notifications via email
- Event status management (draft, published, cancelled, completed)

✅ **Payment & Ticketing System**
- Stripe payment integration
- Ticket creation and management
- Free and paid event support
- Mock payment processing for development
- Ticket display in user profile
- Payment confirmation and receipt

✅ **User Profile & Social Features**
- Comprehensive user profiles with interests and preferences
- Profile editing with location detection
- Interest selection and tag management
- User analytics and engagement tracking
- Social features (following/followers system)
- Gamification elements (points, badges)

✅ **Advanced Features**
- Real-time event updates
- Event analytics and metrics
- Multi-tier ticketing system
- External link integrations
- Event prerequisites and difficulty levels
- Comprehensive search and filtering

## 9. API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Password reset request
- POST `/api/otp/generate` - Generate OTP
- POST `/api/otp/verify` - Verify OTP

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- POST `/api/events/create` - Create event
- POST `/api/events/:id/register` - Register for event (free)
- POST `/api/events/:id/purchase` - Purchase ticket (paid)

### Location-Based
- GET `/api/location/nearby-events` - Get nearby events
- GET `/api/location/recommended-events` - Get location-based recommendations
- PUT `/api/location/update-location` - Update user location

### Recommendations
- GET `/api/recommendations/personalized` - Get AI recommendations
- PUT `/api/recommendations/preferences` - Update user preferences

### Payments
- POST `/api/payments/create-payment-intent` - Create Stripe payment intent
- POST `/api/payments/confirm-payment` - Confirm payment

### User Management
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/tickets` - Get user tickets
- PUT `/api/users/interests` - Update user interests
- PUT `/api/users/change-email` - Change user email
- PUT `/api/users/change-password` - Change user password

## 10. Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   # Or check the connection string in .env
   ```

2. **Email Not Working**
   - Verify Gmail app password is correct
   - Check EMAIL_USER and EMAIL_PASSWORD in .env
   - Ensure 2FA is enabled on Gmail account

3. **Location Not Working**
   - Ensure HTTPS or localhost (required for geolocation)
   - Check browser permissions for location access

4. **Payment Integration Issues**
   - Verify Stripe API keys are correct
   - Check STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in .env
   - Ensure you're using test keys for development

5. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

6. **Environment Variables Not Loading**
   - Ensure you're running the backend from a terminal (not VS Code integrated terminal)
   - Check that .env file is in the backend directory
   - Verify .env file has no extra spaces or quotes
   - Restart the server after making changes to .env file

7. **Map Integration Issues**
   - Ensure you have valid Google Maps API key (if using Google Maps)
   - Check browser console for map-related errors
   - Verify location permissions are granted in browser

## 11. Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_USER=your-production-email
EMAIL_PASSWORD=your-production-email-password
STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_key
```

### Build Commands:
```bash
# Frontend build
cd frontend
npm run build

# Backend (already production ready)
cd backend
npm start
```

## 12. Testing the Application

1. **Start both servers** (backend on :5000, frontend on :5173)
2. **Open browser** to http://localhost:5173
3. **Sign up** with a new account
4. **Verify email** with OTP
5. **Set interests** and **allow location** access
6. **Browse personalized events** and **create new events**
7. **Test payment flow** with Stripe test cards
8. **Verify tickets** appear in user profile
9. **Test profile editing** and location detection
10. **Test account security** features (email/password change)

### Test Payment Cards (Stripe Test Mode):
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### Testing Checklist:
- [ ] User registration and OTP verification
- [ ] Event creation and publishing
- [ ] Location-based event discovery
- [ ] Payment processing and ticket creation
- [ ] Profile management and editing
- [ ] Account security features
- [ ] Email notifications
- [ ] Map integration and geolocation

## 13. Project Structure

```
univents/
├── backend/
│   ├── controllers/     # Business logic (auth, events, users, etc.)
│   ├── middleware/      # Authentication & validation
│   ├── models/         # MongoDB schemas (User, Event, etc.)
│   ├── routes/         # API endpoints
│   ├── utils/          # Utilities (mailer, etc.)
│   ├── scripts/        # Database scripts and cleanup
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/ # React components (UI elements)
│   │   ├── pages/      # Page components (routes)
│   │   ├── utils/      # Frontend utilities and helpers
│   │   └── App.jsx     # Main app component
│   ├── public/         # Static assets
│   └── dist/           # Build output (production)
├── .gitignore          # Git ignore rules
└── setup-instructions.md
```

## 14. Development Notes

### Key Technologies Used:
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Payment**: Stripe API
- **Maps**: Leaflet, Google Maps API
- **Email**: Nodemailer with Gmail SMTP
- **Authentication**: JWT, OTP verification

### Development Workflow:
1. Backend development with hot reload (nodemon)
2. Frontend development with Vite dev server
3. Database changes require server restart
4. Environment variables need server restart to take effect

### Security Features:
- JWT token-based authentication
- OTP verification for sensitive operations
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization

The application is now fully functional with all hyperlocal features, payment integration, ticketing system, and comprehensive user management!