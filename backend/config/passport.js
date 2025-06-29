const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || !profile.emails[0]) {
      return done(new Error('GitHub profile does not contain email information'), null);
    }

    // Check if user already exists by email or provider ID
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails[0].value },
        { providerId: profile.id.toString(), provider: 'github' }
      ]
    });

    if (user) {
      // Update provider info if user exists but doesn't have GitHub provider
      if (user.provider !== 'github') {
        user.provider = 'github';
        user.providerId = profile.id.toString();
        if (profile.photos && profile.photos[0]) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      provider: 'github',
      providerId: profile.id.toString(),
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
    });

    return done(null, user);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || !profile.emails[0]) {
      return done(new Error('Google profile does not contain email information'), null);
    }

    // Check if user already exists by email or provider ID
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails[0].value },
        { providerId: profile.id, provider: 'google' }
      ]
    });

    if (user) {
      // Update provider info if user exists but doesn't have Google provider
      if (user.provider !== 'google') {
        user.provider = 'google';
        user.providerId = profile.id;
        if (profile.photos && profile.photos[0]) {
          user.avatar = profile.photos[0].value;
        }
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id,
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

module.exports = passport; 