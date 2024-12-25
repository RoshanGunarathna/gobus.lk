const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const busManagementRoutes = require('./routes/busManagementRoutes');
const routeManagementRoutes = require('./routes/routeManagementRoutes');
const scheduleManagementRoutes = require('./routes/scheduleManagementRoutes');
const bookingManagementRoutes = require('./routes/bookingManagementRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables
const CustomError = require('./utils/customError');


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
? process.env.ALLOWED_ORIGINS.split(',') // Convert comma-separated string to array
: [];


// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., mobile apps or Postman)
          
            if ( !origin || allowedOrigins.includes(origin)) {
                console.log(origin);
                callback(null, true);
            } else {
                callback( new CustomError("Not allowed by CORS", 401));
                
            }
        },
        credentials: true, // Allow cookies
    })
);


// Security middleware
app.use(helmet()); // Adds security headers

// Rate limiting middleware
app.use(
    rateLimit({
        windowMs: 3 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per 15 minutes
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable `X-RateLimit-*` headers
    })
);

// Routes
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api/user', userRoutes);
app.use('/api/userManagement', userManagementRoutes); 
app.use('/api/busManagement', busManagementRoutes);
app.use('/api/routeManagement', routeManagementRoutes);
app.use('/api/scheduleManagement', scheduleManagementRoutes);
app.use('/api/bookingManagement', bookingManagementRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware (custom middleware for handling errors globally)
app.use(errorMiddleware);

// Export the app module
module.exports = app;
