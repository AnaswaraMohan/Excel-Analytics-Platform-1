const express = require('express');
const passport = require('passport');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  oauthCallback,
  oauthFailure,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Local authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api/auth/github/failure' }),
  oauthCallback
);
router.get('/github/failure', oauthFailure);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/auth/google/failure' }),
  oauthCallback
);
router.get('/google/failure', oauthFailure);

module.exports = router;
