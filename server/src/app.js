const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const rateLimit = require("express-rate-limit");
const {cors} = require("cors");
const {helmet} = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));

app.use(helmet());

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests
    })
);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
