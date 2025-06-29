const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const passport = require('./config/passport');

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Excel Analytics Platform API' });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
