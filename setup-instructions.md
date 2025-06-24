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

# Install additional dependencies that were added
npm install lodash

# Create .env file (copy from .env.example if available)
# Add the following environment variables:
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

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

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

# Install additional dependencies that were added
npm install lodash.debounce

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

## 4. Email Setup (for OTP functionality)

### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use this app password in EMAIL_PASSWORD

## 5. Complete Installation Commands

### Backend Dependencies:
```bash
cd backend
npm install bcryptjs cors dotenv express express-rate-limit express-validator jsonwebtoken mongoose multer nodemailer validator lodash
npm install --save-dev nodemon
```

### Frontend Dependencies:
```bash
cd frontend
npm install framer-motion prop-types react react-avatars react-datepicker react-dom react-dropzone react-icons react-router-dom lodash.debounce
npm install --save-dev @types/react @types/react-dom @vitejs/plugin-react autoprefixer eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss vite
```

## 6. Running the Application

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

## 7. Features Available

✅ **User Authentication**
- Email/Password signup and login
- OTP verification via email
- JWT-based authentication

✅ **Location-Based Discovery**
- Geolocation integration
- Nearby events within customizable radius
- Distance calculation and display

✅ **AI-Powered Recommendations**
- Interest-based matching
- Collaborative filtering
- Content-based filtering
- Popularity-based suggestions

✅ **Event Management**
- Create, edit, and publish events
- Rich event data with categories, interests, difficulty
- Geospatial indexing for location queries
- Event registration and ticketing

✅ **Personalized Experience**
- Interest selection and preferences
- Location permission handling
- Personalized dashboard
- Real-time event updates

## 8. API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/otp/generate` - Generate OTP
- POST `/api/otp/verify` - Verify OTP

### Events
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get single event
- POST `/api/events/create` - Create event
- POST `/api/events/:id/register` - Register for event

### Location-Based
- GET `/api/location/nearby-events` - Get nearby events
- GET `/api/location/recommended-events` - Get location-based recommendations
- PUT `/api/location/update-location` - Update user location

### Recommendations
- GET `/api/recommendations/personalized` - Get AI recommendations
- PUT `/api/recommendations/preferences` - Update user preferences

## 9. Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   # Or check the connection string in .env
   ```

2. **Email OTP Not Working**
   - Verify Gmail app password is correct
   - Check EMAIL_USER and EMAIL_PASSWORD in .env

3. **Location Not Working**
   - Ensure HTTPS or localhost (required for geolocation)
   - Check browser permissions for location access

4. **Dependencies Issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 10. Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_USER=your-production-email
EMAIL_PASSWORD=your-production-email-password
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

## 11. Testing the Application

1. **Start both servers** (backend on :5000, frontend on :5173)
2. **Open browser** to http://localhost:5173
3. **Sign up** with a new account
4. **Verify email** with OTP
5. **Set interests** and **allow location** access
6. **Browse personalized events** and **create new events**

The application is now fully functional with all hyperlocal features!