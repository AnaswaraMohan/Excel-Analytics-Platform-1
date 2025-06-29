const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if not using OAuth
        return !this.provider;
      },
    },
    provider: {
      type: String,
      enum: ['local', 'github', 'google'],
      default: 'local',
    },
    providerId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (only for local users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.provider !== 'local') {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password (only for local users)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.provider !== 'local') {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
