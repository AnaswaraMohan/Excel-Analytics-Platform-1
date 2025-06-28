const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/users', require('./routes/usersRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Excel Analytics Platform API' });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
