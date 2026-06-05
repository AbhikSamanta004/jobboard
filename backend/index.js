const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins or specify React app dev origin in production env
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser with 16MB limit to support base64 resumes and avatars
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));

// Sanity check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy and running.' });
});

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/notifications', require('./routes/notifications'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start listening if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
